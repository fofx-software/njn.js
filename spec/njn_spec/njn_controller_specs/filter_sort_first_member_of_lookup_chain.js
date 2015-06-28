describe('filterSortFirstMemberOfLookupChain()', function() {
  var filterSortFirstMemberOfLookupChain = __njn_controller_utility_functions__.filterSortFirstMemberOfLookupChain;
  var noFunc = njn.controller();
  var withFunc = njn.controller({ filterFunc: function(m) { return m > 1; }, sortFunc: function(a, b) { return a - b; } });
  var noAttr = document.createElement('div');
  var filterDiv = document.createElement('div');
  filterDiv.setAttribute('njn-filter', 'filterFunc');
  var sortDiv = document.createElement('div');
  sortDiv.setAttribute('njn-sort', 'sortFunc');

  describe('when given no controller', function() {
    it('raises an exception', function() {
      var willThrow = function() { filterSortFirstMemberOfLookupChain(); }
      expect(willThrow).toThrow();
    });
  });

  describe('when given a controller but no other arguments', function() {
    it('raises an exception', function() {
      var willThrow = function() { filterSortFirstMemberOfLookupChain(noFunc); }
      expect(willThrow).toThrow();
    });
  });

  describe('when given a controller and element but no lookupChain', function() {
    it('raises an exception', function() {
      var willThrow = function() { filterSortFirstMemberOfLookupChain(noFunc, noAttr); }
      expect(willThrow).toThrow();
    });
  });

  describe('when given a controller and a lookupChain, but an element that is not an element', function() {
    it('raises an exception', function() {
      var willThrow = function() { filterSortFirstMemberOfLookupChain(noFunc, 'notEl', [1]); }
      expect(willThrow).toThrow();
    });
  });

  describe('when given a controller, an element and a lookupChain', function() {
    describe('if the div has no njn-filter or njn-sort attribute', function() {
      it('returns a copy of the lookupChain', function() {
        var retArr = filterSortFirstMemberOfLookupChain(noFunc, noAttr, [[3,2,1]]);
        expect(retArr).toEqual([[3,2,1]]);
      });

      describe('when the lookupChain is empty', function() {
        it('returns a copy of the lookupChain', function() {
          var retArr = filterSortFirstMemberOfLookupChain(noFunc, noAttr, []);
          expect(retArr).toEqual([]);
        });
      });
    });

    describe('if the div has an njn-filter or njn-sort attribute', function() {
      describe('if the referenced property does not resolve to a function', function() {
        var element = filterDiv.cloneNode();

        it('returns a copy of the lookupChain', function() {
          var retArr = filterSortFirstMemberOfLookupChain(noFunc, element, [[3,2,1]]);
          expect(retArr).toEqual([[3,2,1]]);
        });

        it('removes the njn-filter and njn-sort attributes', function() {
          expect(element.hasAttribute('njn-filter')).toBe(false);
        });
      });

      describe('if the referenced property resolves to a function', function() {
        describe('when the lookupChain is empty', function() {
          var element = filterDiv.cloneNode();

          it('returns a copy of the lookupChain', function() {
            var retArr = filterSortFirstMemberOfLookupChain(withFunc, element, []);
            expect(retArr).toEqual([]);
          });

          it('removes the njn-filter and njn-sort attributes', function() {
            expect(element.hasAttribute('njn-filter')).toBe(false);
          });
        });

        describe('when the lookupChain\'s first member is not an array or NJNCollection', function() {
          var element = filterDiv.cloneNode();

          it('returns a copy of the lookupChain', function() {
            var retArr = filterSortFirstMemberOfLookupChain(withFunc, element, [3,2,1]);
            expect(retArr).toEqual([3,2,1]);
          });

          it('removes the njn-filter and njn-sort attributes', function() {
            expect(element.hasAttribute('njn-filter')).toBe(false);
          });
        });

        var lookupChain = [[3,2,1],2,1];

        describe('when lookupChain[0] is an array and the element has an njn-filter attribute', function() {
          var element = filterDiv.cloneNode();
          var filtered = filterSortFirstMemberOfLookupChain(withFunc, element, lookupChain);

          it('applies the function to lookupChain[0].filter', function() {
            expect(filtered).toEqual([[3,2],2,1]);
          });

          it('does not affect the original lookupChain', function() {
            expect(lookupChain).toEqual([[3,2,1],2,1]);
          });

          it('removes the njn-filter attribute from the element', function() {
            expect(element.hasAttribute('njn-filter')).toBe(false);
          });
        });

        describe('when lookupChain[0] is an array and the element has an njn-sort attribute', function() {
          var element = sortDiv.cloneNode();
          var sorted = filterSortFirstMemberOfLookupChain(withFunc, element, lookupChain);

          it('applies the function to lookupChain[0].sort', function() {
            expect(sorted).toEqual([[1,2,3],2,1]);
          });

          it('does not affect the original lookupChain', function() {
            expect(lookupChain).toEqual([[3,2,1],2,1]);
          });

          it('removes the njn-sort attribute from the element', function() {
            expect(element.hasAttribute('njn-sort')).toBe(false);
          });
        });

        describe('when lookupChain[0] is an array and the element has an njn-sort and njn-filter attribute', function() {
          var element = filterDiv.cloneNode();
          element.setAttribute('njn-sort', 'sortFunc');

          it('filters and then sorts', function() {
            var newArr = filterSortFirstMemberOfLookupChain(withFunc, element, lookupChain);
            expect(newArr).toEqual([[2,3],2,1]);
          });

          it('removes both attributes from the element', function() {
            expect(element.hasAttribute('njn-sort') || element.hasAttribute('njn-filter')).toBe(false);
          });
        });
      });
    });
  });
});
