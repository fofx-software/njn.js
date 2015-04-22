describe('when you initialize a module', function() {
  describe('if moduleName is not given', function() {
    it('will throw an error', function() {
      var willFail = function() { new FXModule(); }
      expect(willFail).toThrowError(/moduleName/);
    });
  });
});

describe('module.query()', function() {
  describe('if no attributed element is found', function() {
    it('will return null', function() {
      var module = new FXModule('noAttributedElement');
      expect(module.query()).toBeNull();
    });
  });
});
