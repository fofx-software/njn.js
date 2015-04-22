describe('when you initialize a controller', function() {
  describe('if controllerName is not given', function() {
    it('will throw an error', function() {
      var willFail = function() { new FXController(); }
      expect(willFail).toThrowError(/controllerName/);
    });
  });

  describe('if an FXModule is not given', function() {
    it('will throw an error', function() {
      var div = makeDiv('controller', 'exampleController', $('body'));

      var willFail = function() { new FXController('exampleController'); }
      expect(willFail).toThrowError(/FXModule/);

      div.remove();
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

    describe('if an associated element cannot be found', function() {
      it('will throw an error', function() {
        var module = this.module;
        var willFail = function() { new FXController('exampleController', module); }
        expect(willFail).toThrowError(/fx-controller=/);
      });
    });

    describe('if possible element is not child of module element', function() {
      it('will throw an error', function() {
        var controllerDiv = makeDiv('controller', 'notInModule', $('body'));
        var module = this.module;
        var willFail = function() { new FXController('notInModule', module); }

        expect(willFail).toThrowError(/fx-controller=/);

        controllerDiv.remove();
      });
    });

    describe('if an associated element is found', function() {
      beforeEach(function() {
        this.controllerDiv = makeDiv('controller', 'exampleController', this.module.element);
      });

      afterEach(function() {
        this.controllerDiv.remove();
      });

      describe('if more than one associated element is found', function() {
        it('will throw an error', function() {
          var controllerDiv2 = makeDiv('controller', 'exampleController', this.module.element);
          var module = this.module;
          var willFail = function() { new FXController('exampleController', module); }

          expect(willFail).toThrowError(/more than one/);

          controllerDiv2.remove();
        });
      });

      describe('the associated element if it is a child of a child of the module element', function() {
        it('will still still be found', function() {
          var child = $(document.createElement('div')).appendTo(this.module.element);
          var grandchild = makeDiv('controller', 'grandchildController', child);
          var module = this.module;
          var wontFail = function() { new FXController('grandchildController', module); }

          expect(wontFail).not.toThrow();

          child.remove();
          grandchild.remove();
        });
      });

      describe('the associated element', function() {
        it('is a jQuery object', function() {
          var controller = new FXController('exampleController', this.module);
          expect(controller.element instanceof jQuery).toBeTruthy();
        });
      });
    });
  });
});
