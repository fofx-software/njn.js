describe('processText()', function() {
  var processText = __njn_controller_utility_functions__.processText;

  var viewInterface = {
    name: 'John',
    birthyear: (new Date).getFullYear() - 25,
    age: function() { return (new Date).getFullYear() - this.birthyear; },
    '0prop1prop2': 'works',
    '_prop_prop_': 'also works',
    'prop?': 'works too'
  };

  describe('when the text does not have an interpolator', function() {
    it('returns the same text', function() {
      expect(processText('won\'t change', [viewInterface])).toBe('won\'t change');
    });
  });

  describe('when the text has an interpolator, but it does not correspond to a property in the lookupChain', function() {
    it('replaces the interpolator with undefined', function() {
      expect(processText('{{noProp}}', [viewInterface])).toBe('undefined');
    });
  });

  describe('when an interpolator has leading white space', function() {
    it('does not interpolate', function() {
      expect(processText('{{ name}}', [viewInterface])).toBe('{{ name}}');
    });
  });

  describe('when an interpolator has trailing white space', function() {
    it('does not interpolate', function() {
      expect(processText('{{name }}', [viewInterface])).toBe('{{name }}');
    });
  });

  describe('when an interpolator has inner white space', function() {
    it('does not interpolate', function() {
      expect(processText('{{name name}}', [viewInterface])).toBe('{{name name}}');
    });
  });

  describe('when an interpolator is only a bang', function() {
    it('does not interpolate', function() {
      expect(processText('{{!}}', [viewInterface])).toBe('{{!}}');
    });
  });

  describe('when an interpolator is only a question mark', function() {
    it('does not interpolate', function() {
      expect(processText('{{?}}', [viewInterface])).toBe('{{?}}');
    });
  });

  describe('when an interpolator is only a bang and a question mark', function() {
    it('does not interpolate', function() {
      expect(processText('{{!?}}', [viewInterface])).toBe('{{!?}}');
    });
  });

  describe('when the text has interpolators that correspond to properties in the lookupChain', function() {
    it('replaces the interpolator with the resolved value of the properties', function() {
      var processed = processText('I am {{name}}.  I am {{age}} years old.', [viewInterface]);
      expect(processed).toBe('I am John.  I am 25 years old.');
    });

    describe('when the interpolator starts with a bang', function() {
      it('negates the value', function() {
        expect(processText('{{!name}}', [viewInterface])).toBe('false');
      });
    });

    describe('when the interpolator contains numbers', function() {
      it('works', function() {
        expect(processText('{{0prop1prop2}}', [viewInterface])).toBe('works');
      });
    });

    describe('when the interpolator contains underscores', function() {
      it('works', function() {
        expect(processText('{{_prop_prop_}}', [viewInterface])).toBe('also works');
      });
    });

    describe('when the interpolator ends in a question mark', function() {
      it('works', function() {
        expect(processText('{{prop?}}', [viewInterface])).toBe('works too');
      });
    });

    describe('when the string contains multiple of the same interpolator', function() {
      it('interpolates each of them', function() {
        expect(processText('{{name}} {{name}} {{name}}', [viewInterface])).toBe('John John John');
      });
    });
  });
});
