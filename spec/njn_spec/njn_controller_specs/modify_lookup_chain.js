describe('modifyLookupChain()', function() {
  var modifyLookupChain = __njn_controller_utility_functions__.modifyLookupChain;

  describe('when given an element with no njn-context, njn-filter or njn-sort attribute', function() {
    it('returns a copy of the given lookupChain', function() {
      var lookupChain = [1,2,3];
      var retArr = modifyLookupChain(document.createElement('div'), lookupChain);
      expect(retArr).toEqual(lookupChain);
      expect(retArr).not.toBe(lookupChain);
    });
  });

  describe('when given an element with an njn-context and an njn-filter and/or njn-sort attribute', function() {
    var div = document.createElement('div');
    div.setAttribute('njn-context', 'newObj');
    div.setAttribute('njn-filter', 'filterFunc');
    var viewInterface = { newObj: [1,2,3], filterFunc: function(m) { return m > 1; } };
    var lookupChain = [[-1,0,1],viewInterface];

    it('adds the resolved object to the beginning of the lookupChain before filtering', function() {
      var retArr = modifyLookupChain(div, lookupChain);
      expect(retArr).toEqual([[2,3],[-1,0,1],viewInterface]);
    });

    it('does not modify the lookupChain', function() {
      expect(lookupChain).toEqual([[-1,0,1],viewInterface]);
    });

    it('removes the element\'s njn-context, njn-filter and/or njn-sort attribute(s)', function() {
      expect(div.hasAttribute('njn-context')).toBe(false);
      expect(div.hasAttribute('njn-filter')).toBe(false);
    });
  });
});
