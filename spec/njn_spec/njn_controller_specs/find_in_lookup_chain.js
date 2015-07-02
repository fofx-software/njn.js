describe('findInLookupChain()', function() {
  var controller = njn.controller();
  var findInLookupChain = __njn_controller_utility_functions__.findInLookupChain;

  describe('if the property is found in a member of the lookupChain', function() {
    it('returns the member', function() {
      var lookupChain = [{ a: 1 }, { b: 2 }];
      var found = findInLookupChain('a', lookupChain);
      expect(found).toBe(lookupChain[0]);
    });

    describe('if the member that has the property is beyond the first member of the lookupChain', function() {
      it('continues searching until it finds the member with the property', function() {
        var lookupChain = [{ a: 1 }, { b: 2 }, { c: 3 }];
        var found = findInLookupChain('c', lookupChain);
        expect(found).toBe(lookupChain[2]);
      });
    });

    describe('if multiple members of the lookupChain have the same property', function() {
      it('returns the member closest to the start of the lookupChain with the property', function() {
        var lookupChain = [{ a: 1 }, { b: 2 }, { a: 3 }];
        var found = findInLookupChain('a', lookupChain);
        expect(found).toBe(lookupChain[0]);
      });
    });
  });

  describe('if the property is not found in a member of the lookupChain', function() {
    it('returns undefined', function() {
      var lookupChain = [{ a: 1 }, { b: 2 }, { c: 3 }];
      var found = findInLookupChain('d', lookupChain);
      expect(found).toBeUndefined();
    });
  });

  describe('if the property is inherited', function() {
    it('works the same way', function() {
      var obj = Object.create({ a: 1 });
      expect(obj.hasOwnProperty('a')).toBe(false);
      var found = findInLookupChain('a', [obj]);
      expect(found).toBe(obj);
    });
  });

  describe('when provided primitives instead of objects', function() {
    var lookupChain = [1,'a'];
    describe('when a string has the property', function() {
      it('returns the string', function() {
        expect(findInLookupChain('split', [1,'a'])).toBe('a');
      });
    });

    describe('when a number has the property', function() {
      it('returns the number', function() {
        expect(findInLookupChain('toString', [1,'a'])).toBe(1);
      });
    });

    describe('when a boolean has the property', function() {
      it('returns the boolean', function() {
        expect(findInLookupChain('valueOf', [true])).toBe(true);
      });
    });

    describe('when a queried value is undefined', function() {
      it('skips the value', function() {
        expect(findInLookupChain('toString', [undefined, 1])).toBe(1);
      });
    });

    describe('when a queried value is null', function() {
      it('skips the value', function() {
        expect(findInLookupChain('toString', [null, 1])).toBe(1);
      });
    });
  });
});
