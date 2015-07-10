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

  describe('when the textNode has an interpolator that returns text with an interpolator', function() {
    it('processes the returned text', function() {
      var node = parentElement.appendChild(document.createTextNode('{{getText}}'));
      var viewInterface = { getText: '{{newText}}', newText: 'hello' };
      processTextNode(node, [viewInterface], []);
      expect(parentElement.childNodes[2].textContent).toBe('hello');
    });
  });

  describe('when the textNode consists of interpolator(s) that resolve(s) to HTMLElement(s) as well as other text', function() {
    it('inserts each text segment as a textNode and the resolved HTMLElement(s) in the appropriate order', function() {
      var node = parentElement.appendChild(document.createTextNode('my name is {{name}} and {{bold}} is my game'));
      processTextNode(node, [{
        name: 'Joe',
        bold: (function(b) { b.textContent = 'programming'; return b; })(document.createElement('b'))
      }], []);
      expect(parentElement.childNodes.length).toBe(6);
      expect(parentElement.childNodes[3].textContent).toBe('my name is Joe and ');
      expect(parentElement.childNodes[4].textContent).toBe('programming');
      expect(parentElement.childNodes[4].tagName).toBe('B');
      expect(parentElement.childNodes[5].textContent).toBe(' is my game');
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
      expect(parentElement.childNodes[6].className).toBe('new-class');
    });
  });

  describe('when the textNode contains an interpolator that resolves to a string of html', function() {
    it('parses the html and inserts it', function() {
      var node = parentElement.appendChild(document.createTextNode('bold text: {{getBold}} is bold'));
      processTextNode(node, [{ getBold: '<b>this</b>' }], []);
      expect(parentElement.childNodes[7].textContent).toBe('bold text: ');
      expect(parentElement.childNodes[8].tagName).toBe('B');
      expect(parentElement.childNodes[8].textContent).toBe('this');
      expect(parentElement.childNodes[9].textContent).toBe(' is bold');
    });
  });

  describe('when the textNode contains escaped html or double braces', function() {
    it('does not parse them, but unescapes them before rendering', function() {
      var node = parentElement.appendChild(document.createTextNode('[[<div>{{interpolator}}</div>]]'));
      processTextNode(node, [], []);
      expect(parentElement.childNodes[10].textContent).toBe('<div>{{interpolator}}</div>');
    });
  });

  describe('when the textNode contains an interpolator that resolves to escaped html or double braces', function() {
    it('does not parse them, but unescapes them before rendering', function() {
      var node = parentElement.appendChild(document.createTextNode('insert {{html}} here'));
      processTextNode(node, [{ html: '[[<div>{{htmo}}</div>]]' }], []);
      expect(parentElement.childNodes[11].textContent).toBe('insert <div>{{htmo}}</div> here');
    });
  });

  describe('when the textNode contains escaped html within inline html', function() {
    it('does not parse the escaped html', function() {
      var node = parentElement.appendChild(document.createTextNode('<div>[[{{noProcess}}]]</div>'));
      processTextNode(node, [], []);
      expect(parentElement.childNodes[12].textContent).toBe('{{noProcess}}');
    });
  });
});
