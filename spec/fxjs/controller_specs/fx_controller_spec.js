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

  describe('the toplevel attributes', function() {
    it('are processed', function() {
      expect(configureAttribute.getAttribute('name')).toBe('result of configure-attribute');
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

  describe('when there is an existing class', function() {
    it('is overridden by the new class', function() {
      expect(children[2].className).toBe('new-class');
    });
  });

  describe('when multiple properties are given', function() {
    it('processes each one', function() {
      expect(children[3].className).toBe('first-class second-class third-class');
    });
  });

  describe('combining processText and configureAttribute', function() {
    it('processes each', function() {
      var childNodes = children[4].childNodes;
      expect(childNodes[0].textContent).toBe('first text');
      expect(childNodes[1].getAttribute('name')).toBe('in the middle');
      expect(childNodes[1].textContent).toBe('in the middle');
      expect(childNodes[2].textContent).toBe('end text');
    });
  });

  afterAll(function() { document.body.removeChild(configureAttribute); });
});


