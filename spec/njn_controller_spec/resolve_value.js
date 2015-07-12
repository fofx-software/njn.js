describe('resolveValue()', function() {
  var resolveValue = __njn_controller_utilities__.resolveValue;

  describe('when given an array with two members', function() {
    describe('when the first member has the property', function() {
      it('returns the value of the property in the first member', function() {
        var value = resolveValue('property', [{ property: 1 }, { property: 2 }]);
        expect(value).toBe(1);
      });
    });

    describe('when the second member has the property and the first member doesn\'t', function() {
      it('returns the value of the property in the second member', function() {
        var value = resolveValue('property', [{ }, { property: 2 }]);
        expect(value).toBe(2);
      });
    });
  });

  describe('when given a property reference with dots', function() {
    it('splits the reference and calls itself recursively', function() {
      var object = { subobject: { subobject: { a: 1 } } };
      var value = resolveValue('subobject.subobject.a', [object]);
      expect(value).toBe(1);
    });
  });
});
