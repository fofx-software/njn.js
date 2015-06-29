describe('processHTML()', function() {
  var processHTML = __njn_controller_utility_functions__.processHTML;
  var controller = njn.controller({ textContent: 'hello world' });
  var noAttr = document.createElement('div');
  var textContent = document.createElement('div');
  textContent.textContent = '{{textContent}}';

  describe('when not given any arguments', function() {
    it('raises an exception', function() {
      var willThrow = function() { processHTML(); }
      expect(willThrow).toThrow();
    });
  });

  describe('when given a controller as the only argument', function() {
    it('raises an exception', function() {
      var willThrow = function() { processHTML(controller); }
      expect(willThrow).toThrow();
    });
  });

  describe('when given a controller and an element', function() {
    it('does not raise an exception', function() {
      var wontThrow = function() { processHTML(controller, noAttr); }
      expect(wontThrow).not.toThrow();
    });
  });

  describe('when the element has nothing to process', function() {
    it('returns the element', function() {
      var returned = processHTML(controller, noAttr);
      expect(returned).toBe(noAttr);
    });
  });

  describe('when the element has something to process', function() {
    it('returns the element after processing', function() {
      var clone = textContent.cloneNode(true);
      var returned = processHTML(controller, clone);
      expect(returned).toBe(clone);
      expect(clone.textContent).toBe('hello world');
    });

    describe('when the element has textContent to process', function() {
      it('processes the textContent', function() {
        var clone = textContent.cloneNode(true);
        var returned = processHTML(controller, clone);
        expect(returned).toBe(clone);
        expect(clone.textContent).toBe('hello world');
      });
    });

    describe('when the element has child elements', function() {
      it('processes each of the child elements', function() {
        var div = document.createElement('div');
        var child1 = div.appendChild(textContent.cloneNode(true));
        var child2 = div.appendChild(textContent.cloneNode(true));
        processHTML(controller, div);
        expect(child1.textContent).toBe('hello world');
        expect(child2.textContent).toBe('hello world');
      });
    });

    describe('when the element has text content and child elements to process', function() {
      it('processes the textNodes and childNodes, leaving them in the same order', function() {
        var clone = textContent.cloneNode(true);
        var child1 = clone.appendChild(textContent.cloneNode(true));
        clone.appendChild(document.createTextNode('{{textContent}}'));
        var child2 = clone.appendChild(textContent.cloneNode(true));
        clone.appendChild(document.createTextNode('{{textContent}}'));
        processHTML(controller, clone);

        expect(clone.childNodes[0].textContent).toBe('hello world');
        expect(child1.textContent).toBe('hello world');
        expect(clone.childNodes[2].textContent).toBe('hello world');
        expect(child2.textContent).toBe('hello world');
        expect(clone.childNodes[4].textContent).toBe('hello world');
      });
    });
  });
});
