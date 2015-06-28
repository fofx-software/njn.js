// also tests refreshView:

describe('njn_controller.loadTemplate()', function() {
  var newController = njn.controller({ className: 'processed' });
  var div = document.createElement('div');
  div.setAttribute('njn-attr-class', '{{className}}');
  div.setAttribute('njn-controller', 'foo');
  div.id = 'template-div';

  describe('when not given an HTML Element', function() {
    beforeAll(function() { newController.loadTemplate(); });

    it('leaves the template undefined', function() {
      expect(newController.template).toBeUndefined();
    });

    it('leaves liveElement undefined', function() {
      expect(newController.liveElement).toBeUndefined();
    });

    it('returns liveElement', function() {
      expect(newController.loadTemplate()).toBeUndefined();
    });
  });

  describe('when given null', function() {
    it('makes the template null', function() {
      newController.loadTemplate(document.getElementById('no-element'));
      expect(newController.template).toBeNull();
    });

    it('leaves liveElement undefined', function() {
      expect(newController.liveElement).toBeUndefined();
    });

    it('returns liveElement', function() {
      expect(newController.loadTemplate()).toBeUndefined();
    });
  });

  describe('when given an element', function() {
    beforeAll(function() { this.retval = newController.loadTemplate(div); });

    it('sets the template to the element', function() {
      expect(newController.template).toBe(div);
    });

    it('sets the controller\'s liveElement to a clone of the element', function() {
      expect(newController.liveElement.tagName).toBe('DIV');
      expect(newController.liveElement).not.toBe(div);
    });

    it('processes the element', function() {
      expect(newController.template.className).toBe('');
      expect(newController.liveElement.className).toBe('processed');
    });

    it('removes the njn-controller attribute from the liveElement', function() {
      expect(newController.template.getAttribute('njn-controller')).toBe('foo');
      expect(newController.liveElement.hasAttribute('njn-controller')).toBe(false);
    });

    it('returns liveElement', function() {
      expect(this.retval).toBe(newController.liveElement);
    });
  });

  describe('when the given element is in the document', function() {
    it('is replaced in the document by the liveElement', function() {
      document.body.appendChild(div);
      newController.loadTemplate(div);
      expect(document.getElementById('template-div')).not.toBeNull();
      expect(document.getElementById('template-div')).not.toBe(div);
    });
  });
});
