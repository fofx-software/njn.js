describe('processTextContent()', function() {
  var processTextNode = __njn_controller_utility_functions__.processTextNode;
  var parentElement = document.createElement('div');

  describe('when given a textNode with no double brackets', function() {
    it('replaces the node with a new node with the original node\'s processed text', function() {
      var node = parentElement.appendChild(document.createTextNode('hello {{name}}'));
      processTextNode(node, [{ name: 'Joe' }]);
      expect(parentElement.childNodes[0].textContent).toBe('hello Joe');
    });
  });

  describe('when given a textNode with double brackets, and the property reference does not resolve to an HTMLElement', function() {
    it('raises an exception', function() {
      var node = parentElement.appendChild(document.createTextNode('[[nonEl]]'));
      var willThrow = function() { processTextNode(node, [{ nonEl: {} }], []); }
      expect(willThrow).toThrowError('element.getAttribute is not a function');
    });
  });

  describe('when given a textNode with only double brackets', function() {
    it('inserts the result of resolving the property name in the double brackets to the parent element', function() {
      var node = parentElement.appendChild(document.createTextNode('[[getDiv]]'));
      processTextNode(node, [{ getDiv: document.createElement('div') }], []);
      expect(parentElement.childNodes.length).toBe(2);
      expect(parentElement.childNodes[1].tagName).toBe('DIV');
    });
  });

  describe('when given a textNode with text and double brackets', function() {
    it('processes the text parts, inserts elements at the double brackets, all in order', function() {
      var node = parentElement.appendChild(document.createTextNode('my name is {{name}} and [[bold]] is my game'));
      processTextNode(node, [{
        name: 'Joe',
        bold: (function(b) { b.textContent = 'programming'; return b; })(document.createElement('b'))
      }], []);
      expect(parentElement.childNodes.length).toBe(5);
      expect(parentElement.childNodes[2].textContent).toBe('my name is Joe and ');
      expect(parentElement.childNodes[3].textContent).toBe('programming');
      expect(parentElement.childNodes[3].tagName).toBe('B');
      expect(parentElement.childNodes[4].textContent).toBe(' is my game');
    });
  });

  describe('the inserted HTMLElement', function() {
    it('is processed with the current lookupChain and indices array', function() {
      var node = parentElement.appendChild(document.createTextNode('[[processThis]]'));
      processTextNode(node, [{
        processThis: (function(p) {
          p.setAttribute('njn-class', '{{getClass}}'); return p;
        })(document.createElement('p')),
        getClass: 'new-class'
      }], []);
      expect(parentElement.childNodes[5].className).toBe('new-class');
    });
  });
});
