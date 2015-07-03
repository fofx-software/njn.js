describe('processTextNode()', function() {
  var processTextNode = __njn_controller_utility_functions__.processTextNode;
  var parentElement = document.createElement('div');

  describe('when no interpolator resolves to an HTMLElement', function() {
    it('replaces the textNode with a single textNode with the original textNode\'s processed text', function() {
      var node = parentElement.appendChild(document.createTextNode('hello {{name}}'));
      processTextNode(node, [{ name: 'Joe' }]);
      expect(parentElement.childNodes.length).toBe(1);
      expect(parentElement.childNodes[0].textContent).toBe('hello Joe');
    });
  });

  describe('when the textNode consists only of an interpolator that resolves to an HTMLElement', function() {
    it('replaces the textNode with the HTMLElement', function() {
      var node = parentElement.appendChild(document.createTextNode('{{getDiv}}'));
      processTextNode(node, [{ getDiv: document.createElement('div') }], []);
      expect(parentElement.childNodes.length).toBe(2);
      expect(parentElement.childNodes[1].tagName).toBe('DIV');
    });
  });

  describe('when the textNode consists of interpolator(s) that resolve(s) to HTMLElement(s) as well as other text', function() {
    it('inserts each text segment as a textNode and the resolved HTMLElement(s) in the appropriate order', function() {
      var node = parentElement.appendChild(document.createTextNode('my name is {{name}} and {{bold}} is my game'));
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
      var node = parentElement.appendChild(document.createTextNode('{{processThis}}'));
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
