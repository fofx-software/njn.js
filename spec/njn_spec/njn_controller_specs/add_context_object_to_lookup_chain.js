describe('addContextObjectToLookupChain()', function() {
  var noVI = njn.controller();
  var withVI = njn.controller({ subobj: ['a','b'] });
  var noAttr = document.createElement('div');
  var withAttr = document.createElement('div');
  withAttr.setAttribute('njn-context', 'subobj');
  var addContextObjectToLookupChain = __njn_controller_utility_functions__.addContextObjectToLookupChain;

  describe('when given no element', function() {
    it('raises an exception', function() {
      var willThrow = function() { addContextObjectToLookupChain(noVI); }
      expect(willThrow).toThrow();
    });
  });

  describe('when given an element without an njn-context attribute', function() {
    it('returns the lookupChain', function() {
      var returned = addContextObjectToLookupChain(noVI, noAttr, [1,2,3]);
      expect(returned).toEqual([1,2,3]);
    });
  });

  describe('when given an element with an njn-context attribute but no viewInterface or lookupChain', function() {
    var clone = withAttr.cloneNode();

    it('returns undefined', function() {
      var returned = addContextObjectToLookupChain(noVI, clone);
      expect(returned).toBeUndefined();
    });

    it('removes the njn-context attribute', function() {
      expect(clone.hasAttribute('njn-context')).toBe(false);
    });
  });

  describe('when given an element with an njn-context attribute, a viewInterface but no lookupChain', function() {
    var clone = withAttr.cloneNode();

    it('returns undefined', function() {
      expect(clone.hasAttribute('njn-context')).toBe(true);
      var returned = addContextObjectToLookupChain(withVI, clone);
      expect(returned).toBeUndefined();
    });

    it('removes the njn-context attribute', function() {
      expect(clone.hasAttribute('njn-context')).toBe(false);
    });
  });

  describe('when given an element with an njn-context attribute and a lookupChain', function() {
    describe('when the property is found', function() {
      var lookupChain = [1,2];

      it('returns the lookupChain with the context object at the beginning', function() {
        var returned = addContextObjectToLookupChain(withVI, withAttr, lookupChain);
        expect(returned).toEqual([ [ 'a','b' ], 1, 2 ]);
      });

      it('does not affect the lookupChain', function() {
        expect(lookupChain).toEqual([1,2]);
      });

      it('removes the njn-context attribute', function() {
        expect(withAttr.hasAttribute('njn-context')).toBe(false);
      });
    });

    describe('when the property is not found', function() {
      it('returns the unmodified lookupChain', function() {
        var returned = addContextObjectToLookupChain(noVI, withAttr, [1,2]);
        expect(returned).toEqual([1,2]);
      });
    });
  });
});
