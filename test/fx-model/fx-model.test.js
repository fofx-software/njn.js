describe('when you initialize an FXModel', function() {
  describe('if a modelName is not given', function() {
    it('will throw an error', function() {
      var willFail = function() { new FXModel(); }
      expect(willFail).toThrowError(/modelName/);
    });
  });

  describe('if an FXModule is not given', function() {
    it('will throw an error', function() {
      var willFail = function() { new FXModel('exampleModel'); }
      expect(willFail).toThrowError(/FXModel/);
    });
  });

  describe('if an FXModule is given', function() {
    beforeEach(function() {
      this.moduleDiv = makeDiv('module', 'exampleModule', $('body'));
      this.module = new FXModule('exampleModule');
    });

    afterEach(function() {
      this.moduleDiv.remove();
    });

    describe('if an associated element is not found', function() {
      it('will not throw an error', function() {
        var model = new FXModel('exampleModel', this.module);
        expect(model.element.length).toEqual(0);
      });
    });

    describe('if an associated element is found', function() {
      beforeEach(function() {
        this.modelDiv = makeDiv('model', 'exampleModel', this.moduleDiv);
        this.model = new FXModel('exampleModel', this.module);
      });

      afterEach(function() {
        this.modelDiv.remove();
      });

      describe('if more than one associated element is found', function() {
        it('won\'t throw an error', function() {
          var modelDiv2 = makeDiv('model', 'exampleModel', this.moduleDiv);
          var model = new FXModel('exampleModel', this.module);

          expect(model.element.length).toEqual(2);

          modelDiv2.remove();
        });
      });

      describe('the associated element', function() {
        it('is a jQuery object', function() {
          expect(this.model.element instanceof jQuery).toEqual(true);
        });
      });
    });
  });
});
