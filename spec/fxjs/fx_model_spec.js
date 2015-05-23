describe('FXModel', function() {

var modelWithEnumerables = {
  stringInst:     'string',
  stringClass:    String,
  numberInst:     3,
  numberClass:    Number,
  booleanInst:    false,
  booleanClass:   Boolean,
  objectInst:     { a: 1 },
  objectClass:    Object,
  arrayInst:      [1,3,5],
  arrayClass:     Array,
  functionInst:   function() { },
  functionClass:  Function
};

describe('fxjs.model', function() {
  describe('when given no object or an empty object as an argument', function() {
    var withoutObject = fxjs.model();
    var withEmptyObject = fxjs.model({});

    describe('the returned FXModel object', function() {
      it('is an FXModel object', function() {
        expect(withoutObject.isFXModel).toBe(true);
        expect(withEmptyObject.isFXModel).toBe(true);
      });

      describe('its initialize function', function() {
        it('is a function', function() {
          expect(withoutObject.initialize).toEqual(jasmine.any(Function));
          expect(withEmptyObject.initialize).toEqual(jasmine.any(Function));
        });
      });

      describe('its properties', function() {
        it('are not enumerable', function() {
          expect(Object.getOwnPropertyNames(withoutObject).length).toBeGreaterThan(0);
          expect(Object.keys(withoutObject)).toEqual([]);
          expect(Object.getOwnPropertyNames(withEmptyObject).length).toBeGreaterThan(0);
          expect(Object.keys(withEmptyObject)).toEqual([]);
        });
      });
    });
  });

  describe('when an object with properties is given', function() {
    var withObject = fxjs.model(modelWithEnumerables);

    describe('the returned FXModel object', function() {
      it('is not the given object', function() {
        expect(withObject).not.toBe(modelWithEnumerables);
      });

      describe('its enumerable properties', function() {
        it('correspond to those of the given object', function() {
          expect(Object.keys(withObject)).toEqual(Object.keys(modelWithEnumerables));
        });

        describe('their values', function() {
          it('correspond to those of the given object', function() {
            expect(fxjs.Object.values(withObject)).toEqual(fxjs.Object.values(modelWithEnumerables));
          });
        });
      });
    });
  });
});

describe('.initialize()', function() {
  describe('when no enumerable properties were given', function() {
    var withoutEnumerables = fxjs.model();
    var newObject = withoutEnumerables.initialize();
    
    describe('when called, the returned object', function() {
      it('is not an FXModel object', function() {
        expect(newObject.isFXModel).toBeUndefined();
      });

      it('stores a reference to its FXModel', function() {
        expect(newObject.fxModel).toEqual(withoutEnumerables);
      });

      it('has no enumerable properties', function() {
        expect(Object.keys(newObject)).toEqual([]);
      });
    });
  });

  describe('when enumerable properties were given', function() {
    var withEnumerables = fxjs.model(modelWithEnumerables);
    var newObject = withEnumerables.initialize();

    describe('when called, the returned object', function() {
      describe('its enumerable properties', function() {
        it('correspond to the given enumerable properties', function() {
          expect(Object.keys(newObject)).toEqual(Object.keys(modelWithEnumerables));
        });

        describe('their values', function() {
          describe('when the original value was a string, number, boolean, object, array or function', function() {
            it('are the same', function() {
              expect(newObject.stringInst).toBe(modelWithEnumerables.stringInst);
              expect(newObject.numberInst).toBe(modelWithEnumerables.numberInst);
              expect(newObject.booleanInst).toBe(modelWithEnumerables.booleanInst);
              expect(newObject.objectInst).toEqual(modelWithEnumerables.objectInst);
              expect(newObject.arrayInst).toEqual(modelWithEnumerables.arrayInst);
              expect(newObject.functionInst).toBe(modelWithEnumerables.functionInst);
            });

            describe('when the original value was an object or array', function() {
              it('is a copy', function() {
                expect(newObject.objectInst).not.toBe(modelWithEnumerables.objectInst);
                expect(newObject.arrayInst).not.toBe(modelWithEnumerables.arrayInst);
              });
            });
          });

          describe('when the original value was String, Number, Boolean, Object, Array, or Function', function() {
            it('are undefined', function() {
              expect(newObject.hasOwnProperty('stringClass')).toBe(true);
              expect(newObject.stringClass).toBeUndefined();
              expect(newObject.hasOwnProperty('numberClass')).toBe(true);
              expect(newObject.numberClass).toBeUndefined();
              expect(newObject.hasOwnProperty('booleanClass')).toBe(true);
              expect(newObject.booleanClass).toBeUndefined();
              expect(newObject.hasOwnProperty('objectClass')).toBe(true);
              expect(newObject.objectClass).toBeUndefined();
              expect(newObject.hasOwnProperty('arrayClass')).toBe(true);
              expect(newObject.arrayClass).toBeUndefined();
              expect(newObject.hasOwnProperty('functionClass')).toBe(true);
              expect(newObject.functionClass).toBeUndefined();
            });
          });
        });
      });
    });
  });
});

describe('setting a model instance\'s properties', function() {
  var newObject = fxjs.model(modelWithEnumerables).initialize();

  describe('when you try to set it to a value of a different type than was originally given', function() {
    it('will throw an exception', function() {
      var setStringInst = function() { newObject.stringInst = 2; }
      var setStringClass = function() { newObject.stringClass = []; }
      var setNumberInst = function() { newObject.numberInst = ''; }
      var setNumberClass = function() { newObject.numberClass = {}; }
      var setBooleanInst = function() { newObject.booleanInst = function() { }; }
      var setBooleanClass = function() { newObject.booleanClass = 0; }
      var setObjectInst = function() { newObject.objectInst = []; }
      var setObjectClass = function() { newObject.objectClass = ''; }
      var setArrayInst = function() { newObject.arrayInst = {}; }
      var setArrayClass = function() { newObject.arrayClass = function() { }; }
      var setFunctionInst = function() { newObject.functionInst = 199; }
      var setFunctionClass = function() { newObject.functionClass = []; }
      
      expect(setStringInst).toThrowError('Value of stringInst must be instance of String');
      expect(setStringClass).toThrowError('Value of stringClass must be instance of String');
      expect(setNumberInst).toThrowError('Value of numberInst must be instance of Number');
      expect(setNumberClass).toThrowError('Value of numberClass must be instance of Number');
      expect(setBooleanInst).toThrowError('Value of booleanInst must be instance of Boolean');
      expect(setBooleanClass).toThrowError('Value of booleanClass must be instance of Boolean');
      expect(setObjectInst).toThrowError('Value of objectInst must be instance of Object');
      expect(setObjectClass).toThrowError('Value of objectClass must be instance of Object');
      expect(setArrayInst).toThrowError('Value of arrayInst must be instance of Array');
      expect(setArrayClass).toThrowError('Value of arrayClass must be instance of Array');
      expect(setFunctionInst).toThrowError('Value of functionInst must be instance of Function');
      expect(setFunctionClass).toThrowError('Value of functionClass must be instance of Function');
    });
  });

  describe('when you set it to a value of the same type as was originally given', function() {
    it('will set the value', function() {
      newObject.stringInst = 'new stringInst';
      newObject.stringClass = 'new stringClass';
      newObject.numberInst = 15;
      newObject.numberClass = 27;
      newObject.booleanInst = true;
      newObject.booleanClass = false;
      newObject.objectInst = {};
      newObject.objectClass = {};
      newObject.arrayInst = [];
      newObject.arrayClass = [];
      newObject.functionInst = String;
      newObject.functionClass = function() { };

      expect(newObject.stringInst).toBe('new stringInst');
      expect(newObject.stringClass).toBe('new stringClass');
      expect(newObject.numberInst).toBe(15);
      expect(newObject.numberClass).toBe(27);
      expect(newObject.booleanInst).toBe(true);
      expect(newObject.booleanClass).toBe(false);
      expect(newObject.objectInst).toEqual({});
      expect(newObject.objectClass).toEqual({});
      expect(newObject.arrayInst).toEqual([]);
      expect(newObject.arrayClass).toEqual([]);
      expect(newObject.functionInst).toBe(String);
      expect(newObject.functionClass).toEqual(jasmine.any(Function));
    });
  });
});

describe('.defineInitializer()', function() {
  it('returns the FXModel', function() {
    var newModel = fxjs.model();
    expect(newModel.defineInitializer()).toBe(newModel);
  });

  it('adds a function to be run within .initialize()', function() {
    var newModel = fxjs.model().defineInitializer(function() {
      this.newState = 'initialized';
    });

    var newInstance = newModel.initialize();

    expect(newInstance.newState).toBe('initialized');
  });

  describe('the inner initializer', function() {
    it('uses any arguments passed to .initialize()', function() {
      var newModel = fxjs.model().defineInitializer(function(arg1, arg2) {
        this.arg1 = arg1;
        this.arg2 = arg2;
      });

      var newInstance = newModel.initialize('hello', 'world');

      expect(newInstance.arg1).toBe('hello');
      expect(newInstance.arg2).toBe('world');
    });

    it('is run *after* the enumerable properties\' rules are set on the modeled object', function() {
      var newModel = fxjs.model({ stringProp: 'string' }).defineInitializer(function(arg) {
        this.stringProp = arg;
      });

      expect(function() { newModel.initialize(1); }).toThrowError('Value of stringProp must be instance of String');
    });
  });
});

});
