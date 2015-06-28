describe('njn_controller.process_element()', function() {
  var controller = njn.controller({
    
  });

  describe('when given no element or null', function() {
    it('raises an exception', function() {
      expect(function() { controller.processElement(); }).toThrow();
      expect(function() { controller.processElement(null); }).toThrow();
    });
  });
});
