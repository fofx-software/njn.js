describe('repeatElement()', function() {
  var repeatElement = __njn_controller_utility_functions__.repeatElement;

  var parentElement = document.createElement('div');

  var viewInterface = {
    nonList: 'hello',
    list: ['a', 'b', 'c'],
    joinArgs: function() {
      return [].map.call(arguments, function(member) {
        return njn.isArray(member) ? '[' + member.join('') + ']' : member;
      }).join('');
    },
    getOffsetTop: function() {
      return this.currElement.offsetTop;
    }
  };

  describe('when given an element without a parent element', function() {
    it('raises an exception', function() {
      var willThrow = function() { repeatElement(parentElement, [viewInterface]); }
      expect(willThrow).toThrowError('elementParent is null');
    });
  });

  describe('when lookupChain[0] is not an array or NJNCollection', function() {
    var falseRepeat = parentElement.appendChild(document.createElement('div'));
    falseRepeat.setAttribute('njn-foreach', 'nonList');

    it('raises an exception', function() {
      var willThrow = function() { repeatElement(falseRepeat, [viewInterface]); }
      expect(willThrow).toThrowError(/\.forEach is not a function/);
    });
  });

  describe('whenlookupChain[0] is an array or NJNCollection', function() {
    beforeAll(function() {
      // append first so offsetTop is calculated as children are repeated:
      document.body.appendChild(parentElement);

      parentElement.appendChild(document.createElement('div'));

      var trueRepeat = parentElement.appendChild(document.createElement('div'));
      trueRepeat.setAttribute('njn-foreach', 'list');
      trueRepeat.setAttribute('njn-class', '{{nonList}}');
      trueRepeat.setAttribute('njn-data-offset', '{{getOffsetTop}}');
      trueRepeat.textContent = '{{joinArgs}}';

      var innerRepeat = trueRepeat.appendChild(trueRepeat.cloneNode(true));

      var afterRepeat = parentElement.appendChild(document.createElement('div'));

      repeatElement(trueRepeat, [viewInterface.list, viewInterface], []);
    });

    it('removes the element, clones it, processes the clone for each member of the list, and appends it to the parent element where the original element was', function() {
      expect(parentElement.children.length).toBe(5);
      expect(parentElement.children[0].className).toBe('');
      expect(parentElement.children[1].className).toBe('hello');
      expect(parentElement.children[2].className).toBe('hello');
      expect(parentElement.children[3].className).toBe('hello');
      expect(parentElement.children[4].className).toBe('');
    });

    it('inserts the element before processing it so properties like offsetTop are already calculated', function() {
      var getOffset = function(ind) { return parseInt(parentElement.children[ind].dataset.offset); }
      expect(getOffset(1)).toBeGreaterThan(0);
      expect(getOffset(2)).toBeGreaterThan(getOffset(1));
      expect(getOffset(3)).toBeGreaterThan(getOffset(2));
    });

    it('removes the element\'s njn-foreach attribute before cloning it', function() {
      expect(parentElement.children[1].hasAttribute('njn-foreach')).toBe(false);
      expect(parentElement.children[2].hasAttribute('njn-foreach')).toBe(false);
      expect(parentElement.children[3].hasAttribute('njn-foreach')).toBe(false);
    });

    it('causes viewInterface functions to be called with the current list member, the list itself, and the current list index as arguments', function() {
      expect(parentElement.children[1].childNodes[0].textContent).toBe('[aa,b,c][0]');
      expect(parentElement.children[2].childNodes[0].textContent).toBe('[ba,b,c][1]');
      expect(parentElement.children[3].childNodes[0].textContent).toBe('[ca,b,c][2]');
    });

    describe('when the element has child elements with njn-foreach attribute', function() {
      it('causes viewInterface functions to be called with arguments in the following pattern: inner list member, inner list, outer list member, outer list, inner loop index, outer loop index', function() {
        expect(parentElement.children[1].children[0].textContent).toBe('[aa,b,caa,b,c][00]');
        expect(parentElement.children[1].children[1].textContent).toBe('[ba,b,caa,b,c][10]');
        expect(parentElement.children[1].children[2].textContent).toBe('[ca,b,caa,b,c][20]');
        expect(parentElement.children[2].children[0].textContent).toBe('[aa,b,cba,b,c][01]');
        expect(parentElement.children[2].children[1].textContent).toBe('[ba,b,cba,b,c][11]');
        expect(parentElement.children[2].children[2].textContent).toBe('[ca,b,cba,b,c][21]');
        expect(parentElement.children[3].children[0].textContent).toBe('[aa,b,cca,b,c][02]');
        expect(parentElement.children[3].children[1].textContent).toBe('[ba,b,cca,b,c][12]');
        expect(parentElement.children[3].children[2].textContent).toBe('[ca,b,cca,b,c][22]');
      });
    });
  });
});
