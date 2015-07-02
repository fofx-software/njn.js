describe('toggleDisplay()', function() {
  var toggleDisplay = __njn_controller_utility_functions__.toggleDisplay;

  describe('when the element\'s njn-toggle-display attribute is empty', function() {
    var div = document.createElement('div');
    div.setAttribute('njn-toggle-display', '');

    it('hides the element', function() {
      toggleDisplay(div, []);
      expect(div.style.display).toBe('none');
    });

    it('removes the element\'s njn-toggle-display attribute', function() {
      expect(div.hasAttribute('njn-toggle-display')).toBe(false);
    });
  });

  describe('when the element\'s njn-toggle-display atribute is not empty', function() {
    var div = document.createElement('div');
    div.setAttribute('njn-toggle-display', 'falseProp noProp arrayProp');

    describe('when one of the property references resolves to truthy', function() {
      var clone = div.cloneNode();
      clone.style.display = 'none';

      it('displays the element', function() {
        toggleDisplay(clone, [{ arrayProp: [], falseProp: false }]);
        expect(clone.style.display).toBe('');
      });

      it('removes the element\'s njn-toggle-display attribute', function() {
        expect(clone.hasAttribute('njn-toggle-display')).toBe(false);
      });
    });

    describe('when none of the property references resolves to truthy', function() {
      var clone = div.cloneNode();

      it('hides the element', function() {
        toggleDisplay(clone, [{ arrayProp: null }]);
        expect(clone.style.display).toBe('none');
      });

      it('removes the element\'s njn-toggle-display attribute', function() {
        expect(clone.hasAttribute('njn-toggle-display')).toBe(false);
      });
    });

    describe('when a falsey property is negated', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-toggle-display', '!falseProp');
      div.style.display = 'none';

      it('treats it as truthy', function() {
        toggleDisplay(div, [{ falseProp: false }]);
        expect(div.style.display).toBe('');
      });
    });

    describe('when a truthy property is negated', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-toggle-display', '!trueProp');

      it('treats it as falsey', function() {
        toggleDisplay(div, [{ trueProp: true }]);
        expect(div.style.display).toBe('none');
      });
    });
  });
});
