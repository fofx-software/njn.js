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
