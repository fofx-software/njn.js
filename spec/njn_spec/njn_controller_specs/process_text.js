describe('processText()', function() {
  var processText = __njn_controller_utility_functions__.processText;

  var controller = njn.controller({
    name: 'John',
    birthyear: (new Date).getFullYear() - 25,
    age: function() { return (new Date).getFullYear() - this.birthyear; },
    '0prop1prop2': 'works',
    '_prop_prop_': 'also works',
    'prop?': 'works too'
  });

  describe('when the text does not have an interpolator', function() {
    it('returns the same text', function() {
      expect(processText(controller, 'won\'t change')).toBe('won\'t change');
    });
  });

  describe('when the text has an interpolator, but it does not correspond to a property in the lookupChain', function() {
    it('replaces the interpolator with undefined', function() {
      expect(processText(controller, '{{noProp}}')).toBe('undefined');
    });
  });

  describe('when an interpolator has leading white space', function() {
    it('does not interpolate', function() {
      expect(processText(controller, '{{ name}}')).toBe('{{ name}}');
    });
  });

  describe('when an interpolator has trailing white space', function() {
    it('does not interpolate', function() {
      expect(processText(controller, '{{name }}')).toBe('{{name }}');
    });
  });

  describe('when an interpolator has inner white space', function() {
    it('does not interpolate', function() {
      expect(processText(controller, '{{name name}}')).toBe('{{name name}}');
    });
  });

  describe('when an interpolator is only a bang', function() {
    it('does not interpolate', function() {
      expect(processText(controller, '{{!}}')).toBe('{{!}}');
    });
  });

  describe('when an interpolator is only a question mark', function() {
    it('does not interpolate', function() {
      expect(processText(controller, '{{?}}')).toBe('{{?}}');
    });
  });

  describe('when an interpolator is only a bang and a question mark', function() {
    it('does not interpolate', function() {
      expect(processText(controller, '{{!?}}')).toBe('{{!?}}');
    });
  });

  describe('when the text has interpolators that correspond to properties in the lookupChain', function() {
    it('replaces the interpolator with the resolved value of the properties', function() {
      var processed = processText(controller, 'I am {{name}}.  I am {{age}} years old.');
      expect(processed).toBe('I am John.  I am 25 years old.');
    });

    describe('when the interpolator starts with a bang', function() {
      it('negates the value', function() {
        expect(processText(controller, '{{!name}}')).toBe('false');
      });
    });

    describe('when the interpolator contains numbers', function() {
      it('works', function() {
        expect(processText(controller, '{{0prop1prop2}}')).toBe('works');
      });
    });

    describe('when the interpolator contains underscores', function() {
      it('works', function() {
        expect(processText(controller, '{{_prop_prop_}}')).toBe('also works');
      });
    });

    describe('when the interpolator ends in a question mark', function() {
      it('works', function() {
        expect(processText(controller, '{{prop?}}')).toBe('works too');
      });
    });

    describe('when the string contains multiple of the same interpolator', function() {
      it('interpolates each of them', function() {
        expect(processText(controller, '{{name}} {{name}} {{name}}')).toBe('John John John');
      });
    });
  });
});
