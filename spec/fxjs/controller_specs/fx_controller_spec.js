describe('processText', function() {
  var processText = document.getElementById('process-text');
  var ps = processText.getElementsByTagName('p');

  describe('own text processing', function() {
    it('works along with child elements', function() {
      var childNodes = processText.childNodes;
      expect(childNodes[0].textContent.trim()).toBe('start text');
      expect(childNodes[12].textContent.trim()).toBe('inner text');
      expect(childNodes[22].textContent.trim()).toBe('end text');
    });
  });

  describe('its first p\'s textContent', function() {
    it('is "this is the text"', function() {
      expect(ps[0].textContent.trim()).toBe('this is the text');
    });
  });

  describe('its second p\'s textContent', function() {
    it('is "this is the text from a function"', function() {
      expect(ps[1].textContent.trim()).toBe('this is the text from a function');
    });
  });

  describe('its third p\'s textContent', function() {
    it('is "undefined"', function() {
      expect(ps[2].textContent.trim()).toBe('undefined');
    });
  });

  describe('its fourth p\'s textContent', function() {
    it('is "this text is in the middle of other text"', function() {
      expect(ps[3].textContent.trim()).toBe('this text is in the middle of other text');
    });
  });

  describe('its fifth p\'s textContent', function() {
    it('has two interpolations', function() {
      expect(ps[4].textContent.trim()).toBe('this text has multiple processed segments');
    });
  });

  describe('its sixth p\'s textContent', function() {
    it('is "curr-element"', function() {
      expect(ps[5].textContent.trim()).toBe('curr-element');
    });
  });

  describe('its seventh p\'s textContent', function() {
    it('comes from a property ending in a quetion mark', function() {
      expect(ps[6].textContent.trim()).toBe('true');
    });
  });

  describe('its eighth p\'s textContent', function() {
    it('has a bang which negates the property\'s value', function() {
      expect(ps[7].textContent.trim()).toBe('true');
    });
  });

  describe('its ninth p\'s grandchild\'s textContent', function() {
    it('is processed correctly', function() {
      var grandchild = ps[8].children[0].children[0];
      expect(grandchild.textContent.trim()).toBe('hi, grandpa!');
    });
  });

  describe('interpolators with whitespace', function() {
    it('won\'t be processed', function() {
      expect(ps[9].textContent.trim()).toBe('{{ withLeadingSpace}}');
      expect(ps[10].textContent.trim()).toBe('{{withTrailingSpace }}');
    });
  });

  afterAll(function() { document.body.removeChild(processText); });
});

describe('configureAttribute', function() {
  var configureAttribute = document.getElementById('configure-attribute');
  var children = configureAttribute.children;

  describe('on the toplevel attributes', function() {
    it('processes the className', function() {
      expect(configureAttribute.getAttribute('name')).toBe('result of configure-attribute');
    });

    it('removes the fx-attr attribute', function() {
      expect(configureAttribute.hasAttribute('fx-attr-name')).toBe(false);
    });
  });

  describe('arguments to functions', function() {
    it('there are none', function() {
      expect(children[0].className).toBe('undefined');
    });
  });

  describe('currElement', function() {
    it('is the element being processed', function() {
      expect(children[1].style.display).toBe('none');
    });
  });

  describe('when there is an existing attribute', function() {
    describe('when it is given in the element before the fx-attr', function() {
      it('is overridden by the new attribute', function() {
        expect(children[2].className).toBe('new-class');
      });
    });

    describe('when it is given in the element after the fx-attr', function() {
      it('is overridden by the new attribute', function() {
        expect(children[3].className).toBe('new-class');
      });
    });
  });

  describe('when multiple properties are given', function() {
    it('processes each one', function() {
      expect(children[4].className).toBe('first-class second-class third-class');
    });
  });

  describe('combining processText and configureAttribute', function() {
    it('processes each', function() {
      var childNodes = children[5].childNodes;
      expect(childNodes[0].textContent).toBe('first text');
      expect(childNodes[1].getAttribute('name')).toBe('in the middle');
      expect(childNodes[1].textContent).toBe('in the middle');
      expect(childNodes[2].textContent).toBe('end text');
    });
  });

  afterAll(function() { document.body.removeChild(configureAttribute); });
});

