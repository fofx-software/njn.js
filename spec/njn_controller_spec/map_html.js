describe('mapHTML()', function() {
  describe('when the third parameter is not given', function() {
    it('maps the members of a list to the result of processing the given HTML on them and joins the results', function() {
      var list = [{ name: 'Joe' }, { name: 'Benjamin' }, { name: 'Barbara' }];
      var controller = njn.controller({ people: njn.Controller.mapHTML(list, '<span>{{name}}</span>') });
      var result = controller.processHTML('{{people}}');
      expect(result).toEqual('<span>Joe</span><span>Benjamin</span><span>Barbara</span>');
    });
  });

  describe('when the third parameter is given', function() {
    it('maps the html, then joins it with the third parameter and returns', function() {
      var list = [{ name: 'Joe' }, { name: 'Benjamin' }, { name: 'Barbara' }];
      var controller = njn.controller({ people: njn.Controller.mapHTML(list, '<span>{{name}}</span>', '<br>') });
      var result = controller.processHTML('{{people}}');
      expect(result).toEqual('<span>Joe</span><br><span>Benjamin</span><br><span>Barbara</span>');
    });
  });
});
