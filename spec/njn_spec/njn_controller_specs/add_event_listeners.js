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

    describe('when multiple event/handler combinations are given, separated by semicolons', function() {
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

    describe('when an event/handler combination contains multiple event types separated by commas', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-on', 'click,keypress:pushType');
      var viewInterface = { events: [], pushType: function(e) { this.events.push(e.type); } };
      addEventListeners(div, [viewInterface]);

      it('adds the handler to each of the event types', function() {
        div.dispatchEvent(click);
        div.dispatchEvent(keypress);
        expect(viewInterface.events).toEqual(['click', 'keypress']);
      });
    });

    describe('when an event/handler combination contains multiple handler names separated by commas', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-on', 'click:pushType,changeClass');
      var viewInterface = {
        events: [],
        pushType: function(e) { this.events.push(e.type); },
        changeClass: function() { this.currElement.className = 'clicked'; }
      };
      addEventListeners(div, [viewInterface]);

      it('calls each referenced handler when the event is triggered', function() {
        div.dispatchEvent(click);
        expect(viewInterface.events).toEqual(['click']);
        expect(div.className).toBe('clicked');
      });
    });

    describe('when an event/handler combination contains multiple event types and multiple handler names', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-on', 'click,keypress:pushType,changeClass');
      var viewInterface = {
        events: [],
        pushType: function(e) { this.events.push(e.type); },
        changeClass: function(e) { this.currElement.className = (this.currElement.className + ' ' + e.type).trim(); }
      };
      addEventListeners(div, [viewInterface]);

      it('calls each referenced handler when each event is triggered', function() {
        div.dispatchEvent(click);
        div.dispatchEvent(keypress);
        expect(viewInterface.events).toEqual(['click','keypress']);
        expect(div.className).toBe('click keypress');
      });
    });

    describe('any combination of the above', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-on', 'click:pushType; click,keypress:changeClass; mouseover:boolProp,pushType; dblclick,keypress:boolProp,pushType');
      var viewInterface = {
        events: [],
        boolProp: true,
        pushType: function(e) { this.events.push(e.type); },
        changeClass: function(e) { this.currElement.className = (this.currElement.className + ' ' + e.type).trim(); }
      };
      addEventListeners(div, [viewInterface]);

      it('splits them and adds them correctly', function() {
        div.dispatchEvent(click);
        expect(viewInterface.events).toEqual(['click']);
        expect(div.className).toBe('click');
        div.dispatchEvent(keypress);
        expect(div.className).toBe('click keypress');
        expect(viewInterface.boolProp).toBe(false);
        expect(viewInterface.events).toEqual(['click', 'keypress']);
        div.dispatchEvent(new MouseEvent('mouseover'));
        expect(viewInterface.boolProp).toBe(true);
        expect(viewInterface.events).toEqual(['click', 'keypress', 'mouseover']);
        div.dispatchEvent(new MouseEvent('dblclick'));
        expect(viewInterface.boolProp).toBe(false);
        expect(viewInterface.events).toEqual(['click', 'keypress', 'mouseover', 'dblclick']);
      });
    });
  });
});
