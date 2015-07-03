describe('repeatElement()', function() {
  var repeatElement = __njn_controller_utility_functions__.repeatElement;

  var parentElement = document.createElement('div');

  var viewInterface = {
    nonList: 'hello',
    list: ['a', 'b', 'c'],
    joinArgs: function() {
      return [].map.call(arguments, function(member) {
        return njn.isArray(member) ? '[' + member.join() + ']' : member;
      }).join();
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

  describe('whenlookupCHain[0] is an array or NJNCollection', function() {
    beforeAll(function() {
      parentElement.appendChild(document.createElement('div'));

      var trueRepeat = parentElement.appendChild(document.createElement('div'));
      trueRepeat.setAttribute('njn-foreach', 'list');
      trueRepeat.setAttribute('njn-class', '{{nonList}}');
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

    it('removes the element\'s njn-foreach attribute before cloning it', function() {
      expect(parentElement.children[1].hasAttribute('njn-foreach')).toBe(false);
      expect(parentElement.children[2].hasAttribute('njn-foreach')).toBe(false);
      expect(parentElement.children[3].hasAttribute('njn-foreach')).toBe(false);
    });

    it('causes viewInterface functions to be called with the current list member, the list itself, and the current list index as arguments', function() {
      expect(parentElement.children[1].childNodes[0].textContent).toBe('a,[a,b,c],0');
      expect(parentElement.children[2].childNodes[0].textContent).toBe('b,[a,b,c],1');
      expect(parentElement.children[3].childNodes[0].textContent).toBe('c,[a,b,c],2');
    });

    describe('when the element has child elements with njn-foreach attribute', function() {
      it('causes viewInterface functions to be called with arguments in the following pattern: inner list member, inner list, outer list member, outer list, inner loop index, outer loop index', function() {
        expect(parentElement.children[1].children[0].textContent).toBe('a,[a,b,c],a,[a,b,c],0,0');
        expect(parentElement.children[1].children[1].textContent).toBe('b,[a,b,c],a,[a,b,c],1,0');
        expect(parentElement.children[1].children[2].textContent).toBe('c,[a,b,c],a,[a,b,c],2,0');
        expect(parentElement.children[2].children[0].textContent).toBe('a,[a,b,c],b,[a,b,c],0,1');
        expect(parentElement.children[2].children[1].textContent).toBe('b,[a,b,c],b,[a,b,c],1,1');
        expect(parentElement.children[2].children[2].textContent).toBe('c,[a,b,c],b,[a,b,c],2,1');
        expect(parentElement.children[3].children[0].textContent).toBe('a,[a,b,c],c,[a,b,c],0,2');
        expect(parentElement.children[3].children[1].textContent).toBe('b,[a,b,c],c,[a,b,c],1,2');
        expect(parentElement.children[3].children[2].textContent).toBe('c,[a,b,c],c,[a,b,c],2,2');
      });
    });
  });
});
