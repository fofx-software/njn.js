describe('mapHTML()', function() {
  describe('when the third paramter is not given', function() {
    it('maps the members of a list to the result of processing the given HTML on them', function() {
      var list = [{ name: 'Joe' }, { name: 'Benjamin' }, { name: 'Barbara' }];
      var mapped = njn.controller().mapHTML(list, '<span>{{name}}</span>');
      expect(mapped).toEqual(['<span>Joe</span>', '<span>Benjamin</span>', '<span>Barbara</span>']);
    });
  });

  describe('when the third parameter is given', function() {
    it('maps the html, then joins it with the third parameter and returns', function() {
      var list = [{ name: 'Joe' }, { name: 'Benjamin' }, { name: 'Barbara' }];
      var mapped = njn.controller().mapHTML(list, '<span>{{name}}</span>', '');
      expect(mapped).toEqual('<span>Joe</span><span>Benjamin</span><span>Barbara</span>');
      var mapped = njn.controller().mapHTML(list, '<span>{{name}}</span>', '<br>');
      expect(mapped).toEqual('<span>Joe</span><br><span>Benjamin</span><br><span>Barbara</span>');
    });
  });
});