describe('toggleClasses', function() {
  var toggleClasses = document.getElementById('toggle-classes');
  var ul = toggleClasses.getElementsByTagName('ul')[0];
  var lis = ul.getElementsByTagName('li');

  describe('on the top-level element', function() {
    it('sets the className', function() {
      expect(toggleClasses.className).toBe('trueClass');
    });

    it('removes the fx-toggle-class attribute', function() {
      expect(toggleClasses.hasAttribute('fx-toggle-class')).toBe(false);
    });
  });

  describe('when the referenced property resolves to true', function() {
    it('adds the referenced property name as a class', function() {
      expect(ul.className).toBe('trueClass');
    });

    it('removes the fx-toggle-class attribute', function() {
      expect(ul.hasAttribute('fx-toggle-class')).toBe(false);
    });
  });

  describe('when the referenced property resolves to truthy', function() {
    it('adds the referenced property name as a class', function() {
      expect(lis[13].className).toBe('getObject');
    });
  });

  describe('when the referenced property resolves to false', function() {
    it('does not add the referenced property name as a class', function() {
      expect(lis[0].className).toBe('');
    });

    it('still removes the fx-toggle-class attribute', function() {
      expect(lis[0].hasAttribute('fx-toggle-class')).toBe(false);
    });
  });

  describe('when the referenced property is undefined', function() {
    it('does not add the referenced property name as a class', function() {
      expect(lis[1].className).toBe('');
    });

    it('still removes the fx-toggle-class attribute', function() {
      expect(lis[1].hasAttribute('fx-toggle-class')).toBe(false);
    });
  });

  describe('when the referenced property is a function', function() {
    it('is called without any arguments', function() {
      expect(lis[2].className).toBe('');
    });

    it('is on called on viewInterface', function() {
      expect(lis[3].className).toBe('getTrue');
    });

    it('is called while currElem is set to the element being processed', function() {
      expect(lis[4].className).toBe('useCurrElem');
    });
  });

  describe('when the element already has a className', function() {
    describe('when the className is given in the element before the fx-toggle-class', function() {
      it('adds the new class(es) to the existing one(s)', function() {
        expect(lis[5].className).toBe('prior-class trueClass');
      });
    });

    describe('when the className is given in the element after the fx-toggle-class', function() {
      it('adds the new class(es) to the existing one(s)', function() {
        expect(lis[6].className).toBe('prior-class trueClass');
      });
    });

    describe('when the referenced property resolves to false', function() {
      it('does not add the new class(es)', function() {
        expect(lis[7].className).toBe('prior-class');
      });
    });
  });

  describe('when more than one toggle-class is given', function() {
    describe('when they are all true', function() {
      it('adds them all', function() {
        expect(lis[8].className).toBe('trueClass getTrue');
      });

      describe('when there was a prior className', function() {
        it('adds them all', function() {
          expect(lis[9].className).toBe('prior-class trueClass getTrue');
        });
      });
    });

    describe('when some are true and some are false', function() {
      it('adds the ones that are true', function() {
        expect(lis[10].className).toBe('trueClass getTrue');
      });

      describe('when there was a prior className', function() {
        it('adds the ones that are true', function() {
          expect(lis[11].className).toBe('prior-class trueClass getTrue');
        });
      });
    });

    describe('when all are false', function() {
      it('adds none', function() {
        expect(lis[12].className).toBe('prior-class');
      });
    });
  });

  describe('using fx-attr, fx-toggle-class and processText', function() {
    it('runs each operation correctly', function() {
      expect(lis[14].getAttribute('name')).toBe('my name is bob');
      expect(lis[14].className).toBe('trueClass');
      expect(lis[14].textContent.trim()).toBe('hi!');
    });
  });

  afterAll(function() { document.body.removeChild(toggleClasses); });
});

