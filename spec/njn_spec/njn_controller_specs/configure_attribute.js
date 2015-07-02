describe('configureAttribute()', function() {
  var configureAttribute = __njn_controller_utility_functions__.configureAttribute;

  describe('when given an element with an njn-* attribute', function() {
    describe('when the njn-* attribute is non-empty', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-class', 'my-class-is-{{myClass}}');

      it('takes the part of the attribute name following njn- and sets that property to the result of interpolating the given string', function() {
        configureAttribute(div, 'njn-class', [{ myClass: 'mine' }]);
        expect(div.className).toBe('my-class-is-mine');
      });

      it('removes the original attribute', function() {
        expect(div.hasAttribute('njn-class')).toBe(false);
      });
    });

    describe('when the njn-* attribute is empty', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-name', '');

      it('sets the new attribute to an empty string', function() {
        configureAttribute(div, 'njn-name');
        expect(div.getAttribute('name')).toBe('');
      });
    });
  });
});
