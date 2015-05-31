describe('FXController', function() {

var linkedController, linkedDiv;

beforeAll(function() {
  linkedDiv = document.createElement('div');
  linkedDiv.setAttribute('fx-controller', 'linkedController');
  var innerDiv = document.createElement('div');
  innerDiv.className = 'inner-div';
  linkedDiv.appendChild(innerDiv);
  var innerP = document.createElement('p');
  innerP.textContent = 'inner p';
  innerDiv.appendChild(innerP);
  document.body.appendChild(linkedDiv);
});

describe('fxjs.controller()', function() {
  describe('when only a name is given', function() {
    describe('if a controller has not already been registered with that name', function() {
      var newController;

      it('initializes, registers and returns a new FXController', function() {
        expect(fxjs.registeredControllers.newController).toBeUndefined();
        newController = fxjs.controller('newController');
        expect(fxjs.registeredControllers.newController).toBe(newController);
        expect(newController).toEqual(jasmine.any(fxjs.Controller));
      });

      describe('the new controller', function() {
        describe('its template', function() {
          describe('when a linked element is not found', function() {
            it('is null', function() {
              expect(newController.template).toBeNull();
            });
          });

          describe('when a linked element is found', function() {
            it('is the linked element', function() {
              linkedController = fxjs.controller('linkedController');
              expect(linkedController.template).toBe(linkedDiv);
            });

            it('contains the child elements of the linked element', function() {
              var innerDiv = linkedController.template.querySelector('div.inner-div');
              expect(innerDiv).not.toBeNull();
              var innerP = linkedController.template.querySelector('p');
              expect(innerP.textContent).toBe('inner p');
            });
          });
        });
      });

      describe('when no name is given', function() {
        var unregistered;

        it('initializes and returns a new FXController, but does not register it', function() {
          expect(Object.keys(fxjs.registeredControllers).length).toBe(2);
          unregistered = fxjs.controller();
          expect(unregistered).toEqual(jasmine.any(fxjs.Controller));
          expect(Object.keys(fxjs.registeredControllers).length).toBe(2);
        });

        describe('the returned FXController', function() {
          describe('its name property', function() {
            it('is an own property', function() {
              expect(unregistered.hasOwnProperty('name')).toBe(true);
            });

            it('is undefined', function() {
              expect(unregistered.name).toBeUndefined();
            });
          });

          describe('its template property', function() {
            it('is an own property', function() {
              expect(unregistered.hasOwnProperty('template')).toBe(true);
            });

            it('is undefined', function() {
              expect(unregistered.template).toBeUndefined();
            });
          });

          it('has a viewInterface object', function() {
            expect(unregistered.viewInterface).toEqual({});
          });

          describe('when a viewInterface object was given', function() {
            var viewInterface = { prop: 'value' };
            var withViewInterface = fxjs.controller(viewInterface);

            describe('the returned FXController\'s viewInterface', function() {
              it('is the given object', function() {
                expect(withViewInterface.viewInterface).toBe(viewInterface);
              });
            });
          });
        });
      });
    });
  });
});

describe('init()', function() {
  var liveElement;

  beforeAll(function() {
    linkedController.init();
    liveElement = document.querySelectorAll('[fx-controller=linkedController]');
  });

  describe('the controller\'s template', function() {
    it('is replaced in the document by a clone', function() {
      // only the clone is in the document:
      expect(liveElement.length).toBe(1);
      // the clone is not the template:
      expect(liveElement[0]).not.toBe(linkedController.template);
      // just to confirm again that the template is not in the document:
      expect(linkedController.template.parentElement).toBeNull();
    });

    describe('its live clone', function() {
      it('contains clones of the template\'s child elements', function() {
        var innerDiv = liveElement[0].querySelector('div.inner-div');
          expect(innerDiv).not.toBeNull();
        var templateInnerDiv = linkedController.template.querySelector('div.inner-div');
          expect(innerDiv).not.toBe(templateInnerDiv);
        var innerP = innerDiv.querySelector('p');
          expect(innerP.textContent).toBe('inner p');
        var templateInnerP = templateInnerDiv.querySelector('p');
          expect(innerP).not.toBe(templateInnerP);
      });
    });
  });
});

describe('.refreshView()', function() {
  var oldLiveElement;

  beforeAll(function() {
    oldLiveElement = document.querySelector('[fx-controller=linkedController]');
    linkedController.refreshView();
  });

  describe('the live element', function() {
    it('is replaced with a new clone of the template', function() {
      var liveElement = document.querySelector('[fx-controller=linkedController]');
      expect(liveElement).not.toBeNull();
      expect(liveElement).not.toBe(oldLiveElement);
    });
  });
});

//describe('.processElement()', function() {
//  describe('without a lookupChain or listIndex', function() {
//    var templateElement = document.createElement('div');
//    templateElement.setAttribute('fx-controller', 'processorController');
//    templateElement.setAttribute('fx-attr-name', 'call-me-{{name}}');
//
//    var processText = document.createElement('span');
//    processText.textContent = 'process {{text}}';
//    templateElement.appendChild(processText);
//
//    var divWithChild = document.createElement('div');
//    var processGrandchild = document.createElement('span');
//    processGrandchild.textContent = 'process {{text}}, too!';
//    divWithChild.appendChild(processGrandchild);
//    templateElement.appendChild(divWithChild);
//
//    var withFXAttribute = document.createElement('p');
//    withFXAttribute.setAttribute('fx-attr-name', 'son-of-{{name}}');
//    templateElement.appendChild(withFXAttribute);
//
//    fxjs.controller('processorController', {
//      text: 'this',
//      name: function() { return 'ismael'; }
//    }).processElement(templateElement);
//
//    describe('when the template element itself has an attribute to process', function() {
//      it('processes any interpolator in the attribute', function() {
//        expect(templateElement.getAttribute('name')).toBe('call-me-ismael');
//      });
//    });
//
//    describe('when a child\'s textContent has interpolable text', function() {
//      describe('when the text corresponds to a non-function property in the controller viewInterface', function() {
//        it('replaces the interpolable text with the property value', function() {
//          expect(processText.textContent).toBe('process this');
//        });
//      });
//    });
//
//    describe('when an a child of a child\'s textContent has interpolable text', function() {
//      describe('when the text corresponds to a non-function property in the controller viewInterface', function() {
//        it('replaces the interpolable text with the property value', function() {
//          expect(processGrandchild.textContent).toBe('process this, too!');
//        });
//      });
//    });
//  });
//});

describe('.processText()', function() {
  var controller = fxjs.controller({
    stringProp: 'this',
    funcProp: function() { return this.stringProp; },
    withArgs: function(obj1, obj2, ind1, ind2) { return obj1 + ' ' + obj2 + ' ' + ind1 + ' ' + ind2; },
    numProp: 3
  });

  describe('when the text does not have an interpolator', function() {
    it('returns the same text', function() {
      expect(controller.processText('won\'t change')).toBe('won\'t change');
    });
  });

  describe('when the text has an interpolator, but it does not correspond to a property in the lookupChain', function() {
    it('replaces the interpolator with undefined', function() {
      expect(controller.processText('won\'t {{change}}')).toBe('won\'t undefined');
    });
  });

  describe('when the text has interpolators that correspond to properties is in the lookupChain', function() {
    describe('when no lookupChain is provided', function() {
      it('uses properties defined in the controller\'s viewInterface', function() {
        expect(controller.processText('process {{stringProp}}')).toBe('process this');
      });

      describe('when the property is a function in the viewInterface', function() {
        it('uses the return value of the function called on the viewInterface', function() {
          expect(controller.processText('process {{funcProp}}')).toBe('process this');
        });
      });

      describe('when the value of the property is not a string', function() {
        describe('when it\'s a function', function() {
          it('coerces the value into the string', function() {
            expect(controller.processText('process {{numProp}}')).toBe('process 3');
          });
        });
      });
    });

    describe('when a lookupChain is provided', function() {
      describe('when an interpolator in the text corresponds to a property in more than one object in lookupChain', function() {
        var useFirst = {
          stringProp: 'me first',
          noReturn: function(nonArg) { return nonArg; }
        };
        var useSecond = {
          stringProp: 'me second',
          funcProp: function(nonArg) { return nonArg || this.stringProp; }
        };

        it('uses the first object in lookupChain with the property', function() {
          var processed = controller.processText('process {{stringProp}}', [useFirst, useSecond]);
          expect(processed).toBe('process me first');
        });

        describe('when the first object with the property is in the middle of lookupChain', function() {
          it('uses the value of the property in that object', function() {
            var processed = controller.processText('process {{funcProp}}', [useFirst, useSecond]);
            expect(processed).toBe('process me second');
          });
        });

        describe('when the property is a function in a member of lookupChain', function() {
          it('is called with the object as \'this\', but with no other arguments', function() {
            var processed = controller.processText('{{noReturn}}', [useFirst, useSecond]);
            expect(processed).toBe('undefined');
          });
        });

        describe('when the property is not found in any object in lookupChain', function() {
          it('is sought in viewInterface', function() {
            var processed = controller.processText('{{numProp}}', [useFirst, useSecond]);
            expect(processed).toBe('3');
          });
        });

        describe('when there is more than one interpolator in the text', function() {
          it('repeats the process for each interpolator', function() {
            var processed = controller.processText('{{stringProp}} {{funcProp}} {{numProp}}', [useFirst, useSecond]);
            expect(processed).toBe('me first me second 3');
          });
        });
      });

      describe('when the interpolator corresponds to a function in the viewInterface, the function', function() {
        it('is called with viewInterface as \'this\', and with the lookupChain and indices as arguments', function() {
          var processed = controller.processText('{{withArgs}}', ['a', 'b'], [3, 7]);
          expect(processed).toBe('a b 3 7');
        });
      });
    });
  });
});

describe('.findInLookupChain()', function() {
  describe('when no lookupChain is given', function() {
    describe('if the property is found in the viewInterface', function() {
      it('returns the viewInterface', function() {
        var controller = fxjs.controller({ prop: false });
        expect(controller.findInLookupChain('prop')).toBe(controller.viewInterface);
      });
    });

    describe('if the property is not found in the viewInterface', function() {
      it('returns undefined', function() {
        var controller = fxjs.controller();
        expect(controller.findInLookupChain('prop')).toBeUndefined();
      });
    });
  });

  describe('when a lookupChain is given', function() {
    describe('if the property is found in the lookupChain', function() {
      it('returns the object in which the property is found', function() {
        var controller = fxjs.controller();
        var obj1 = {};
        var obj2 = { prop: true };
        expect(controller.findInLookupChain('prop', [obj1, obj2])).toBe(obj2);
      });
    });

    describe('if the property is not found in the lookupChain but is found in the viewInterface', function() {
      it('returns the viewInterface', function() {
        var controller = fxjs.controller({ prop: true });
        var obj1 = {};
        var obj2 = {};
        expect(controller.findInLookupChain('prop', [obj1, obj2])).toBe(controller.viewInterface);
      });
    });
  });
});

describe('.getFromLookupChain()', function() {
  var controller = fxjs.controller({
    stringProp: 'value',
    numProp: 17,
    uniqueProp: [],
    funcProp: function(arg1, arg2, ind1, ind2) {
      return [this.stringProp, arg1, arg2, ind1, ind2].join(' ');
    }
  });

  var useFirst = {
    stringProp: 'first value'
  };

  var useSecond = {
    stringProp: 'second value',
    numProp: 27,
    myFunc: function(arg1, arg2, ind1, ind2) {
      return [this.stringProp, arg1, arg2, ind1, ind2].join(' ');
    }
  };

  describe('when not given a lookup chain', function() {
    describe('when the given property is found in the viewInterface', function() {
      describe('when the property is not a function', function() {
        it('returns the value of the property in the viewInterface', function() {
          expect(controller.getFromLookupChain('stringProp')).toBe('value');
        });
      });

      describe('when the property is a function', function() {
        it('returns the return value of the function called on the viewObject with no other arguments', function() {
          var returnVal = controller.getFromLookupChain('funcProp');
          expect(returnVal).toBe('value    ');
        });
      });
    });

    describe('when the property is not found in the viewInterface', function() {
      it('returns undefined', function() {
        expect(controller.getFromLookupChain('noProp')).toBeUndefined();
      });
    });
  });

  describe('when given a lookup chain without indices', function() {
    describe('when the given property is found in the first member of the lookup chain', function() {
      it('uses the first object over others', function() {
        expect(controller.getFromLookupChain('stringProp', [useFirst, useSecond])).toBe('first value');
      });
    });

    describe('when the given property is found in an object in the middle of the lookup chain', function() {
      it('uses the first object found with the property', function() {
        expect(controller.getFromLookupChain('numProp', [useFirst, useSecond])).toBe(27);
      });
    });

    describe('when the property is found in the lookup chain, and is a function', function() {
      it('calls the function on the object without any arguments', function() {
        var returnVal = controller.getFromLookupChain('myFunc', [useFirst, useSecond]);
        expect(returnVal).toBe('second value    ');
      });
    });

    describe('when the given property is not found in an object in the lookup chain, but is in the viewInterface', function() {
      it('uses the property in the viewInterface', function() {
        expect(controller.getFromLookupChain('uniqueProp', [useFirst, useSecond])).toEqual([]);
      });
    });

    describe('when the given property is found in the viewInterface, and it is a function', function() {
      it('calls the function on the viewInterface with the lookup chain as arguments', function() {
        var withArgs = controller.getFromLookupChain('funcProp', ['a', 'b']);
        expect(withArgs).toBe('value a b  ');
      });
    });

    describe('when the given property isn\'t found in the lookup chain or viewInterface', function() {
      it('returns undefind', function() {
        expect(controller.getFromLookupChain('noProp', [useFirst, useSecond])).toBeUndefined();
      });
    });
  });

  describe('when given a lookup chain with indices', function() {
    describe('when the given property is a function in the lookup chain', function() {
      it('calls the function on the object without any arguments', function() {
        expect(controller.getFromLookupChain('myFunc', [useFirst, useSecond], [3, 7])).toBe('second value    ');
      });
    });

    describe('when the given property is a function in the viewInterface', function() {
      it('calls the function on the viewInterface with the lookup chain and indices as arguments', function() {
        expect(controller.getFromLookupChain('funcProp', ['a', 'b'], [3, 5])).toBe('value a b 3 5');
      });
    });
  });
});

describe('.configureAttribute()', function() {
  var div = document.createElement('div');
  div.setAttribute('fx-attr-name', 'call-me-{{myName}}');
  div.setAttribute('fx-attr-class', '{{getName}}-div');

  var controller = fxjs.controller({
    myName: 'ishmael',
    getName: function() { return this.myName; },
    myAge: 45,
    birthyear: function() { return (new Date).getFullYear() - this.myAge; },
    secondName: function(useFirst, useSecond) { return useSecond.myName; }
  }).configureAttribute(div, 'fx-attr-name')
    .configureAttribute(div, 'fx-attr-class');

  describe('when an element has an fx-attr with an interpolator', function() {
    describe('when the interpolator corresponds to a property in the viewInterface, the interpolator', function() {
      it('is replaced with the value of that property', function() {
        expect(div.getAttribute('name')).toBe('call-me-ishmael');
      });
    });

    describe('when the interpolator corresponds to a method in the viewInterface, the interpolator', function() {
      it('is replaced with the return value of the function called on viewInterface', function() {
        expect(div.className).toBe('ishmael-div');
      });
    });
  });

  describe('the fx-attrs after processing', function() {
    it('should be removed', function() {
      expect(div.getAttribute('fx-attr-name')).toBeNull();
      expect(div.getAttribute('fx-attr-class')).toBeNull();
    });
  });

  describe('when given a lookupChain', function() {
    var div = document.createElement('div');
    div.setAttribute('fx-attr-name', 'my-name-is-{{myName}}');
    div.setAttribute('fx-attr-class', 'my-parent\'s-name-is-{{getName}}');
    div.setAttribute('fx-attr-id', 'my-brother-was-born-in-{{birthyear}}');
    div.setAttribute('fx-attr-fake', 'my-brother\'s-name-is-{{secondName}}');

    var useFirst = { myName: 'bob' };
    var useSecond = {
      myName: 'bill',
      myAge: 27,
      birthyear: function() { return (new Date).getFullYear() - this.myAge; }
    };

    controller.configureAttribute(div, 'fx-attr-name', [useFirst, useSecond]);
    controller.configureAttribute(div, 'fx-attr-class', [useFirst, useSecond]);
    controller.configureAttribute(div, 'fx-attr-id', [useFirst, useSecond]);
    controller.configureAttribute(div, 'fx-attr-fake', [useFirst, useSecond]);

    describe('when a property is defined in an object included in the lookupChain, the property that is used', function() {
      it('is the one defined in the object in the lookupChain', function() {
        expect(div.getAttribute('name')).toBe('my-name-is-bob');
      });
    });

    describe('when multiple objects are included in the lookupChain, the order they are checked', function() {
      it('is from lowest index to highest', function() {
        expect(div.id).toBe('my-brother-was-born-in-1988');
      });
    });

    describe('when a property is not defined in an object included in the lookupChain, the viewInterface', function() {
      it('is the \'global\' scope or last context checked for the property', function() {
        expect(div.getAttribute('class')).toBe('my-parent\'s-name-is-ishmael');
      });
    });

    describe('when a viewInterface function is called, its arguments', function() {
      it('is the lookupChain', function() {
        expect(div.getAttribute('fake')).toBe('my-brother\'s-name-is-bill');
      });
    });
  });
});

describe('.toggleClasses()', function() {
  describe('the delimiter of classes', function() {
    var delimiter = / +/;
    it('can be single spaces', function() {
      var string = 'one two three';
      expect(string.split(delimiter)).toEqual(['one','two','three']);
    });

    it('can be an arbitrary number of spaces', function() {
      var string = 'one  two   three';
      expect(string.split(delimiter)).toEqual(['one','two','three']);
    });
  });

  var makeDiv = function(toggleClasses) {
    var div = document.createElement('div');
    div.setAttribute('fx-toggle-class', toggleClasses);
    return div;
  }

  describe('when one class is given', function() {
    describe('when the class corresponds to a property in the lookup chain or viewInterface', function() {
      describe('when the property is true', function() {
        describe('when the property is found in the lookup chain', function() {
          it('adds the className to the element\'s class property', function() {
            var controller = fxjs.controller({ boolProp: false });
            var div = makeDiv('boolProp');

            controller.toggleClasses(div, [{ boolProp: true }]);
            expect(div.className).toBe('boolProp');
          });
        });

        describe('when the property is found in the viewController', function() {
          it('adds the className to the element\'s class property', function() {
            var controller = fxjs.controller({ boolProp: true });
            var div = makeDiv('boolProp');

            controller.toggleClasses(div, [{ boolPrp: false }]);
            expect(div.className).toBe('boolProp');
          });
        });

        describe('when there was no className', function() {
          it('starts a new className', function() {
            var div = makeDiv('newClass');
            fxjs.controller({ newClass: true }).toggleClasses(div);
            expect(div.className).toBe('newClass');
          });
        });

        describe('when there was already a className', function() {
          it('adds to the className', function() {
            var div = makeDiv('addClass');
            div.className = 'addToMe';
            fxjs.controller({ addClass: true }).toggleClasses(div);
            expect(div.className).toBe('addToMe addClass');
          });
        });
      });

      describe('when the property is truthy', function() {
        it('works the same as when it\'s true', function() {
          var controller = fxjs.controller({ truthy: [] });
          var div = makeDiv('truthy');
          controller.toggleClasses(div);
          expect(div.className).toBe('truthy');
        });
      });

      describe('when the property is false', function() {
        describe('when there was no className', function() {
          it('does not add the className', function() {
            var controller = fxjs.controller({ boolProp: false });
            var div = makeDiv('boolProp');
            controller.toggleClasses(div);
            expect(div.hasAttribute('class')).toBe(false);
          });
        });

        describe('when there was a className', function() {
          it('does not add the className', function() {
            var div = makeDiv('boolProp');
            div.className = 'addToMe';
            fxjs.controller({ boolProp: false }).toggleClasses(div);
            expect(div.className).toBe('addToMe');
          });
        });
      });

      describe('when the property is 0', function() {
        it('does not add the className', function() {
          var controller = fxjs.controller({ num: 0 });
          var div = makeDiv('num');
          controller.toggleClasses(div);
          expect(div.className).toBe('');
        });
      });
    });

    describe('when the toggleClass does not correspond to a property found in the lookupChain', function() {
      it('does not add the className', function() {
        var controller = fxjs.controller({ prop: 'value' });
        var div = makeDiv('noProp');
        controller.toggleClasses(div);
        expect(div.className).toBe('');
      });
    });

    describe('after processing', function() {
      describe('when the className was added, the fx-toggle attribute', function() {
        it('should be removed', function() {
          var div = makeDiv('prop');
          fxjs.controller({ prop: 'value' }).toggleClasses(div);
          expect(div.hasAttribute('fx-toggle-class')).toBe(false);
        });
      });

      describe('when the className was not added, the fx-toggle attribute', function() {
        it('is removed', function() {
          var div = makeDiv('noProp');
          fxjs.controller({ prop: 'value' }).toggleClasses(div);
          expect(div.hasAttribute('fx-toggle-class')).toBe(false);
        });
      });
    });

    describe('when there is no fx-toggle-class attribute', function() {
      it('changes nothing', function() {
        var div = document.createElement('div');
        fxjs.controller({ prop: 'value' }).toggleClasses(div);
        expect(div.hasAttribute('class')).toBe(false);
      });
    });
  });

  describe('when there are multiple classes to toggle', function() {
    describe('when all are true', function() {
      describe('when there is no previous className', function() {
        it('creates a new className of them all', function() {
          var div = makeDiv('class1 class2 class3');
          fxjs.controller({
            class1: true,
            class2: 'false',
            class3: 1
          }).toggleClasses(div);
          expect(div.className).toBe('class1 class2 class3');
        });
      });

      describe('when there is a previous className', function() {
        it('adds all the classNames to the existing one', function() {
          var div = makeDiv('class1 class2 class3');
          div.className = 'already-here';
          fxjs.controller({
            class1: true,
            class2: 'false',
            class3: 1
          }).toggleClasses(div);
          expect(div.className).toBe('already-here class1 class2 class3');
        });
      });

      describe('when they\'re true in different members of the lookup chain', function() {
        it('works the same way', function() {
          var div = makeDiv('class1 class2 class3');
          div.className = 'already-here here-too';
          fxjs.controller({
            class1: false,
            class3: true
          }).toggleClasses(div, [{ class2: true }, { class1: true }]);
          expect(div.className).toBe('already-here here-too class1 class2 class3');
        });
      });
    });

    describe('when all are false', function() {
      describe('when there is no previous className', function() {
        it('does not create one', function() {
          var div = makeDiv('class1 class2 class3');
          fxjs.controller().toggleClasses(div);
          expect(div.hasAttribute('class')).toBe(false);
        });
      });

      describe('when there is a previous className', function() {
        it('does not add to it', function() {
          var div = makeDiv('class1 class2 class3');
          div.className = 'already-here';
          fxjs.controller().toggleClasses(div);
          expect(div.className).toBe('already-here');
        });
      });

      describe('when a lookup chain is provided', function() {
        it('works the same way', function() {
          var div = makeDiv('class1 class2 class3');
          div.className = 'already-here here-too';
          fxjs.controller({
            class1: false,
            class3: true
          }).toggleClasses(div, [{}, { class3: false }]);
          expect(div.className).toBe('already-here here-too');
        });
      });
    });

    describe('when some are true and some are false', function() {
      describe('when there is no previous className', function() {
        it('adds the ones that are true to it', function() {
          var div = makeDiv('class1 class2 class3');
          fxjs.controller({
            class1: true,
            class3: false
          }).toggleClasses(div);
          expect(div.className).toBe('class1');
        });
      });

      describe('when there is a previous className', function() {
        it('adds the ones that are true to it', function() {
          var div = makeDiv('class1 class2 class3');
          div.className = 'already-here here-too';
          fxjs.controller({
            class1: true,
            class3: {}
          }).toggleClasses(div);
          expect(div.className).toBe('already-here here-too class1 class3');
        });
      });

      describe('when a lookup chain is provided', function() {
        it('works the same way', function() {
          var div = makeDiv('class1 class2 class3');
          div.className = 'already-here';
          fxjs.controller({
            class1: false
          }).toggleClasses(div, [{ class3: true }, { class1: true }]);
          expect(div.className).toBe('already-here class1 class3');
        });
      });
    });
  });
});

describe('.toggleDisplay()', function() {
  var makeDiv = function(toggleDisplay) {
    var div = document.createElement('div');
    div.setAttribute('fx-toggle-display', toggleDisplay);
    return div;
  }

  describe('when one or more of the toggle properties are found true in the lookup chain', function() {
    it('sets the display style to empty string', function() {
      var div = makeDiv('toggle1 toggle2');
      fxjs.controller({
        toggle1: false,
        toggle2: false
      }).toggleDisplay(div, [{ toggle2: true }]);
      expect(div.style.display).toBe('');
    });
  });

  describe('when none of the toggle properties are found true in the lookup chain', function() {
    it('sets the display style to \'none\'', function() {
      var div = makeDiv('toggle1 toggle2');
      fxjs.controller({
        toggle2: false
      }).toggleDisplay(div);
      expect(div.style.display).toBe('none');
    });
  });

  describe('when one or more of the toggle properties is negated', function() {
    describe('if the negated property is found true in the lookup chain', function() {
      it('contributes to setting the display property to \'none\'', function() {
        var div = makeDiv('toggle1 !toggle2');
        fxjs.controller({
          toggle1: false,
          toggle2: false
        }).toggleDisplay(div, [{ toggle2: true }]);
        expect(div.style.display).toBe('none');
      });
    });

    describe('if the property is found false in the lookup chain', function() {
      it('works as if it were true', function() {
        var div = makeDiv('!toggle1 !toggle2');
        fxjs.controller({
          toggle1: false,
          toggle2: false
        }).toggleDisplay(div);
        expect(div.style.display).toBe('');
      });
    });

    describe('if the property is found undefined in the lookup chain', function() {
      it('works as if it were true', function() {
        var div = makeDiv('!toggle1');
        fxjs.controller().toggleDisplay(div);
        expect(div.style.display).toBe('');
      });
    });
  });

  it('removes the toggle-display attribute', function() {
    var div = makeDiv('n/a');
    fxjs.controller().toggleDisplay(div);
    expect(div.hasAttribute('fx-toggle-display')).toBe(false);
  });
});

describe('.addEventListeners()', function() {
  var makeDiv = function(eventList) {
    var div = document.createElement('div');
    div.setAttribute('fx-on', eventList);
    return div;
  }

  describe('adding a single event listener', function() {
    describe('when no lookupChain is given', function() {
      describe('when the event handler is found in the viewInterface', function() {
        describe('when the event handler is a function', function() {
          it('calls that function on the viewInterface with the event as its argument', function() {
            var div = makeDiv('click:setTrue');
            var controller = fxjs.controller({
              bool: false,
              setTrue: function(e, arg1) {
                if(fxjs.isDefined(arg1)) { return; }
                if(e.type === 'click') { this.bool = true; }
              }
            });
            controller.addEventListeners(div);
            div.dispatchEvent(new MouseEvent('click'));
            expect(controller.viewInterface.bool).toBe(true);
          });
        });

        describe('when the event handler is a boolean property', function() {
          it('toggles the truth of the property in the viewInterface', function() {
            var div = makeDiv('keydown:boolProp');
            var controller = fxjs.controller({ boolProp: false });
            controller.addEventListeners(div);
            div.dispatchEvent(new KeyboardEvent('keydown'));
            expect(controller.viewInterface.boolProp).toBe(true);
          });
        });
      });

      describe('when the event handler is not found in the viewInterface', function() {
        it('does nothing', function() {
          var div = makeDiv('click:notFound');
          fxjs.controller().addEventListeners(div);
          var dispatchEvent = function() { div.dispatchEvent(new MouseEvent('click')); }
          expect(dispatchEvent).not.toThrow();
        });
      });
    });

    describe('when a lookupChain is given', function() {
      describe('if the event handler is found in the lookup chain', function() {
        describe('if it is a function', function() {
          it('is called on the object without arguments', function() {
            var div = makeDiv('keydown:boolProp');
            var object = {
              bool: false,
              boolProp: function(arg1) {
                if(arg1) { return; }
                this.bool = true;
              }
            };
            fxjs.controller().addEventListeners(div, [object]);
            div.dispatchEvent(new KeyboardEvent('keydown'));
            expect(object.bool).toBe(true);
          });
        });

        describe('if it is a boolean property', function() {
          it('toggles the truth of the property in the object it\'s found in', function() {
            var div = makeDiv('click: boolProp');
            var object1 = {};
            var object2 = { boolProp: true };
            fxjs.controller().addEventListeners(div, [object1, object2]);
            div.dispatchEvent(new MouseEvent('click'));
            expect(object2.boolProp).toBe(false);
          });
        });
      });
    });
  });

  describe('adding multiple event listeners', function() {
    describe('when each event type has its own handler', function() {
      it('attaches the handler to that event type', function() {
        var div = makeDiv('click: clickEvent; keypress: keyEvent');
        var controller = fxjs.controller({
          arrayProp: [],
          clickEvent: function(e) {
            this.arrayProp.push(e.type);
          },
          keyEvent: function(e) {
            this.arrayProp.push(e.type);
          }
        });
        controller.addEventListeners(div);
        div.dispatchEvent(new MouseEvent('click'));
        div.dispatchEvent(new KeyboardEvent('keypress'));
        expect(controller.viewInterface.arrayProp).toEqual(['click', 'keypress']);
      });
    });

    describe('when more than one event type share a handler', function() {
      it('attaches the handler to each of those event types', function() {
        var div = makeDiv('click, keypress: pushType');
        var controller = fxjs.controller({
          arrayProp: [],
          pushType: function(e) {
            this.arrayProp.push(e.type);
          },
        });
        controller.addEventListeners(div);
        div.dispatchEvent(new KeyboardEvent('keypress'));
        div.dispatchEvent(new MouseEvent('click'));
        expect(controller.viewInterface.arrayProp).toEqual(['keypress', 'click']);
      });
    });

    describe('when an event type has more than one handler', function() {
      it('attaches all handlers to the event, calling them in order', function() {
        var div = makeDiv('click: pushType, pushBool');
        var controller = fxjs.controller({
          arrayProp: [],
          pushType: function(e) {
            this.arrayProp.push(e.type);
          },
          pushBool: function(e) {
            this.arrayProp.push(true);
          }
        });
        controller.addEventListeners(div);
        div.dispatchEvent(new MouseEvent('click'));
        expect(controller.viewInterface.arrayProp).toEqual(['click', true]);
      });
    });

    describe('when multiple event types share multiple handlers', function() {
      it('attaches all handlers to each event', function() {
        var div = makeDiv('click, keypress: pushType, pushBool');
        var controller = fxjs.controller({
          arrayProp: [],
          pushType: function(e) {
            this.arrayProp.push(e.type);
          },
          pushBool: function(e) {
            this.arrayProp.push(true);
          }
        });
        controller.addEventListeners(div);
        div.dispatchEvent(new MouseEvent('click'));
        div.dispatchEvent(new KeyboardEvent('keypress'));
        expect(controller.viewInterface.arrayProp).toEqual(['click', true, 'keypress', true]);
      });
    });
  });

  it('removes the fx-on attribute', function() {
    var div = makeDiv('click: doSomething');
    fxjs.controller().addEventListeners(div);
    expect(div.hasAttribute('fx-on')).toBe(false);
  });
});

describe('.buildList()', function() {
  var makeDiv = function() {
    var parentDiv = document.createElement('div');
    var childDiv = document.createElement('div');
    childDiv.setAttribute('fx-foreach', 'n/a');
    parentDiv.appendChild(childDiv);
    parentDiv.childDiv = childDiv;
    return parentDiv;
  }

  describe('when there is no sibling element', function() {
    it('repeats the given element for each members of the given list', function() {
      var parentDiv = makeDiv();
      fxjs.controller().buildList(parentDiv.childDiv, ['a', 'b', 'c']);
      expect(parentDiv.children.length).toBe(3);
    });
  });

  describe('when there is a sibling element', function() {
    it('repeats the given element for each member of the given list, before the sibling element', function() {
      var parentDiv = makeDiv();
      parentDiv.appendChild(document.createElement('p'));
      fxjs.controller().buildList(parentDiv.childDiv, [1, 2, 3]);
      var childArray = Array.prototype.slice.call(parentDiv.children);
      var tagNames = childArray.map(function(element) { return element.tagName; });
      expect(tagNames).toEqual(['DIV', 'DIV', 'DIV', 'P']);
    });
  });

  describe('when there is a sibling before and a sibling after', function() {
    it('repeats the given element for each member of the given list, between the previous sibling and the next sibling', function() {
      var parentDiv = makeDiv();
      parentDiv.insertBefore(document.createElement('p'), parentDiv.childDiv);
      parentDiv.appendChild(document.createElement('p'));
      fxjs.controller().buildList(parentDiv.childDiv, [1, 2, 3]);
      var childArray = Array.prototype.slice.call(parentDiv.children);
      var tagNames = childArray.map(function(element) { return element.tagName; });
      expect(tagNames).toEqual(['P', 'DIV', 'DIV', 'DIV', 'P']);
    });
  });

  it('removes the original element', function() {
    var parentDiv = makeDiv();
    fxjs.controller().buildList(parentDiv.childDiv, ['a', 'b', 'c']);
    var childArray = Array.prototype.slice.call(parentDiv.children);
    var isOriginal = childArray.some(function(element) {
      return element === parentDiv.childDiv;
    });
    expect(isOriginal).toBe(false);
  });

  it('removes the fx-foreach attribute from each clone', function() {
    var parentDiv = makeDiv();
    fxjs.controller().buildList(parentDiv.childDiv, ['a', 'b', 'c']);
    var childArray = Array.prototype.slice.call(parentDiv.children);
    var hasAttribute = childArray.some(function(element) {
      return element.hasAttribute('fx-foreach');
    });
    expect(hasAttribute).toBe(false);
  });

  describe('when given an FXCollection', function() {
    it('processes the element on each member of the collection', function() {
      var collection = fxjs.collection({
        boolProp: true,
        name: ''
      }).addMembers(
        { boolProp: false, name: 'Jack' },
        { name: 'Bob' }
      );
      var parentDiv = makeDiv();
      parentDiv.childDiv.textContent = '{{name}}';
      fxjs.controller().buildList(parentDiv.childDiv, collection);
      var childArray = Array.prototype.slice.call(parentDiv.children);
      var divText = childArray.map(function(element) { return element.textContent.trim(); });
      expect(divText).toEqual(['Jack', 'Bob']);
    });
  });
});

afterAll(function() {
  var linkedElement = document.querySelector('[fx-controller=linkedController]');
  linkedElement.parentElement.removeChild(linkedElement);
});

});
