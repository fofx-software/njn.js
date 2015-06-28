describe('njn_controller.findInLookupChain()', function() {
  var controller = njn.controller();

  describe('when used without a viewInterface or lookupChain', function() {
    it('returns undefined', function() {
      expect(controller.findInLookupChain('foo')).toBeUndefined();
    });
  });

  describe('when used with a viewInterface but no lookupChain', function() {
    var controller = njn.controller({ a: 1 });

    describe('if the property is found in the viewInterface', function() {
      it('returns the viewInterface', function() {
        expect(controller.findInLookupChain('a')).toBe(controller.viewInterface);
      });
    });

    describe('if the property is not found in the viewInterface', function() {
      it('returns undefined', function() {
        expect(controller.findInLookupChain('foo')).toBeUndefined();
      });
    });
  });

  describe('when used with a lookupChain but no viewInterface', function() {
    describe('if the property is found in a member of the lookupChain', function() {
      it('returns the member', function() {
        var lookupChain = [{ a: 1 }, { b: 2 }];
        var found = controller.findInLookupChain('a', lookupChain);
        expect(found).toBe(lookupChain[0]);
      });

      describe('if the member that has the property is beyond the first member of the lookupChain', function() {
        it('continues searching until it finds the member with the property', function() {
          var lookupChain = [{ a: 1 }, { b: 2 }, { c: 3 }];
          var found = controller.findInLookupChain('c', lookupChain);
          expect(found).toBe(lookupChain[2]);
        });
      });

      describe('if multiple members of the lookupChain have the same property', function() {
        it('returns the member closest to the start of the lookupChain with the property', function() {
          var lookupChain = [{ a: 1 }, { b: 2 }, { a: 3 }];
          var found = controller.findInLookupChain('a', lookupChain);
          expect(found).toBe(lookupChain[0]);
        });
      });
    });

    describe('if the property is not found in a member of the lookupChain', function() {
      it('returns undefined', function() {
        var lookupChain = [{ a: 1 }, { b: 2 }, { c: 3 }];
        var found = controller.findInLookupChain('d', lookupChain);
        expect(found).toBeUndefined();
      });
    });

    describe('if the property is inherited', function() {
      it('works the same way', function() {
        var obj = Object.create({ a: 1 });
        expect(obj.hasOwnProperty('a')).toBe(false);
        var found = controller.findInLookupChain('a', [obj]);
        expect(found).toBe(obj);
      });
    });
  });

  describe('when a viewInterface and lookupChain are provided', function() {
    var controller = njn.controller({ d: 4, c: 3 });
    var lookupChain = [{ a: 1 }, { b: 2 }, { c: 3 }];

    describe('if a member of the lookupChain and the viewInterface both have the property', function() {
      it('returns the member of the lookupChain', function() {
        var found = controller.findInLookupChain('c', lookupChain);
        expect(found).toBe(lookupChain[2]);
      });
    });

    describe('if no member of the lookupChain has the property but the viewInterface does', function() {
      it('returns the viewInterface', function() {
        var found = controller.findInLookupChain('d', lookupChain);
        expect(found).toBe(controller.viewInterface);
      });
    });

    describe('if no member of the lookupChain has the property and neither does the viewInterface', function() {
      it('returns undefined', function() {
        var found = controller.findInLookupChain('e', lookupChain);
        expect(found).toBeUndefined();
      });
    });
  });

  describe('when provided primitives instead of objects', function() {
    var lookupChain = [1,'a'];
    describe('when a string has the property', function() {
      it('returns the string', function() {
        expect(controller.findInLookupChain('split', [1,'a'])).toBe('a');
      });
    });

    describe('when a number has the property', function() {
      it('returns the number', function() {
        expect(controller.findInLookupChain('toString', [1,'a'])).toBe(1);
      });
    });

    describe('when a boolean has the property', function() {
      it('returns the boolean', function() {
        expect(controller.findInLookupChain('valueOf', [true])).toBe(true);
      });
    });

    describe('when a queried value is undefined', function() {
      it('skips the value', function() {
        expect(controller.findInLookupChain('toString', [undefined, 1])).toBe(1);
      });
    });

    describe('when a queried value is null', function() {
      it('skips the value', function() {
        expect(controller.findInLookupChain('toString', [null, 1])).toBe(1);
      });
    });
  });
});
