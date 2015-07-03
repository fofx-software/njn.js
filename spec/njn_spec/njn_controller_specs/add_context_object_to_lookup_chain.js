describe('addContextObjectToLookupChain()', function() {
  var viewInterface = { subArr: ['a','b'], subObj: {} };

  var div = document.createElement('div');
  div.setAttribute('njn-context', 'subArr');

  var addContextObjectToLookupChain = __njn_controller_utility_functions__.addContextObjectToLookupChain;

  describe('when given an element without an njn-context attribute', function() {
    it('returns the lookupChain', function() {
      var returned = addContextObjectToLookupChain(document.createElement('div'), [1,2,3]);
      expect(returned).toEqual([1,2,3]);
    });
  });

  describe('when given an element with an njn-context attribute', function() {
    describe('when the njn-context attribute is empty', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-context', '');

      it('returns the unmodified lookupChain', function() {
        var returned = addContextObjectToLookupChain(div, [1,2]);
        expect(returned).toEqual([1,2]);
      });
    });

    describe('when the njn-context attribute is non-empty', function() {
      describe('when the referenced property is found in the lookupChain', function() {
        var lookupChain = [1,2,viewInterface];

        it('returns the lookupChain with the resoved value at the beginning', function() {
          var returned = addContextObjectToLookupChain(div, lookupChain);
          expect(returned).toEqual([['a','b'],1,2,viewInterface]);
        });

        it('does not affect the lookupChain', function() {
          expect(lookupChain).toEqual([1,2,viewInterface]);
        });

        it('removes the njn-context attribute', function() {
          expect(div.hasAttribute('njn-context')).toBe(false);
        });
      });

      describe('when the referenced property is not found', function() {
        it('returns the unmodified lookupChain', function() {
          var returned = addContextObjectToLookupChain(div, [1,2]);
          expect(returned).toEqual([1,2]);
        });
      });
    });
  });

  describe('when the element has njn-foreach instead of njn-context', function() {
    var lookupChain = [1,2,viewInterface];
    var div = document.createElement('div');
    div.setAttribute('njn-foreach', 'subArr');

    it('treats the njn-foreach attribute as the njn-context attribute', function() {
      var returned = addContextObjectToLookupChain(div, lookupChain);
      expect(returned).toEqual([['a','b']].concat(lookupChain));
    });

    it('does not remove the njn-foreach attribute', function() {
      expect(div.hasAttribute('njn-foreach')).toBe(true);
    });
  });

  describe('when the element has njn-foreach and njn-context', function() {
    var lookupChain = [1,2,viewInterface];
    var div = document.createElement('div');
    div.setAttribute('njn-foreach', 'subArr');
    div.setAttribute('njn-context', 'subObj');

    it('uses the njn-context attribute', function() {
      var returned = addContextObjectToLookupChain(div, lookupChain);
      expect(returned).toEqual([{}].concat(lookupChain));
    });
  });
});
