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
      it('initializes and returns a new FXCollection', function() {
        expect(fxjs.collections['newCollection']).toBeUndefined();
        var newCollection = fxjs.collection('newCollection');
        expect(fxjs.collections['newCollection']).toBe(newCollection);
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
      it('initializes and returns a new FXCollection', function() {
        expect(fxjs.collections['collectionWithModel']).toBeUndefined();
        newCollection = fxjs.collection('collectionWithModel', {});
        expect(fxjs.collections['collectionWithModel']).toBe(newCollection);
      });
    });

    describe('if a collection has been registered with that name', function() {
      it('throws an error', function() {
        var collectionWithModel = function() { fxjs.collection('collectionWithModel', {}); }
        expect(collectionWithModel).toThrow();
      });
    });
  });

  afterAll(fxjs.collections.reset);
});

describe('.defineModel()', function() {
  var newCollection;

  beforeAll(function() {
    newCollection = new fxjs.Collection;
  });

  it('gives the collection a memberModel', function() {
    expect(newCollection.memberModel).toBeUndefined();
    newCollection.defineModel();
    expect(newCollection.memberModel).toEqual(jasmine.any(Object));
  });

  describe('the memberModel', function() {
    it('is an instance of FXModel', function() {
      expect(newCollection.memberModel.isFXModel).toBe(true);
    });
  });

  describe('when given an object argument', function() {
    var withCustomModel;

    beforeAll(function() {
      withCustomModel = new fxjs.Collection;
      withCustomModel.defineModel({ prop1: 'someVal', boolProp: true });
    });

    it('merges the given object with memberModel', function() {
      expect(withCustomModel.memberModel).toHaveProperty('prop1');
    });

    it('translates given object\'s boolean properties into a collection scope', function() {
      expect(withCustomModel.scopes).toHaveProperty('boolProp');
    });

    describe('the generated collection scope', function() {
      it('has a filter property which is just the name of the property', function() {
        expect(withCustomModel.scopes.boolProp.filter).toBe('boolProp');
      });
    });
  });
});

describe('.addMembers()', function() {
  var withModel, withoutModel;

  beforeAll(function() {
    withModel = (new fxjs.Collection).defineModel({ prop: 'someVal', boolProp: true });
    withoutModel = new fxjs.Collection;
  });

  describe('when called on a collection without a memberModel', function() {
    it('simply adds the given candidates to collection\'s members array', function() {
      withoutModel.addMembers(1, 'a', false);
      expect(withoutModel.members).toEqual([1,'a',false]);
    });
  });

  describe('when called on a collection with a memberModel', function() {
    beforeAll(function() {
      withModel.addMembers({ prop: 'myVal', prop1: 'otherVal' });
    });

    it('does not add properties of the candidates that are not in the memberModel', function() {
      expect('prop1' in withModel.members[0]).toBe(false);
    });

    describe('for properties defined in a candidate', function() {
      it('applies the values of provided in the candidate to the new member', function() {
        expect(withModel.members[0].prop).toBe('myVal');
      });
    });

    describe('for properties not defined in a candidate', function() {
      it('does not define the property on the new member, as it inherits from memberModel', function() {
        expect(withModel.members[0].hasOwnProperty('boolProp')).toBe(false);
        expect('boolProp' in withModel.members[0]).toBe(true);
      });
    });
  });
});

});