describe('toggleDisplay', function() {
  var toggleDisplay = document.getElementById('toggle-display');
  var divs = toggleDisplay.getElementsByTagName('div');

  describe('when the referenced property resolves to true', function() {
    it('shows the element', function() {
      expect(divs[0].style.display).toBe('');
    });

    it('removes the fx-toggle-display attribute', function() {
      expect(divs[0].hasAttribute('fx-toggle-display')).toBe(false);
    });
  });

  describe('when the referenced property resolves truthy', function() {
    it('shows the element', function() {
      expect(divs[1].style.display).toBe('');
    });

    it('removes the fx-toggle-display attribute', function() {
      expect(divs[1].hasAttribute('fx-toggle-display')).toBe(false);
    });
  });

  describe('when the referenced property resolves to false', function() {
    it('hides the element', function() {
      expect(divs[2].style.display).toBe('none');
    });

    it('removes the fx-toggle-display attribute', function() {
      expect(divs[2].hasAttribute('fx-toggle-display')).toBe(false);
    });
  });

  describe('when the referenced property resolves to falsey', function() {
    it('hides the element', function() {
      expect(divs[3].style.display).toBe('none');
    });

    it('removes the fx-toggle-display attribute', function() {
      expect(divs[3].hasAttribute('fx-toggle-display')).toBe(false);
    });
  });

  describe('when the referenced property is a function', function() {
    it('calls the method on viewInterface', function() {
      expect(divs[4].style.display).toBe('none');
    });

    it('calls the method without arguments', function() {
      expect(divs[5].style.display).toBe('none');
    });

    it('sets currElement to the element being processed', function() {
      expect(divs[6].style.display).toBe('none');
    });
  });

  describe('when the referenced property is not found', function() {
    it('hides the element', function() {
      expect(divs[7].style.display).toBe('none');
    });
  });

  describe('when the referenced property is negated', function() {
    it('uses the negation of the property', function() {
      expect(divs[8].style.display).toBe('');
    });
  });

  describe('when multiple properties are given', function() {
    describe('when any are true', function() {
      it('shows the element', function() {
        expect(divs[9].style.display).toBe('');
      });
    });

    describe('when all are false', function() {
      it('hides the element', function() {
        expect(divs[10].style.display).toBe('none');
      });
    });
  });

  describe('when combined with fx-attr-*, fx-toggle-class and processText', function() {
    it('processes each', function() {
      expect(divs[11].style.display).toBe('none');
      expect(divs[11].className).toBe('trueProperty');
      expect(divs[11].getAttribute('name')).toBe('bob');
      expect(divs[11].textContent.trim()).toBe('bob');
    });
  });

  afterAll(function() { document.body.removeChild(toggleDisplay); });
});

describe('addEventListeners', function() {
  var addEventListeners = document.getElementById('add-event-listeners');
  var ps = addEventListeners.getElementsByTagName('p');
  var controller = fxjs.registeredControllers['addEventListeners'];

  describe('when given one event type and one handler', function() {
    it('attaches the handler to that event', function() {
      ps[0].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(true);
    });

    describe('when there is a space between the event type and the handler name', function() {
      it('works the same', function() {
        ps[1].dispatchEvent(new MouseEvent('click'));
        expect(controller.viewInterface.boolProp).toBe(false);
      });
    });

    describe('when there is a semicolon after the handler name', function() {
      it('works the same', function() {
        ps[2].dispatchEvent(new MouseEvent('click'));
        expect(controller.viewInterface.boolProp).toBe(true);
      });
    });

    it('removes the fx-on attribute', function() {
      expect(ps[0].hasAttribute('fx-on')).toBe(false);
    });
  });

  describe('when the referenced handler is a boolean property', function() {
    it('toggles the truthiness of it', function() {
      ps[3].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(false);
    });
  });

  describe('when the referenced handler is a function', function() {
    it('is called on the viewInterface without any arguments', function() {
      ps[4].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.argProp).toBeUndefined();
    });

    it('sets currElement to the element being processed', function() {
      ps[5].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.argProp).toBe('curr-element');
    });
  });

  describe('when multiple events are referenced, each with one handler', function() {
    it('attaches the handler to each event', function() {
      ps[6].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(true);
      ps[6].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.argProp).toBe('abc');
    });
  });

  describe('when multiple handlers are attached to one event', function() {
    it('fires each handler when the event is triggered', function() {
      ps[7].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(false);
      expect(controller.viewInterface.argProp).toBe('123');
    });
  });

  describe('when one handler is attached to multiple events', function() {
    it('attaches the handler to all events', function() {
      ps[8].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(true);
      ps[8].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.boolProp).toBe(false);
    });
  });

  describe('when multiple handlers are attached to multiple events', function() {
    it('calls all the handlers whenever any of the events is triggered', function() {
      ps[9].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(true);
      expect(controller.viewInterface.count).toBe(1);
      ps[9].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.boolProp).toBe(false);
      expect(controller.viewInterface.count).toBe(2);
    });
  });

  describe('when many varieties of assignments are combine', function() {
    it('handles them all correctly', function() {
      ps[10].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.argProp).toBe('combineAll');
      ps[10].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.boolProp).toBe(true);
      expect(controller.viewInterface.count).toBe(3);
      ps[10].dispatchEvent(new Event('mouseover'));
      expect(controller.viewInterface.count).toBe(4);
      ps[10].dispatchEvent(new Event('mouseout'));
      expect(controller.viewInterface.count).toBe(5);
      ps[10].dispatchEvent(new KeyboardEvent('keydown'));
      expect(controller.viewInterface.boolProp).toBe(false);
      expect(controller.viewInterface.count).toBe(6);
      ps[10].dispatchEvent(new KeyboardEvent('keyup'));
      expect(controller.viewInterface.boolProp).toBe(true);
      expect(controller.viewInterface.count).toBe(7);
    });
  });

  afterAll(function() { document.body.removeChild(addEventListeners); });
});
