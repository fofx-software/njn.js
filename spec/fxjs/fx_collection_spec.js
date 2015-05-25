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
  describe('when no argument is given', function() {
    it('initializes and returns a new FXCollection', function() {
      var newCollection = fxjs.collection();
      expect(newCollection).toEqual(jasmine.any(fxjs.Collection));
    });
  });

  describe('when a model is given', function() {
    it('initializes and returns a new FXCollection', function() {
      var newCollection = fxjs.collection({});
      expect(newCollection).toEqual(jasmine.any(fxjs.Collection));
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
      expect(newCollection.memberModel).toEqual(jasmine.any(fxjs.Model));
    });
  });

  describe('when given an object argument', function() {
    var withCustomModel = new fxjs.Collection;
    withCustomModel.defineModel({ prop1: 'someVal', boolProp: true });

    describe('each property of the given object', function() {
      it('is copied to the memberModel\'s stored model', function() {
        expect(withCustomModel.memberModel.model).toHaveProperty('prop1');
        expect(withCustomModel.memberModel.model).toHaveProperty('boolProp');
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
        expect(withModel.members[0].hasOwnProperty('prop1')).toBe(false);
      });
    });

    describe('the value of any property of a candidate that is in the memberModel', function() {
      it('is applied to that property in the new member', function() {
        expect(withModel.members[0].prop).toBe('myVal');
      });
    });

    describe('when a property defined in the memberModel is not defined in a candidate, the property', function() {
      it('is also defined in the new member, with the default value from the memberModel', function() {
        expect(withModel.members[0].hasOwnProperty('boolProp')).toBe(true);
        expect(withModel.members[0].boolProp).toBe(true);
      });
    });
  });
});

describe('.scope()', function() {
  var withScope = new fxjs.Collection;

  withScope.addMembers(
    { rank: 3, keepMe: false, funcProp: function() { return this.keepMe; }                                       },
    { rank: 1, keepMe: false, funcProp: function() { return this.keepMe; }, varyProp: 'b'                        },
    { rank: 2, keepMe: true,  funcProp: function() { return this.keepMe; }, varyProp: function() { return 'a'; } }
  );

  var originalMembers = Array.prototype.slice.call(withScope.members);

  describe('when scope is not defined', function() {
    it('returns nothing', function() {
      expect(withScope.scope()).toBeUndefined();
    });
  });

  describe('its single argument', function() {
    it('should be an object', function() {
      expect(withScope.scope({})).toEqual(withScope.members);
    });
  });

  describe('when scope is defined', function() {
    describe('when scope.filter is defined', function() {
      describe('when scope.filter is a string', function() {
        describe('when scope.filter is "all"', function() {
          it('returns all members', function() {
            expect(withScope.filter('all')).toEqual(withScope.members);
          });
        });

        describe('when the string corresponds to a property in the members', function() {
          describe('when the property is boolean', function() {
            it('filters the members according to the property', function() {
              expect(withScope.filter('keepMe')).toEqual([withScope.members[2]]);
            });

            describe('its negated version', function() {
              it('filters the members according to the property negated', function() {
                expect(withScope.filter('!keepMe').length).toBe(2);
              });
            });
          });

          describe('when the property is other than a boolean', function() {
            it('filters members according to truthiness', function() {
              expect(withScope.filter('rank').length).toBe(3);
              expect(withScope.filter('!rank').length).toBe(0);
            });
          });

          describe('when the property is a function', function() {
            it('filters according to the return value of the function', function() {
              expect(withScope.filter('funcProp').length).toBe(1);
            });

            describe('when the property name is negated', function() {
              it('filters according to the negated return value of the function', function() {
                expect(withScope.filter('!funcProp').length).toBe(2);
              });
            });
          });
        });

        describe('when the string does not correspond to a property in the members', function() {
          it('returns an empty array', function() {
            expect(withScope.filter('notDefined')).toEqual([]);
            expect(withScope.filter('!defined')).toEqual([]);
          });
        });
      });

      describe('when scope.filter is a function', function() {
        it('filters the members by applying the function to each one', function() {
          var scopeFunc = function(member) { return member.rank > 1; };
          expect(withScope.filter(scopeFunc)).toEqual([withScope.members[0], withScope.members[2]]);
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
            var sorted = withScope.sort('rank');
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
                var sortedBool = withScope.sort('!keepMe');
                expect(sortedBool[0]).toBe(withScope.members[2]);
              });
            });
          });

          describe('when the property is a function', function() {
            it('sorts by the return value', function() {
              var sortedFunc = withScope.sort('funcProp');
              expect(sortedFunc[0]).toBe(withScope.members[0]);
              expect(sortedFunc[1]).toBe(withScope.members[1]);
              expect(sortedFunc[2]).toBe(withScope.members[2]);
            });

            describe('when the property name is banged', function() {
              it('sorts by the negated return value', function() {
                var sortedFunc = withScope.sort('!funcProp');
                expect(sortedFunc[0]).toBe(withScope.members[2]);
                expect(sortedFunc[1]).toBe(withScope.members[0]);
                expect(sortedFunc[2]).toBe(withScope.members[1]);
              });
            });
          });

          describe('when the property types are mixed among the various members', function() {
            it('throws an exception', function() {
              var sortedMixed = function() { withScope.sort('varyProp'); }
              expect(sortedMixed).toThrowError(TypeError);
            });
          });
        });

        describe('when the string does not correspond to a property in the members', function() {
          it('does not affect the sorting of members', function() {
            var sorted = withScope.sort('notDefined');
            expect(sorted).toEqual(withScope.members);

            var bangSorted = withScope.sort('!defined');
            expect(bangSorted).toEqual(withScope.members);
          });
        });
      });

      describe('when scope.sort is a function', function() {
        it('sorts by the return value of the function called on each member', function() {
          var sortedFunc = withScope.sort(function(member) {
            if(fxjs.isDefined(member.varyProp)) {
              if(fxjs.isFunction(member.varyProp)) {
                return member.varyProp();
              } else {
                return member.varyProp;
              }
            } else {
              return 'zzz';
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
