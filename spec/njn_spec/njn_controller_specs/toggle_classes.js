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
    describe('when the njn-toggle-class attribute contains one property reference', function() {
      describe('when the referenced property resolves to true', function() {
        var div = document.createElement('div');
        div.setAttribute('njn-toggle-class', 'trueProp');
        var viewInterface = { trueProp: true };

        describe('when the element had no prior className', function() {
          var clone = div.cloneNode();

          it('sets the element\'s className to the referenced property name (hyphenized instead of camelCase)', function() {
            toggleClasses(clone, [viewInterface]);
            expect(clone.className).toBe('true-prop');
          });

          it('removes the njn-toggle-class attribute', function() {
            expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
          });
        });

        describe('when the element had a prior className', function() {
          var clone = div.cloneNode();

          it('adds the referenced property name (hyphenized) to the element\'s className', function() {
            clone.className = 'prior-class';
            toggleClasses(clone, [viewInterface]);
            expect(clone.className).toBe('prior-class true-prop');
          });

          it('removes the njn-toggle-class attribute', function() {
            expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
          });
        });
      });

      describe('when the referenced property resolves to falsey', function() {
        var div = document.createElement('div');
        div.setAttribute('njn-toggle-class', 'nonProp');

        describe('when the element had no prior className', function() {
          var clone = div.cloneNode();

          it('does not give the element a className', function() {
            toggleClasses(clone, []);
            expect(clone.className).toBe('');
          });

          it('removes the njn-toggle-class attribute', function() {
            expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
          });
        });

        describe('when the element had a prior className', function() {
          var clone = div.cloneNode();

          it('does not add the property name to the element\'s className', function() {
            clone.className = 'prior-class';
            toggleClasses(clone, []);
            expect(clone.className).toBe('prior-class');
          });

          it('removes the njn-toggle-class attribute', function() {
            expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
          });
        });
      });
    });

    describe('when the njn-toggle-class attribute contains multiple property references', function() {
      var div = document.createElement('div');
      div.setAttribute('njn-toggle-class', 'trueProp falseProp noProp arrayProp');
      var viewInterface = { trueProp: true, falseProp: false, arrayProp: [] };

      describe('when the element had no prior className', function() {
        var clone = div.cloneNode();

        it('sets the element\'s className to all the properties that resolve to true', function() {
          toggleClasses(clone, [viewInterface]);
          expect(clone.className).toBe('true-prop array-prop');
        });

        it('removes the njn-toggle-class attribute', function() {
          expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
        });
      });

      describe('when the element had a prior className', function() {
        var clone = div.cloneNode();

        it('adds each of the properties that resolve to true to the element\'s className', function() {
          clone.className = 'prior-class previous-class';
          toggleClasses(clone, [viewInterface]);
          expect(clone.className).toBe('prior-class previous-class true-prop array-prop');
        });

        it('removes the njn-toggle-class attribute', function() {
          expect(clone.hasAttribute('njn-toggle-class')).toBe(false);
        });
      });
    });
  });
});
