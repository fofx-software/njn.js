describe('njn.controller()', function() {
  describe('when given no arguments', function() {
    var newController = njn.controller();

    it('returns a new NJNController', function() {
      expect(newController).toEqual(jasmine.any(njn.Controller));
    });

    it('does not set the new controller\'s name, template or watching', function() {
      expect(newController.name).toBeUndefined();
      expect(newController.watching).toBeUndefined();
      expect(newController.template).toBeUndefined();
    });

    it('sets the controller\'s viewInterface to an empty object', function() {
      expect(newController.viewInterface).toEqual({});
    });
  });

  describe('when given a string argument', function() {
    var newController = njn.controller('new-controller');

    it('makes the string the name of the controller', function() {
      expect(newController.name).toBe('new-controller');
    });

    it('registers the controller in njn.registeredControllers', function() {
      expect(njn.registeredControllers.newController).toBe(newController);
    });

    it('sets the controller\'s viewInterface to an empty object', function() {
      expect(newController.viewInterface).toEqual({});
    });

    it('does not set the new controller\'s watching', function() {
      expect(newController.watching).toBeUndefined();
    });

    it('gives the new controller a null template', function() {
      expect(newController.template).toBeNull();
    });
  });

  describe('when given an object argument', function() {
    var newController = njn.controller({ a: 1 });

    it('makes the object the controller\'s viewInterface', function() {
      expect(newController.viewInterface).toEqual({ a: 1 });
    });

    it('does not set the controller\'s name, template or watching', function() {
      expect(newController.name).toBeUndefined();
      expect(newController.watching).toBeUndefined();
      expect(newController.template).toBeUndefined();
    });
  });

  describe('when given a string argument and an object argument', function() {
    var newController = njn.controller('string-and-object', { a: 1 });

    it('makes the string the name of the controller and the object its viewInterface', function() {
      expect(newController.name).toBe('string-and-object');
      expect(newController.viewInterface).toEqual({ a: 1 });
    });

    it('does not set the controller\'s watching', function() {
      expect(newController.watching).toBeUndefined();
    });

    it('gives the new controller a template', function() {
      expect(newController.template).toBeNull();
    });
  });

  describe('when given a third argument', function() {
    var newController = njn.controller('with-watching', { a: 1 }, [1,2,3]);

    it('sets the controller\'s \'watching\' property to the third argument', function() {
      expect(newController.watching).toEqual([1,2,3]);
    });
  });
});
