describe('fxjs', function() {

describe('.isPlainObject()', function() {
  describe('when given an object literal', function() {
    it('returns true', function() {
      expect(fxjs.isPlainObject({})).toBe(true);
    });
  });

  describe('when given an array', function() {
    it('returns false', function() {
      expect(fxjs.isPlainObject([])).toBe(false);
    });
  });

  describe('when given null', function() {
    it('returns false', function() {
      expect(fxjs.isPlainObject(null)).toBe(false);
    });
  });

  describe('when given a string', function() {
    it('returns false', function() {
      expect(fxjs.isPlainObject('string')).toBe(false);
    });
  });

  describe('when given a number', function() {
    it('returns false', function() {
      expect(fxjs.isPlainObject(3)).toBe(false);
    });
  });

  describe('when given a custom object', function() {
    it('returns true', function() {
      var customConstructor = function() { }
      var customObject = new customConstructor;
      expect(fxjs.isPlainObject(customObject)).toBe(true);
    });
  });
});

describe('.camelCase()', function() {
  describe('when given a string delimited by dashes', function() {
    it('replaces the dashes with camelcase', function() {
      expect(fxjs.camelCase('hello-cruel-world')).toBe('helloCruelWorld');
    });
  });

  describe('when given a string delimited by underscores', function() {
    it('replaces the underscores with camelcase', function() {
      expect(fxjs.camelCase('hello_cruel_world')).toBe('helloCruelWorld');
    });
  });

  describe('when given a string delimited by spaces', function() {
    it('replaces the spaces with camelcase', function() {
      expect(fxjs.camelCase('hello cruel world')).toBe('helloCruelWorld');
    });
  });
});

describe('.isBlank()', function() {
  describe('when given an empty string', function() {
    it('returns true', function() {
      expect(fxjs.isBlank('')).toBe(true);
    });
  });

  describe('when given a string consisting only of whitesapce', function() {
    it('returns true', function() {
      expect(fxjs.isBlank('   ')).toBe(true);
    });
  });
});

});
