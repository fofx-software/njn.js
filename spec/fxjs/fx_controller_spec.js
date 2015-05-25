describe('FXController', function() {

var linkedController, linkedDiv;

beforeAll(function() {
  linkedDiv = document.createElement('div');
  linkedDiv.setAttribute('fx-controller', 'linkedController');
  var innerDiv = document.createElement('div');
  innerDiv.className = 'inner-div';
  linkedDiv.appendChild(innerDiv);
  var innerP = document.createElement('p');
  innerP.textContent = 'inner p';
  innerDiv.appendChild(innerP);
  document.body.appendChild(linkedDiv);
});

describe('fxjs.controller()', function() {
  describe('when only a name is given', function() {
    describe('if a controller has not already been registered with that name', function() {
      var newController;

      it('initializes, registers and returns a new FXController', function() {
        expect(fxjs.registeredControllers.newController).toBeUndefined();
        newController = fxjs.controller('newController');
        expect(fxjs.registeredControllers.newController).toBe(newController);
        expect(newController).toEqual(jasmine.any(fxjs.Controller));
      });

      describe('the new controller', function() {
        describe('its template', function() {
          describe('when a linked element is not found', function() {
            it('is null', function() {
              expect(newController.template).toBeNull();
            });
          });

          describe('when a linked element is found', function() {
            it('is the linked element', function() {
              linkedController = fxjs.controller('linkedController');
              expect(linkedController.template).toBe(linkedDiv);
            });

            it('contains the child elements of the linked element', function() {
              var innerDiv = linkedController.template.querySelector('div.inner-div');
              expect(innerDiv).not.toBeNull();
              var innerP = linkedController.template.querySelector('p');
              expect(innerP.textContent).toBe('inner p');
            });
          });
        });
      });
    });
  });
});

describe('init()', function() {
  var liveElement;

  beforeAll(function() {
    linkedController.init();
    liveElement = document.querySelectorAll('[fx-controller=linkedController]');
  });

  describe('the controller\'s template', function() {
    it('is replaced in the document by a clone', function() {
      // only the clone is in the document:
      expect(liveElement.length).toBe(1);
      // the clone is not the template:
      expect(liveElement[0]).not.toBe(linkedController.template);
      // just to confirm again that the template is not in the document:
      expect(linkedController.template.parentElement).toBeNull();
    });

    describe('its live clone', function() {
      it('contains clones of the template\'s child elements', function() {
        var innerDiv = liveElement[0].querySelector('div.inner-div');
          expect(innerDiv).not.toBeNull();
        var templateInnerDiv = linkedController.template.querySelector('div.inner-div');
          expect(innerDiv).not.toBe(templateInnerDiv);
        var innerP = innerDiv.querySelector('p');
          expect(innerP.textContent).toBe('inner p');
        var templateInnerP = templateInnerDiv.querySelector('p');
          expect(innerP).not.toBe(templateInnerP);
      });
    });
  });

  // more on .init() under processElement
});

describe('.refreshView()', function() {
  var oldLiveElement;

  beforeAll(function() {
    oldLiveElement = document.querySelector('[fx-controller=linkedController]');
    linkedController.refreshView();
  });

  describe('the live element', function() {
    it('is replaced with a new clone of the template', function() {
      var liveElement = document.querySelector('[fx-controller=linkedController]');
      expect(liveElement).not.toBeNull();
      expect(liveElement).not.toBe(oldLiveElement);
    });
  });
});

});
