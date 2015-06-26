describe('FXCollection', function() {

beforeEach(function() {
  jasmine.addMatchers({

    toHaveMethod: function() {
      return {
        compare: function(actual, expected) {
          return {
            pass: fofx.isFunction(actual[expected])
          };
        }
      };
    },

    toHaveProperty: function() {
      return {
        compare: function(actual, expected) {
          return {
            pass: (expected in actual) && !fofx.isFunction(actual[expected])
          };
        }
      };
    }

  });
});

describe('fofx.collection()', function() {
  describe('when no argument is given', function() {
    var newCollection = fofx.collection();

    it('initializes and returns a new FXCollection', function() {
      expect(newCollection).toEqual(jasmine.any(fofx.Collection));
    });

    describe('the new FXCollection', function() {
      it('does not have a memberModel', function() {
        expect(newCollection.memberModel).toBeUndefined();
      });
    });
  });

  describe('when a model is given', function() {
    it('initializes and returns a new FXCollection', function() {
      var newCollection = fofx.collection({});
      expect(newCollection).toEqual(jasmine.any(fofx.Collection));
    });
  });
});

describe('.defineModel()', function() {
  var newCollection = new fofx.Collection;

  it('gives the collection a memberModel', function() {
    expect(newCollection.memberModel).toBeUndefined();
    newCollection.defineModel();
    expect(newCollection.memberModel).toBeDefined();
  });

  describe('the memberModel', function() {
    it('is an instance of FXModel', function() {
      expect(newCollection.memberModel).toEqual(jasmine.any(fofx.Model));
    });
  });

  describe('when given an object argument', function() {
    var withCustomModel = new fofx.Collection;
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
  var withModel = (new fofx.Collection).defineModel({
    prop: 'someVal',
    boolProp: true
  });

  var withoutModel = new fofx.Collection;

  it('returns the FXCollection', function() {
    expect(withModel.addMembers()).toBe(withModel);
  });

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

    describe('when a candidate does not fit the model', function() {
      it('throws an exception', function() {
        var badAdd = function() { withModel.addMembers({ prop: 1 }); };
        expect(badAdd).toThrowError('Value of prop must be instance of String');
      });
    });
  });
});

describe('.scope()', function() {
  var withScope = new fofx.Collection;

  withScope.addMembers(
    { rank: 3, keepMe: false, funcProp: function() { return this.keepMe; }                                       },
    { rank: 1, keepMe: false, funcProp: function() { return this.keepMe; }, varyProp: 'b'                        },
    { rank: 2, keepMe: true,  funcProp: function() { return this.keepMe; }, varyProp: function() { return 'a'; } }
  );

  var originalMembers = Array.prototype.slice.call(withScope.members);

  it('returns a new FXCollection', function() {
    expect(withScope.scope({})).toEqual(jasmine.any(fofx.Collection));
  });

  describe('the returned FXCollection', function() {
    var scopedCollection = withScope.scope({});

    describe('its memberModel\'s inner model', function() {
      it('is the same as the original one', function() {
        var withModel = fofx.collection({ a: 1 });
        var scopedCollection = withModel.scope({});
        expect(scopedCollection.memberModel.model).toEqual(withModel.memberModel.model);
      });
    });

    describe('its members array', function() {
      it('is not the same as the original members array', function() {
        expect(scopedCollection.members).not.toBe(originalMembers);
      });
    });

    describe('the members', function() {
      it('are the same objects as were in the original array (subject to any filtering/sorting)', function() {
        expect(scopedCollection.members).toEqual(originalMembers);
      });
    });

    describe('adding a member to the new collection', function() {
      it('does not affect the original collection', function() {
        expect(scopedCollection.members).toEqual(originalMembers);
        scopedCollection.addMembers({});
        expect(scopedCollection.members).not.toEqual(originalMembers);
        expect(withScope.members).toEqual(originalMembers);
      });
    });

    describe('removing a member from the new collection', function() {
      it('does not affect the original collection', function() {
        scopedCollection.remove(originalMembers[0]);
        expect(withScope.members).toEqual(originalMembers);
      });
    });
  });

  describe('when scope is not defined', function() {
    it('returns nothing', function() {
      expect(withScope.scope()).toBeUndefined();
    });
  });

  describe('its single argument', function() {
    it('should be an object', function() {
      expect(withScope.scope({}).members).toEqual(withScope.members);
    });
  });

  describe('when scope is defined', function() {
    describe('when scope.filter is defined', function() {
      describe('when scope.filter is a string', function() {
        describe('when scope.filter is "all"', function() {
          it('returns all members', function() {
            expect(withScope.filter('all').members).toEqual(withScope.members);
          });
        });

        describe('when the string corresponds to a property in the members', function() {
          describe('when the property is boolean', function() {
            it('filters the members according to the property', function() {
              expect(withScope.filter('keepMe').members).toEqual([withScope.members[2]]);
            });

            describe('its negated version', function() {
              it('filters the members according to the property negated', function() {
                expect(withScope.filter('!keepMe').count()).toBe(2);
              });
            });
          });

          describe('when the property is other than a boolean', function() {
            it('filters members according to truthiness', function() {
              expect(withScope.filter('rank').count()).toBe(3);
              expect(withScope.filter('!rank').count()).toBe(0);
            });
          });

          describe('when the property is a function', function() {
            it('filters according to the return value of the function', function() {
              expect(withScope.filter('funcProp').count()).toBe(1);
            });

            describe('when the property name is negated', function() {
              it('filters according to the negated return value of the function', function() {
                expect(withScope.filter('!funcProp').count()).toBe(2);
              });
            });
          });
        });

        describe('when the string does not correspond to a property in the members', function() {
          it('returns an empty array', function() {
            expect(withScope.filter('notDefined').members).toEqual([]);
            expect(withScope.filter('!defined').members).toEqual([]);
          });
        });
      });

      describe('when scope.filter is a function', function() {
        it('filters the members by applying the function to each one', function() {
          var scopeFunc = function(member) { return member.rank > 1; };
          expect(withScope.filter(scopeFunc).members).toEqual([withScope.members[0], withScope.members[2]]);
        });
      });
    });

    describe('when scope.filter is not defined', function() {
      it('returns all members', function() {
        expect(withScope.scope({}).members).toEqual(withScope.members);
      });
    });

    describe('when scope.sort is defined', function() {
      describe('when scope.sort is a string', function() {
        describe('when the string corresponds to a property in the members', function() {
          it('sorts members according to the property', function() {
            var sorted = withScope.sort('rank');
            expect(sorted.members[0]).toBe(withScope.members[1]);
            expect(sorted.members[1]).toBe(withScope.members[2]);
            expect(sorted.members[2]).toBe(withScope.members[0]);
          });

          describe('when the property is a boolean value', function() {
            it('sorts from false to true', function() {
              var sortedBool = withScope.scope({ sort: 'keepMe' });
              expect(sortedBool.members[2]).toBe(withScope.members[2]);
            });

            describe('its negated version', function() {
              it('sorts from true to false', function() {
                var sortedBool = withScope.sort('!keepMe');
                expect(sortedBool.members[0]).toBe(withScope.members[2]);
              });
            });
          });

          describe('when the property is a function', function() {
            it('sorts by the return value', function() {
              var sortedFunc = withScope.sort('funcProp');
              expect(sortedFunc.members[0]).toBe(withScope.members[0]);
              expect(sortedFunc.members[1]).toBe(withScope.members[1]);
              expect(sortedFunc.members[2]).toBe(withScope.members[2]);
            });

            describe('when the property name is banged', function() {
              it('sorts by the negated return value', function() {
                var sortedFunc = withScope.sort('!funcProp');
                expect(sortedFunc.members[0]).toBe(withScope.members[2]);
                expect(sortedFunc.members[1]).toBe(withScope.members[0]);
                expect(sortedFunc.members[2]).toBe(withScope.members[1]);
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
            expect(sorted.members).toEqual(withScope.members);

            var bangSorted = withScope.sort('!defined');
            expect(bangSorted.members).toEqual(withScope.members);
          });
        });
      });

      describe('when scope.sort is a function', function() {
        it('sorts by the return value of the function called on each member', function() {
          var sortedFunc = withScope.sort(function(member) {
            if(fofx.isDefined(member.varyProp)) {
              if(fofx.isFunction(member.varyProp)) {
                return member.varyProp();
              } else {
                return member.varyProp;
              }
            } else {
              return 'zzz';
            }
          });

          expect(sortedFunc.members[0]).toBe(withScope.members[2]);
          expect(sortedFunc.members[1]).toBe(withScope.members[1]);
          expect(sortedFunc.members[2]).toBe(withScope.members[0]);
        });
      });
    });
  });

  it('does not alter the members array', function() {
    expect(withScope.members).toEqual(originalMembers);
  });
});

describe('.areAny()', function() {
  var collection = (new fofx.Collection).addMembers(
    { boolProp: true,  funcProp: function() { return 0; } },
    { boolProp: false, funcProp: function() { return 0; } },
    { boolProp: false, funcProp: function() { return 0; } }
  );

  describe('with a string argument', function() {
    describe('when the string argument corresponds to a property that is not a function', function() {
      it('returns true if that property of any member is truthy', function() {
        expect(collection.areAny('boolProp')).toBe(true);
      });
    });

    describe('when the string argument corresponds to a property that is a function', function() {
      it('returns true if the return value of that method of any member is truthy', function() {
        expect(collection.areAny('funcProp')).toBe(false);
      });
    });
  });

  describe('with a function argument', function() {
    it('returns true if the return value of the given function is truthy when called on any member', function() {
      expect(collection.areAny(function(member) { return member.boolProp; })).toBe(true);
    });
  });
});

describe('.areAll()', function() {
  var collection = (new fofx.Collection).addMembers(
    { boolProp: true,  funcProp: function() { return 1; } },
    { boolProp: false, funcProp: function() { return 1; } },
    { boolProp: false, funcProp: function() { return 13; } }
  );

  describe('with a string argument', function() {
    describe('when the string argument corresponds to a property that is not a function', function() {
      it('returns true if that property in all members is truthy', function() {
        expect(collection.areAll('boolProp')).toBe(false);
      });
    });

    describe('when the string argument corresponds to a property that is a function', function() {
      it('returns true if the return value of that method in all members is truthy', function() {
        expect(collection.areAll('funcProp')).toBe(true);
      });
    });
  });

  describe('with a function argument', function() {
    it('returns true if the return value of the given function is truthy when called on all members', function() {
      expect(collection.areAll(function(member) { return member.funcProp(); })).toBe(true);
      expect(collection.areAll(function(member) { return member.funcProp() > 1; })).toBe(false);
    });
  });
});

});
