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

describe('collection without model', function() {
  //var collectionWithoutModel = fxjs.collection('collectionWithoutModel');
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

    // next two also test .scopeByMemberBoolean():

    it('translates given object\'s boolean properties into collection scopes', function() {
      expect(withCustomModel.scopes).toHaveProperty('boolProp');
    });

    it('translates the inverse of the given object\'s boolean properties into collection scopes', function() {
       expect(withCustomModel.scopes).toHaveProperty('!boolProp');
    });
  });
});

});
