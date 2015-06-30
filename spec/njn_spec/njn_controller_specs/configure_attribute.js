describe('configureAttribute()', function() {
  var configureAttribute = __njn_controller_utility_functions__.configureAttribute;

  var controller = njn.controller({ myClass: 'mine' });
  var div = document.createElement('div');
  div.setAttribute('njn-class', 'my-class-is-{{myClass}}');

  describe('when given an element with an njn-* attribute', function() {
    it('takes the part of the attribute name following njn- and sets that property to the result of interpolating the given string', function() {
      var configured = configureAttribute(controller, div, 'njn-class');
      expect(div.className).toBe('my-class-is-mine');
    });

    it('removes the original attribute', function() {
      expect(div.hasAttribute('njn-class')).toBe(false);
    });
  });
});
