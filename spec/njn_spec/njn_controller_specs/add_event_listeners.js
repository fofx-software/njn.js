describe('addEventListeners()', function() {
  var addEventListeners = __njn_controller_utility_functions__.addEventListeners;
  var click = new MouseEvent('click');
  var keypress = new KeyboardEvent('keypress');

  describe('when the element\'s njn-on attribute is empty', function() {
    var div = document.createElement('div');
    div.setAttribute('njn-on', '');

    it('removes the njn-on attribute', function() {
      addEventListeners(div);
      expect(div.hasAttribute('njn-on')).toBe(false);
    });
  });

  describe('when the element\'s njn-on attribute is not empty', function() {
    describe('when the property reference resolves to a boolean', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-on', 'click:boolProp');
      var obj = { boolProp: true };
      addEventListeners(div, [obj]);

      it('toggles the value of the property in its owner', function() {
        div.dispatchEvent(click);
        expect(obj.boolProp).toBe(false);
        div.dispatchEvent(click);
        expect(obj.boolProp).toBe(true);
      });

      it('removes the njn-on attribute', function() {
        expect(div.hasAttribute('njn-on')).toBe(false);
      });
    });

    describe('when the property reference resolves to a function', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-on', 'click:funcProp');
      var obj = { funcProp: function() { this.newProp = 'new'; } };
      var clone = div.cloneNode();
      addEventListeners(clone, [obj]);

      it('calls the function', function() {
        clone.dispatchEvent(click);
        expect(obj.newProp).toBe('new');
      });

      it('removes the njn-on attribute', function() {
        expect(clone.hasAttribute('njn-on')).toBe(false);
      });

      describe('when the owner of the function is the viewInterface', function() {
        var clone = div.cloneNode();
        var viewInterface = { funcProp: function(e, obj, ind) { this.args = obj + ind + e.type; } };
        addEventListeners(clone, ['a', viewInterface], [0]);

        it('makes the event the first argument to the function', function() {
          clone.dispatchEvent(click);
          expect(viewInterface.args).toBe('a0click');
        });
      });
    });    

    describe('when multiple event and handler combinations are given, separated by semicolons', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-on', 'click: handleClick; keypress: handleKeypress');
      var viewInterface = {
        events: [],
        handleClick: function(e) { this.events.push(e.type); },
        handleKeypress: function(e) { this.events.push(e.type); }
      };
      addEventListeners(div, [viewInterface]);

      it('adds each handler for the respective event', function() {
        div.dispatchEvent(click);
        div.dispatchEvent(keypress);
        expect(viewInterface.events).toEqual(['click', 'keypress']);
      });
    });
  });
});
