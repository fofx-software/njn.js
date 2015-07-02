describe('toggleClasses()', function() {
  var toggleClasses = __njn_controller_utility_functions__.toggleClasses;

  describe('when given an element whose njn-toggle-class attribute is empty', function() {
    var div = document.createElement('div');
    div.setAttribute('njn-toggle-class', '');

    it('removes the njn-toggle-class attribute', function() {
      expect(div.hasAttribute('njn-toggle-class')).toBe(true);
      toggleClasses(div, []);
      expect(div.hasAttribute('njn-toggle-class')).toBe(false);
    });

    it('does not affect the div\'s className', function() {
      expect(div.hasAttribute('njn-toggle-class')).toBe(false);
      expect(div.className).toBe('');
    });
  });

  describe('when given an element whose njn-toggle-class attribute is non-empty', function() {
    var div = document.createElement('div');
    div.setAttribute('njn-toggle-class', 'trueProp falseProp noProp arrayProp');
    var viewInterface = { trueProp: true, falseProp: false, arrayProp: [] };

    describe('when the element had no prior className', function() {
      describe('when any of the referenced properties resolve to truthy', function() {
        var clone = div.cloneNode();

        it('sets the element\'s className to all the properties that resolve to truthy', function() {
          toggleClasses(clone, [viewInterface]);
          expect(clone.className).toBe('true-prop array-prop');
        });

        it('removes the njn-toggle-class attribute', function() {
          expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
        });
      });

      describe('when none of the referenced properties resolve to truthy', function() {
        var clone = div.cloneNode();

        it('does not set the element\'s className', function() {
          toggleClasses(clone, [{ trueProp: false }]);
          expect(clone.className).toBe('');
        });

        it('removes the njn-toggle-class attribute', function() {
          expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
        });
      });
    });

    describe('when the element had a prior className', function() {
      describe('when any of the referenced properties resolve to truthy', function() {
        var clone = div.cloneNode();
        clone.className = 'prior-class previous-class';

        it('adds each of the properties that resolve to true to the element\'s className', function() {
          toggleClasses(clone, [viewInterface]);
          expect(clone.className).toBe('prior-class previous-class true-prop array-prop');
        });

        it('removes the njn-toggle-class attribute', function() {
          expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
        });
      });

      describe('when none of the referenced properties resolve to truthy', function() {
        var clone = div.cloneNode();
        clone.className = 'prior-class previous-class';

        it('does not add to the element\'s className', function() {
          toggleClasses(clone, [{ trueProp: false }]);
          expect(clone.className).toBe('prior-class previous-class');
        });

        it('removes the njn-toggle-class attribute', function() {
          expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
        });
      });
    });
  });
});
