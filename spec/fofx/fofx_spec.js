describe('fofx', function() {

describe('.isObject()', function() {
  describe('when given an object literal', function() {
    it('returns true', function() {
      expect(fofx.isObject({})).toBe(true);
    });
  });

  describe('when given an array', function() {
    it('returns false', function() {
      expect(fofx.isObject([])).toBe(false);
    });
  });

  describe('when given null', function() {
    it('returns false', function() {
      expect(fofx.isObject(null)).toBe(false);
    });
  });

  describe('when given a string', function() {
    it('returns false', function() {
      expect(fofx.isObject('string')).toBe(false);
    });
  });

  describe('when given a number', function() {
    it('returns false', function() {
      expect(fofx.isObject(3)).toBe(false);
    });
  });

  describe('when given a custom object', function() {
    it('returns true', function() {
      var customConstructor = function() { }
      var customObject = new customConstructor;
      expect(fofx.isObject(customObject)).toBe(true);
    });
  });
});

describe('.camelCase()', function() {
  describe('when given a string delimited by dashes', function() {
    it('replaces the dashes with camelcase', function() {
      expect(fofx.camelCase('hello-cruel-world')).toBe('helloCruelWorld');
    });
  });

  describe('when given a string delimited by underscores', function() {
    it('replaces the underscores with camelcase', function() {
      expect(fofx.camelCase('hello_cruel_world')).toBe('helloCruelWorld');
    });
  });

  describe('when given a string delimited by spaces', function() {
    it('replaces the spaces with camelcase', function() {
      expect(fofx.camelCase('hello cruel world')).toBe('helloCruelWorld');
    });
  });
});

describe('.isBlank()', function() {
  describe('when given an empty string', function() {
    it('returns true', function() {
      expect(fofx.isBlank('')).toBe(true);
    });
  });

  describe('when given a string consisting only of whitesapce', function() {
    it('returns true', function() {
      expect(fofx.isBlank('   ')).toBe(true);
    });
  });
});

describe('fofx.Object', function() {
  describe('.clone()', function() {
    var original = { a: 1, b: { d: 'e' }, c: ['a'] };

    describe('shallow clone', function() {
      var shallowClone = fofx.Object.clone(original);

      describe('its keys', function() {
        it('are the same as the original\'s', function() {
          expect(Object.keys(shallowClone)).toEqual(Object.keys(original));
        });
 
        describe('their values', function() {
          it('are the same as the original\'s', function() {
            expect(shallowClone.a).toBe(original.a);
            expect(shallowClone.b).toBe(original.b);
            expect(shallowClone.c).toBe(original.c);
          });
        });
      });
    });

    describe('deep clone', function() {
      var deepClone = fofx.Object.clone(original, true);
    });
  });
});

});
