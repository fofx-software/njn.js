describe('FXCollection', function() {

beforeEach(function() {
  jasmine.addMatchers({

    toHaveMethod: function() {
      return {
        compare: function(actual, expected) {
          return {
            pass: fxjs.isFunction(actual[expected])
          };
        }
      };
    },

    toHaveProperty: function() {
      return {
        compare: function(actual, expected) {
          return {
            pass: (expected in actual) && !fxjs.isFunction(actual[expected])
          };
        }
      };
    }

  });
});

describe('fxjs.collection()', function() {
  describe('when only a name is given', function() {
    describe('if a collection has not already been registered with that name', function() {
      it('initializes, registers and returns a new FXCollection', function() {
        expect(fxjs.registeredCollections['newCollection']).toBeUndefined();
        var newCollection = fxjs.collection('newCollection');
        expect(fxjs.registeredCollections['newCollection']).toBe(newCollection);
        expect(newCollection).toEqual(jasmine.any(fxjs.Collection));
      });
    });

    describe('if a collection has been registered with that name', function() {
      it('throws an error', function() {
        expect(function() { fxjs.collection('newCollection'); }).toThrow();
      });
    });
  });

  describe('when a name and model are given', function() {
    describe('if a collection has not already been registered with that name', function() {
      it('initializes, registers and returns a new FXCollection', function() {
        expect(fxjs.registeredCollections['collectionWithModel']).toBeUndefined();
        newCollection = fxjs.collection('collectionWithModel', {});
        expect(fxjs.registeredCollections['collectionWithModel']).toBe(newCollection);
        expect(newCollection).toEqual(jasmine.any(fxjs.Collection));
      });
    });

    describe('if a collection has been registered with that name', function() {
      it('throws an error', function() {
        var collectionWithModel = function() { fxjs.collection('collectionWithModel', {}); }
        expect(collectionWithModel).toThrow();
      });
    });
  });
});

describe('.defineModel()', function() {
  var newCollection = new fxjs.Collection;

  it('gives the collection a memberModel', function() {
    expect(newCollection.memberModel).toBeUndefined();
    newCollection.defineModel();
    expect(newCollection.memberModel).toBeDefined();
  });

  describe('the memberModel', function() {
    it('is an instance of FXModel', function() {
      expect(newCollection.memberModel).toEqual(jasmine.any(fxjs.Collection.Model));
    });
  });

  describe('when given an object argument', function() {
    var withCustomModel = new fxjs.Collection;
    withCustomModel.defineModel({ prop1: 'someVal', boolProp: true });

    describe('each property of the given object', function() {
      it('is copied to the memberModel', function() {
        expect(withCustomModel.memberModel).toHaveProperty('prop1');
      });

      describe('when its initial value is a boolean', function() {
        it('is translated into a new collection scope', function() {
          expect(withCustomModel.registeredScopes).toHaveProperty('boolProp');
        });

        describe('the generated collection scope', function() {
          it('has a filter property which is just the name of the property', function() {
            expect(withCustomModel.registeredScopes.boolProp.filter).toBe('boolProp');
          });
        });
      });
    });
  });
});

describe('.addMembers()', function() {
  var withModel = (new fxjs.Collection).defineModel({
    prop: 'someVal',
    boolProp: true
  });

  var withoutModel = new fxjs.Collection;

  describe('when called on a collection without a memberModel', function() {
    it('simply adds the given candidates to collection\'s members array', function() {
      withoutModel.addMembers(1, 'a', false);
      expect(withoutModel.members).toEqual([1,'a',false]);
    });
  });

  describe('when called on a collection with a memberModel', function() {
    withModel.addMembers({ prop: 'myVal', prop1: 'otherVal' });

    describe('any property of a candidate that is not in the memberModel', function() {
      it('is ignored', function() {
        expect('prop1' in withModel.members[0]).toBe(false);
      });
    });

    describe('the value of any property of a candidate that is in the memberModel', function() {
      it('is applied to that property in the new member', function() {
        expect(withModel.members[0].prop).toBe('myVal');
      });
    });

    describe('when a property defined in the memberModel is not defined in a candidate', function() {
      describe('the property', function() {
        it('is not defined on the new member, which inherits from the memberModel', function() {
          expect(withModel.members[0].hasOwnProperty('boolProp')).toBe(false);
          expect('boolProp' in withModel.members[0]).toBe(true);
        });
      });
    });
  });
});

describe('.scope()', function() {
  var withScope = new fxjs.Collection;

  withScope.addMembers(
    { rank: 3, keepMe: false, funcProp: function() { return false; }                                       },
    { rank: 1, keepMe: false, funcProp: function() { return true;  }, varyProp: 'b'                        },
    { rank: 2, keepMe: true,  funcProp: function() { return false; }, varyProp: function() { return 'a'; } }
  );

  var originalMembers = Array.prototype.slice.call(withScope.members);

  withScope.registeredScopes.keepers = { filter: 'keepMe' };
  withScope.registeredScopes.weepers = {
    filter: function() { return this.rank > 1; }
  };

  describe('when scope is not defined', function() {
    it('returns nothing', function() {
      expect(withScope.scope('notDefined')).toBeUndefined();
      expect(withScope.scope()).toBeUndefined();
    });
  });

  describe('its single argument', function() {
    it('can be a pre-registered scope', function() {
      expect(withScope.registeredScopes.keepers).toBeDefined();
      expect(withScope.scope('keepers')).toEqual(jasmine.any(Array));
    });

    it('can be an object', function() {
      expect(withScope.scope({})).toBeDefined();
    });
  });

  describe('when scope is defined', function() {
    describe('when scope.filter is defined', function() {
      describe('when scope.filter is a string', function() {
        describe('when scope.filter is "all"', function() {
          it('returns all members', function() {
            expect(withScope.scope({ filter: 'all' })).toEqual(withScope.members);
          });
        });

        describe('when the string corresponds to a property in the members', function() {
          it('filters the members according to the property', function() {
            expect(withScope.scope('keepers')).toEqual([withScope.members[2]]);
          });
        });

        describe('when the string does not correspond to a property in the members', function() {
          it('returns an empty array', function() {
            expect(withScope.scope({ filter: 'notDefined' })).toEqual([]);
            expect(withScope.scope({ filter: '!defined' })).toEqual([]);
          });
        });
      });

      describe('when scope.filter is a function', function() {
        it('filters the members by applying the function to each one', function() {
          expect(withScope.scope('weepers')).toEqual([withScope.members[0], withScope.members[2]]);
        });
      });
    });

    describe('when scope.filter is not defined', function() {
      it('returns all members', function() {
        expect(withScope.scope({})).toEqual(withScope.members);
      });
    });

    describe('when scope.sort is defined', function() {
      describe('when scope.sort is a string', function() {
        describe('when the string corresponds to a property in the members', function() {
          it('sorts members according to the property', function() {
            var sorted = withScope.scope({ sort: 'rank' });
            expect(sorted[0]).toBe(withScope.members[1]);
            expect(sorted[1]).toBe(withScope.members[2]);
            expect(sorted[2]).toBe(withScope.members[0]);
          });

          describe('when the property is a boolean value', function() {
            it('sorts from false to true', function() {
              var sortedBool = withScope.scope({ sort: 'keepMe' });
              expect(sortedBool[2]).toBe(withScope.members[2]);
            });

            describe('its negated version', function() {
              it('sorts from true to false', function() {
                var sortedBool = withScope.scope({ sort: '!keepMe' });
                expect(sortedBool[0]).toBe(withScope.members[2]);
              });
            });
          });

          describe('when the property is a function', function() {
            it('sorts by the return value', function() {
              var sortedFunc = withScope.scope({ sort: 'funcProp' });
              expect(sortedFunc[0]).toBe(withScope.members[0]);
              expect(sortedFunc[1]).toBe(withScope.members[2]);
              expect(sortedFunc[2]).toBe(withScope.members[1]);
            });

            describe('when the property name is banged', function() {
              it('toggles the truthiness of the return value', function() {
              var sortedFunc = withScope.scope({ sort: '!funcProp' });
              expect(sortedFunc[0]).toBe(withScope.members[1]);
              expect(sortedFunc[1]).toBe(withScope.members[0]);
              expect(sortedFunc[2]).toBe(withScope.members[2]);
              });
            });
          });

          describe('when the property types are mixed among the various members', function() {
            it('sorts by the values or return values of functions, as applicable', function() {
              var sortedMixed = function() { withScope.scope({ sort: 'varyProp' }); }
              expect(sortedMixed).toThrowError(TypeError);
            });
          });
        });

        describe('when the string does not correspond to a property in the members', function() {
          it('does not affect the sorting of members', function() {
            var sorted = withScope.scope({ sort: 'notDefined' });
            expect(sorted).toEqual(withScope.members);

            var bangSorted = withScope.scope({ sort: '!defined' });
            expect(bangSorted).toEqual(withScope.members);
          });
        });
      });

      describe('when scope.filter is a function', function() {
        it('sorts by the return value of the function called on each member', function() {
          var sortedFunc = withScope.scope({
            sort: function(member) {
              if(fxjs.isDefined(member.varyProp)) {
                if(fxjs.isFunction(member.varyProp)) {
                  return member.varyProp();
                } else {
                  return member.varyProp;
                }
              } else {
                return 'zzz';
              }
            }
          });

          expect(sortedFunc[0]).toBe(withScope.members[2]);
          expect(sortedFunc[1]).toBe(withScope.members[1]);
          expect(sortedFunc[2]).toBe(withScope.members[0]);
        });
      });
    });
  });

  it('does not alter the members array', function() {
    expect(withScope.members).toEqual(originalMembers);
  });
});

});
