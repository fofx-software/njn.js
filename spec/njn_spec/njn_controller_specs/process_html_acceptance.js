describe('processHTML acceptance tests: ', function() {

var liveElement = document.getElementById('acceptance-controller');

describe('attributes on liveElement', function() {
  it('are processed', function() {
    var removeElement = function() { liveElement.parentElement.removeChild(liveElement); }
    expect(removeElement).not.toThrow();
  });
});

describe('text content on liveElement', function() {
  it('is processed', function() {
    expect(liveElement.childNodes[0].textContent.trim()).toBe('first node');
  });
});

describe('njn-context in child element', function() {
  it('prepends the context object to the lookupChain', function() {
    expect(liveElement.children[0].textContent).toBe('my text');
  });

  it('removes the njn-context attribute', function() {
    expect(liveElement.children[0].hasAttribute('njn-context')).toBe(false);
  });

  describe('after the child element', function() {
    it('removes the context object from the lookupChain', function() {
      expect(liveElement.childNodes[2].textContent.trim()).toBe('first node');
    });
  });

  describe('when the context object is an array and njn-sort or njn-filter is used', function() {
    it('prepends the array to the lookupChain, then sorts or filters it', function() {
      expect(liveElement.children[1].textContent.trim()).toBe('1,2,3');
    });
  });
});

describe('njn-foreach on child element', function() {
  describe('if njn-sort is provided', function() {
    it('sorts the foreach array before repeating', function() {
      var repeats = liveElement.getElementsByClassName('repeat1');
      expect(repeats[0].textContent).toBe('1');
      expect(repeats[1].textContent).toBe('2');
      expect(repeats[2].textContent).toBe('3');
    });
  });

  describe('when the njn-foreach element has a child element with njn-foreach', function() {
    var repeats = liveElement.getElementsByClassName('repeat2');
    it('causes viewInterface functions to be called with all array members, the arrays themselves and indices as arguments', function() {
      expect(repeats[0].children[0].id).toBe('00');
      expect(repeats[0].children[1].id).toBe('10');
      expect(repeats[1].children[0].id).toBe('01');
      expect(repeats[1].children[1].id).toBe('11');
    });
  });
});

});
