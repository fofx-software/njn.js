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
  functionClass:  Function,
  dateInst:       new Date(2015,5,24),
  dateClass:      Date
};

// ^ test with fxjs utility classes

describe('fxjs.model', function() {
  describe('when given no object or an empty object as an argument', function() {
    var withoutObject = fxjs.model();
    var withEmptyObject = fxjs.model({});

    describe('the returned FXModel object', function() {
      it('is an FXModel object', function() {
        expect(withoutObject).toEqual(jasmine.any(fxjs.Model));
        expect(withEmptyObject).toEqual(jasmine.any(fxjs.Model));
      });

      describe('its initialize function', function() {
        it('is a function', function() {
          expect(withoutObject.initialize).toEqual(jasmine.any(Function));
          expect(withEmptyObject.initialize).toEqual(jasmine.any(Function));
        });
      });

      describe('its stored model', function() {
        it('has no enumerable own properties', function() {
          expect(Object.keys(withoutObject.model)).toEqual([]);
          expect(Object.keys(withEmptyObject.model)).toEqual([]);
        });

        it('does not respond to the FXModel\'s methods', function() {
          expect('create' in withoutObject).toBe(true);
          expect('create' in withoutObject.model).toBe(false);
          expect('create' in withEmptyObject).toBe(true);
          expect('create' in withEmptyObject.model).toBe(false);
          expect('initialize' in withoutObject).toBe(true);
          expect('initialize' in withoutObject.model).toBe(false);
          expect('initialize' in withEmptyObject).toBe(true);
          expect('initialize' in withEmptyObject.model).toBe(false);
        });
      });
    });
  });

  describe('when an object with properties is given', function() {
    var withObject = fxjs.model(modelWithEnumerables);

    describe('the returned FXModel object', function() {
      describe('its stored model', function() {
        it('is not the given object', function() {
          expect(withObject.model).not.toBe(modelWithEnumerables);
        });

        describe('its enumerable properties', function() {
          it('correspond to those of the given object', function() {
            expect(Object.keys(withObject.model)).toEqual(Object.keys(modelWithEnumerables));
          });

          describe('their values', function() {
            it('correspond to those of the given object', function() {
              expect(fxjs.Object.values(withObject.model)).toEqual(fxjs.Object.values(modelWithEnumerables));
            });
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

      describe('its prototype', function() {
        it('is the FXModel\'s stored model', function() {
          expect(Object.getPrototypeOf(newObject)).toBe(withoutEnumerables.model);
        });
      });

      it('has no enumerable properties', function() {
        expect(Object.keys(newObject)).toEqual([]);
      });

      it('is frozen', function() {
        'use strict';
        expect(function() { newObject.newProp = 1; }).toThrow();
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
          describe('when the original value was an instance', function() {
            it('are the same', function() {
              expect(newObject.stringInst).toBe(modelWithEnumerables.stringInst);
              expect(newObject.numberInst).toBe(modelWithEnumerables.numberInst);
              expect(newObject.booleanInst).toBe(modelWithEnumerables.booleanInst);
              expect(newObject.objectInst).toEqual(modelWithEnumerables.objectInst);
              expect(newObject.arrayInst).toEqual(modelWithEnumerables.arrayInst);
              expect(newObject.functionInst).toBe(modelWithEnumerables.functionInst);
              expect(newObject.dateInst.getFullYear()).toBe(modelWithEnumerables.dateInst.getFullYear());
            });

            describe('when the original value was an object, array', function() {
              it('is a copy', function() {
                expect(newObject.objectInst).not.toBe(modelWithEnumerables.objectInst);
                expect(newObject.arrayInst).not.toBe(modelWithEnumerables.arrayInst);
              });
            });
          });

          describe('when the original value was a class', function() {
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
              expect(newObject.hasOwnProperty('dateClass')).toBe(true);
              expect(newObject.dateClass).toBeUndefined();
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
      var setDateInst = function() { newObject.dateInst = ''; }
      var setDateClass = function() { newObject.dateClass = {}; }
      
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
      expect(setDateInst).toThrowError('Value of dateInst must be instance of Date');
      expect(setDateClass).toThrowError('Value of dateClass must be instance of Date');
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
      newObject.dateInst = new Date(2015,5,24);
      newObject.dateClass = new Date;

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
      expect(newObject.dateInst.getMonth()).toBe(5);
      expect(newObject.dateClass.getFullYear()).toBe((new Date).getFullYear());
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

describe('.create()', function() {
  var argObject = { name: '', age: Number };
  var fxModel = fxjs.model(argObject);

  describe('when given no argument', function() {
    it('is equivalent to .initialize()', function() {
      expect(fxModel.create()).toEqual(fxModel.initialize());
    });
  });

  describe('when given an object argument', function() {
    var newObject = fxModel.create({ name: 'Joe', age: 32 });

    it('returns the result of merging the argument\'s property values to the inner model\'s', function() {
      expect(newObject.name).toBe('Joe');
      expect(newObject.age).toBe(32);
    });

    it('is not the same as simply calling .initialize()', function() {
      expect(newObject).not.toEqual(fxModel.initialize());
    });

    describe('when the object has a property that is not defined in the inner model', function() {
      var newObject = fxModel.create({ name: 'Joe', favColor: 'black' });

      describe('the returned object', function() {
        describe('the property defined in the argument object', function() {
          it('has the value given in the argument object', function() {
            expect(newObject.name).toBe('Joe');
          });
        });

        describe('the property not defined in the argument object', function() {
          it('has the default value', function() {
            expect(newObject.age).toBeUndefined();
          });
        });

        describe('any property defined in the the argument object that does not exist in inner model', function() {
          it('is ignored', function() {
            expect('favColor' in newObject).toBe(false);
          });
        });
      });
    });
  });
});

describe('.aliasProperty()', function() {
  var argObject = { boolProp: Boolean, arrayProp: Array };
  var fxModel = fxjs.model(argObject);
  fxModel.aliasProperty('boolProp', 'boolAlias');
  fxModel.aliasProperty('!boolProp', 'boolNegate');
  fxModel.aliasProperty('arrayProp', 'arrayAlias');
  var castObject = fxModel.create({ boolProp: false });

  it('creates a property which gets the value of another property', function() {
    expect(castObject.boolAlias).toBe(false);
    castObject.boolProp = true;
    expect(castObject.boolAlias).toBe(true);
  });

  it('creates a property which sets the value of another property', function() {
    expect(castObject.boolProp).toBe(true);
    castObject.boolAlias = false;
    expect(castObject.boolProp).toBe(false);
    castObject.boolAlias = true;
    expect(castObject.boolProp).toBe(true);
  });

  describe('negated property aliases', function() {
    it('creates a property which gets the negated value of another property', function() {
      expect(castObject.boolNegate).toBe(false);
      castObject.boolProp = false;
      expect(castObject.boolNegate).toBe(true);
    });

    it('creates a setter which sets the other property to the inverse of its argument', function() {
      castObject.boolNegate = false;
      expect(castObject.boolProp).toBe(true);
      castObject.boolNegate = true;
      expect(castObject.boolProp).toBe(false);
    });
  });

  describe('the property alias', function() {
    it('is a non-enumerable property of the inner model', function() {
      expect(fxModel.model.hasOwnProperty('boolAlias')).toBe(true);
      expect(fxModel.model.propertyIsEnumerable('boolAlias')).toBe(false);
    });
  });

  describe('the new setters', function() {
    it('follow the usual rules of updating values', function() {
      expect(function() { castObject.boolAlias = 1; }).toThrow();
      expect(function() { castObject.arrayAlias = true; }).toThrow();
    });
  });

  describe('when called after cast objects have been created', function() {
    describe('the cast objects', function() {
      it('still inherit the new alias', function() {
        fxModel.aliasProperty('!arrayProp', 'arrayNegate');
        expect('arrayNegate' in castObject).toBe(true);
      });

      it('do not have the alias as an own property', function() {
        expect(castObject.hasOwnProperty('arrayNegate')).toBe(false);
      });
    });
  });

  describe('non-boolean aliased properties', function() {
    describe('non-negated aliases', function() {
      describe('the getter', function() {
        it('works the same', function() {
          castObject.arrayProp = [];
          expect(castObject.arrayAlias).toBe(castObject.arrayProp);
        });
      });

      describe('the setter', function() {
        it('works the same', function() {
          castObject.arrayAlias = [1];
          expect(castObject.arrayProp).toBe(castObject.arrayAlias);
        });
      });
    });

    describe('negated aliases', function() {
      describe('the getter', function() {
        it('returns a boolean', function() {
          expect(castObject.arrayNegate).toBe(false);
        });
      });

      describe('the setter', function() {
        it('will throw an exception', function() {
          expect(function() { castObject.arrayNegate = []; }).toThrow();
        });
      });
    });
  });

  describe('.isAlias()', function() {
    it('returns true if the referenced property is an alias', function() {
      expect(fxModel.isAlias('boolAlias')).toBe(true);
      expect(fxModel.isAlias('boolNegate')).toBe(true);
      expect(fxModel.isAlias('arrayAlias')).toBe(true);
      expect(fxModel.isAlias('arrayNegate')).toBe(true);
    });

    it('returns false if the referenced property is not an alias', function() {
      expect(fxModel.isAlias('boolProp')).toBe(false);
      expect(fxModel.isAlias('arrayProp')).toBe(false);
    });
  });
});

});
