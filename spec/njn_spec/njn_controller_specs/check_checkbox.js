describe('checkCheckbox()', function() {
  var checkCheckbox = __njn_controller_utility_functions__.checkCheckbox;

  var checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');

  describe('when the njn-checked attribute is empty', function() {
    it('does not check the checkbox', function() {
      var clone = checkbox.cloneNode();
      clone.setAttribute('njn-checked', '');
      checkCheckbox(clone, []);
      expect(clone.checked).toBe(false);
    });

    it('removes the njn-checked attribute', function() {
      var clone = checkbox.cloneNode();
      clone.setAttribute('njn-checked', '');
      expect(clone.hasAttribute('njn-checked')).toBe(true);
      checkCheckbox(clone, []);
      expect(clone.hasAttribute('njn-checked')).toBe(false);
    });
  });

  describe('when the njn-checked attribute is not empty', function() {
    describe('when the referenced property name resolves to truthy', function() {
      var clone = checkbox.cloneNode();
      clone.setAttribute('njn-checked', 'trueProp');

      it('checks the checkbox', function() {
        checkCheckbox(clone, [{ trueProp: true }]);
        expect(clone.checked).toBe(true);
      });
    });

    describe('when the referenced property name resolves to falsey', function() {
      var clone = checkbox.cloneNode();
      clone.setAttribute('checked', '');
      clone.setAttribute('njn-checked', 'falseProp');

      it('unchecks the checkbox', function() {
        expect(clone.checked).toBe(true);
        checkCheckbox(clone, []);
        expect(clone.checked).toBe(false);
      });
    });
  });
});
