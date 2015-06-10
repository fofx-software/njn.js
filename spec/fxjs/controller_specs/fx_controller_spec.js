describe('processText', function() {
  var processText = document.getElementById('process-text');
  var ps = processText.getElementsByTagName('p');

  describe('own text processing', function() {
    it('works along with child elements', function() {
      var childNodes = processText.childNodes;
      expect(childNodes[0].textContent.trim()).toBe('start text');
      expect(childNodes[12].textContent.trim()).toBe('inner text');
      expect(childNodes[22].textContent.trim()).toBe('end text');
    });
  });

  describe('its first p\'s textContent', function() {
    it('is "this is the text"', function() {
      expect(ps[0].textContent.trim()).toBe('this is the text');
    });
  });

  describe('its second p\'s textContent', function() {
    it('is "this is the text from a function"', function() {
      expect(ps[1].textContent.trim()).toBe('this is the text from a function');
    });
  });

  describe('its third p\'s textContent', function() {
    it('is "undefined"', function() {
      expect(ps[2].textContent.trim()).toBe('undefined');
    });
  });

  describe('its fourth p\'s textContent', function() {
    it('is "this text is in the middle of other text"', function() {
      expect(ps[3].textContent.trim()).toBe('this text is in the middle of other text');
    });
  });

  describe('its fifth p\'s textContent', function() {
    it('has two interpolations', function() {
      expect(ps[4].textContent.trim()).toBe('this text has multiple processed segments');
    });
  });

  describe('its sixth p\'s textContent', function() {
    it('is "curr-element"', function() {
      expect(ps[5].textContent.trim()).toBe('curr-element');
    });
  });

  describe('its seventh p\'s textContent', function() {
    it('comes from a property ending in a quetion mark', function() {
      expect(ps[6].textContent.trim()).toBe('true');
    });
  });

  describe('its eighth p\'s textContent', function() {
    it('has a bang which negates the property\'s value', function() {
      expect(ps[7].textContent.trim()).toBe('true');
    });
  });

  describe('its ninth p\'s grandchild\'s textContent', function() {
    it('is processed correctly', function() {
      var grandchild = ps[8].children[0].children[0];
      expect(grandchild.textContent.trim()).toBe('hi, grandpa!');
    });
  });

  describe('interpolators with whitespace', function() {
    it('won\'t be processed', function() {
      expect(ps[9].textContent.trim()).toBe('{{ withLeadingSpace}}');
      expect(ps[10].textContent.trim()).toBe('{{withTrailingSpace }}');
    });
  });

  afterAll(function() { document.body.removeChild(processText); });
});

describe('configureAttribute', function() {
  var configureAttribute = document.getElementById('configure-attribute');
  var children = configureAttribute.children;

  describe('on the toplevel attributes', function() {
    it('processes the className', function() {
      expect(configureAttribute.getAttribute('name')).toBe('result of configure-attribute');
    });

    it('removes the fx-attr attribute', function() {
      expect(configureAttribute.hasAttribute('fx-attr-name')).toBe(false);
    });
  });

  describe('arguments to functions', function() {
    it('there are none', function() {
      expect(children[0].className).toBe('undefined');
    });
  });

  describe('currElement', function() {
    it('is the element being processed', function() {
      expect(children[1].style.display).toBe('none');
    });
  });

  describe('when there is an existing attribute', function() {
    describe('when it is given in the element before the fx-attr', function() {
      it('is overridden by the new attribute', function() {
        expect(children[2].className).toBe('new-class');
      });
    });

    describe('when it is given in the element after the fx-attr', function() {
      it('is overridden by the new attribute', function() {
        expect(children[3].className).toBe('new-class');
      });
    });
  });

  describe('when multiple properties are given', function() {
    it('processes each one', function() {
      expect(children[4].className).toBe('first-class second-class third-class');
    });
  });

  describe('combining processText and configureAttribute', function() {
    it('processes each', function() {
      var childNodes = children[5].childNodes;
      expect(childNodes[0].textContent).toBe('first text');
      expect(childNodes[1].getAttribute('name')).toBe('in the middle');
      expect(childNodes[1].textContent).toBe('in the middle');
      expect(childNodes[2].textContent).toBe('end text');
    });
  });

  afterAll(function() { document.body.removeChild(configureAttribute); });
});

describe('toggleClasses', function() {
  var toggleClasses = document.getElementById('toggle-classes');
  var ul = toggleClasses.getElementsByTagName('ul')[0];
  var lis = ul.getElementsByTagName('li');

  describe('on the top-level element', function() {
    it('sets the className', function() {
      expect(toggleClasses.className).toBe('trueClass');
    });

    it('removes the fx-toggle-class attribute', function() {
      expect(toggleClasses.hasAttribute('fx-toggle-class')).toBe(false);
    });
  });

  describe('when the referenced property resolves to true', function() {
    it('adds the referenced property name as a class', function() {
      expect(ul.className).toBe('trueClass');
    });

    it('removes the fx-toggle-class attribute', function() {
      expect(ul.hasAttribute('fx-toggle-class')).toBe(false);
    });
  });

  describe('when the referenced property resolves to truthy', function() {
    it('adds the referenced property name as a class', function() {
      expect(lis[13].className).toBe('getObject');
    });
  });

  describe('when the referenced property resolves to false', function() {
    it('does not add the referenced property name as a class', function() {
      expect(lis[0].className).toBe('');
    });

    it('still removes the fx-toggle-class attribute', function() {
      expect(lis[0].hasAttribute('fx-toggle-class')).toBe(false);
    });
  });

  describe('when the referenced property is undefined', function() {
    it('does not add the referenced property name as a class', function() {
      expect(lis[1].className).toBe('');
    });

    it('still removes the fx-toggle-class attribute', function() {
      expect(lis[1].hasAttribute('fx-toggle-class')).toBe(false);
    });
  });

  describe('when the referenced property is a function', function() {
    it('is called without any arguments', function() {
      expect(lis[2].className).toBe('');
    });

    it('is on called on viewInterface', function() {
      expect(lis[3].className).toBe('getTrue');
    });

    it('is called while currElem is set to the element being processed', function() {
      expect(lis[4].className).toBe('useCurrElem');
    });
  });

  describe('when the element already has a className', function() {
    describe('when the className is given in the element before the fx-toggle-class', function() {
      it('adds the new class(es) to the existing one(s)', function() {
        expect(lis[5].className).toBe('prior-class trueClass');
      });
    });

    describe('when the className is given in the element after the fx-toggle-class', function() {
      it('adds the new class(es) to the existing one(s)', function() {
        expect(lis[6].className).toBe('prior-class trueClass');
      });
    });

    describe('when the referenced property resolves to false', function() {
      it('does not add the new class(es)', function() {
        expect(lis[7].className).toBe('prior-class');
      });
    });
  });

  describe('when more than one toggle-class is given', function() {
    describe('when they are all true', function() {
      it('adds them all', function() {
        expect(lis[8].className).toBe('trueClass getTrue');
      });

      describe('when there was a prior className', function() {
        it('adds them all', function() {
          expect(lis[9].className).toBe('prior-class trueClass getTrue');
        });
      });
    });

    describe('when some are true and some are false', function() {
      it('adds the ones that are true', function() {
        expect(lis[10].className).toBe('trueClass getTrue');
      });

      describe('when there was a prior className', function() {
        it('adds the ones that are true', function() {
          expect(lis[11].className).toBe('prior-class trueClass getTrue');
        });
      });
    });

    describe('when all are false', function() {
      it('adds none', function() {
        expect(lis[12].className).toBe('prior-class');
      });
    });
  });

  describe('using fx-attr, fx-toggle-class and processText', function() {
    it('runs each operation correctly', function() {
      expect(lis[14].getAttribute('name')).toBe('my name is bob');
      expect(lis[14].className).toBe('trueClass');
      expect(lis[14].textContent.trim()).toBe('hi!');
    });
  });

  afterAll(function() { document.body.removeChild(toggleClasses); });
});

describe('toggleDisplay', function() {
  var toggleDisplay = document.getElementById('toggle-display');
  var divs = toggleDisplay.getElementsByTagName('div');

  describe('when the referenced property resolves to true', function() {
    it('shows the element', function() {
      expect(divs[0].style.display).toBe('');
    });

    it('removes the fx-toggle-display attribute', function() {
      expect(divs[0].hasAttribute('fx-toggle-display')).toBe(false);
    });
  });

  describe('when the referenced property resolves truthy', function() {
    it('shows the element', function() {
      expect(divs[1].style.display).toBe('');
    });

    it('removes the fx-toggle-display attribute', function() {
      expect(divs[1].hasAttribute('fx-toggle-display')).toBe(false);
    });
  });

  describe('when the referenced property resolves to false', function() {
    it('hides the element', function() {
      expect(divs[2].style.display).toBe('none');
    });

    it('removes the fx-toggle-display attribute', function() {
      expect(divs[2].hasAttribute('fx-toggle-display')).toBe(false);
    });
  });

  describe('when the referenced property resolves to falsey', function() {
    it('hides the element', function() {
      expect(divs[3].style.display).toBe('none');
    });

    it('removes the fx-toggle-display attribute', function() {
      expect(divs[3].hasAttribute('fx-toggle-display')).toBe(false);
    });
  });

  describe('when the referenced property is a function', function() {
    it('calls the method on viewInterface', function() {
      expect(divs[4].style.display).toBe('none');
    });

    it('calls the method without arguments', function() {
      expect(divs[5].style.display).toBe('none');
    });

    it('sets currElement to the element being processed', function() {
      expect(divs[6].style.display).toBe('none');
    });
  });

  describe('when the referenced property is not found', function() {
    it('hides the element', function() {
      expect(divs[7].style.display).toBe('none');
    });
  });

  describe('when the referenced property is negated', function() {
    it('uses the negation of the property', function() {
      expect(divs[8].style.display).toBe('');
    });
  });

  describe('when multiple properties are given', function() {
    describe('when any are true', function() {
      it('shows the element', function() {
        expect(divs[9].style.display).toBe('');
      });
    });

    describe('when all are false', function() {
      it('hides the element', function() {
        expect(divs[10].style.display).toBe('none');
      });
    });
  });

  describe('when combined with fx-attr-*, fx-toggle-class and processText', function() {
    it('processes each', function() {
      expect(divs[11].style.display).toBe('none');
      expect(divs[11].className).toBe('trueProperty');
      expect(divs[11].getAttribute('name')).toBe('bob');
      expect(divs[11].textContent.trim()).toBe('bob');
    });
  });

  afterAll(function() { document.body.removeChild(toggleDisplay); });
});

describe('addEventListeners', function() {
  var addEventListeners = document.getElementById('add-event-listeners');
  var ps = addEventListeners.getElementsByTagName('p');
  var controller = fxjs.registeredControllers['addEventListeners'];

  describe('when given one event type and one handler', function() {
    it('attaches the handler to that event', function() {
      ps[0].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(true);
    });

    describe('when there is a space between the event type and the handler name', function() {
      it('works the same', function() {
        ps[1].dispatchEvent(new MouseEvent('click'));
        expect(controller.viewInterface.boolProp).toBe(false);
      });
    });

    describe('when there is a semicolon after the handler name', function() {
      it('works the same', function() {
        ps[2].dispatchEvent(new MouseEvent('click'));
        expect(controller.viewInterface.boolProp).toBe(true);
      });
    });

    it('removes the fx-on attribute', function() {
      expect(ps[0].hasAttribute('fx-on')).toBe(false);
    });
  });

  describe('when the referenced handler is a boolean property', function() {
    it('toggles the truthiness of it', function() {
      ps[3].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(false);
    });
  });

  describe('when the referenced handler is a function', function() {
    it('is called on the viewInterface without any arguments', function() {
      ps[4].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.argProp).toBeUndefined();
    });

    it('sets currElement to the element being processed', function() {
      ps[5].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.argProp).toBe('curr-element');
    });
  });

  describe('when multiple events are referenced, each with one handler', function() {
    it('attaches the handler to each event', function() {
      ps[6].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(true);
      ps[6].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.argProp).toBe('abc');
    });
  });

  describe('when multiple handlers are attached to one event', function() {
    it('fires each handler when the event is triggered', function() {
      ps[7].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(false);
      expect(controller.viewInterface.argProp).toBe('123');
    });
  });

  describe('when one handler is attached to multiple events', function() {
    it('attaches the handler to all events', function() {
      ps[8].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(true);
      ps[8].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.boolProp).toBe(false);
    });
  });

  describe('when multiple handlers are attached to multiple events', function() {
    it('calls all the handlers whenever any of the events is triggered', function() {
      ps[9].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.boolProp).toBe(true);
      expect(controller.viewInterface.count).toBe(1);
      ps[9].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.boolProp).toBe(false);
      expect(controller.viewInterface.count).toBe(2);
    });
  });

  describe('when many varieties of event/handler attachments are combined', function() {
    it('handles them all correctly', function() {
      ps[10].dispatchEvent(new MouseEvent('click'));
      expect(controller.viewInterface.argProp).toBe('combineAll');
      ps[10].dispatchEvent(new KeyboardEvent('keypress'));
      expect(controller.viewInterface.boolProp).toBe(true);
      expect(controller.viewInterface.count).toBe(3);
      ps[10].dispatchEvent(new Event('mouseover'));
      expect(controller.viewInterface.count).toBe(4);
      ps[10].dispatchEvent(new Event('mouseout'));
      expect(controller.viewInterface.count).toBe(5);
      ps[10].dispatchEvent(new KeyboardEvent('keydown'));
      expect(controller.viewInterface.boolProp).toBe(false);
      expect(controller.viewInterface.count).toBe(6);
      ps[10].dispatchEvent(new KeyboardEvent('keyup'));
      expect(controller.viewInterface.boolProp).toBe(true);
      expect(controller.viewInterface.count).toBe(7);
    });
  });

  afterAll(function() { document.body.removeChild(addEventListeners); });
});

describe('checkCheckbox', function() {
  var checkCheckbox = document.getElementById('check-checkbox');
  var lis = checkCheckbox.getElementsByTagName('ul')[0].getElementsByTagName('li');
  var getCheckbox = function(li) { return li.getElementsByTagName('input')[0]; }

  describe('when the referenced property resolves to true', function() {
    it('checks the checkbox', function() {
      expect(getCheckbox(lis[0]).checked).toBe(true);
    });
  });

  describe('when the referenced property resolves truthy', function() {
    it('checks the checkbox', function() {
      expect(getCheckbox(lis[1]).checked).toBe(true);
    });
  });

  describe('when the referenced property is a function', function() {
    it('calls the function on the viewInterface', function() {
      expect(getCheckbox(lis[2]).checked).toBe(true);
    });

    it('calls the function without arguments', function() {
      expect(getCheckbox(lis[3]).checked).toBe(false);
    });
  });

  describe('when the referenced property resolves to false', function() {
    it('does not check the checkbox', function() {
      expect(getCheckbox(lis[4]).checked).toBe(false);
    });
  });

  describe('when the referenced property resolves falsey', function() {
    it('does not check the checkbox', function() {
      expect(getCheckbox(lis[5]).checked).toBe(false);
    });
  });

  afterAll(function() { checkCheckbox.parentElement.removeChild(checkCheckbox); });
});

describe('fx-foreach', function() {
  var forEach = document.getElementById('for-each');

  describe('when the referenced property is an array', function() {
    var lis = forEach.getElementsByTagName('ul')[0].getElementsByTagName('li');

    it('repeats the element for each member of the array', function() {
      expect(lis.length).toBe(3);
    });

    it('copies the attributes of the original element into all the new ones', function() {
      var sameClass = Array.prototype.slice.call(lis).filter(function(li) {
        return li.className === 'array-prop';
      });
      expect(sameClass.length).toBe(lis.length);
    });

    it('removes the fx-foreach attribute', function() {
      var hasForEach = Array.prototype.slice.call(lis).filter(function(li) {
        return li.hasAttribute('fx-foreach');
      });
      expect(hasForEach.length).toBe(0);
    });

    var repeatDivs = forEach.getElementsByClassName('repeat-div');

    it('adds each member to the lookupChain', function() {
      expect(repeatDivs[0].getAttribute('name')).toBe('my-name-is-ron');
      expect(repeatDivs[0].hasAttribute('fx-attr-name')).toBe(false);
      expect(repeatDivs[0].textContent.trim()).toBe('ron');
      expect(repeatDivs[1].getAttribute('name')).toBe('my-name-is-joe');
      expect(repeatDivs[1].hasAttribute('fx-attr-name')).toBe(false);
      expect(repeatDivs[1].textContent.trim()).toBe('joe');
      expect(repeatDivs[2].getAttribute('name')).toBe('my-name-is-bob');
      expect(repeatDivs[2].hasAttribute('fx-attr-name')).toBe(false);
      expect(repeatDivs[2].textContent.trim()).toBe('bob');
    });

    it('keeps viewInterface in the lookupChain', function() {
      expect(repeatDivs[0].id).toBe('repeat-div-1');
      expect(repeatDivs[1].id).toBe('repeat-div-2');
      expect(repeatDivs[2].id).toBe('repeat-div-3');
    });

    describe('fx-foreach within fx-foreach', function() {
      var arrayOfArrays = forEach.getElementsByClassName('array-of-arrays');
      var getInnerDivs = function(outerDiv) { return outerDiv.getElementsByTagName('div'); }

      it('puts each member of the inner array into the lookupChain, while maintaining the lookupChain so far', function() {
        var innerDivs = getInnerDivs(arrayOfArrays[2]);
        expect(innerDivs.length).toBe(3);
        expect(innerDivs[0].id).toBe('bob\'s-object-0');
        expect(innerDivs[1].id).toBe('bob\'s-object-1');
        expect(innerDivs[2].id).toBe('bob\'s-object-2');
        var innerDivs = getInnerDivs(arrayOfArrays[1]);
        expect(innerDivs.length).toBe(2);
        expect(innerDivs[0].id).toBe('joe\'s-object-0');
        expect(innerDivs[1].id).toBe('joe\'s-object-1');
        var innerDivs = getInnerDivs(arrayOfArrays[0]);
        expect(innerDivs.length).toBe(1);
        expect(innerDivs[0].id).toBe('ron\'s-object-0');
      });

      describe('when a referenced property is a function in one of the members', function() {
        it('calls the function on the member with no arguments', function() {
          var innerDivs = getInnerDivs(arrayOfArrays[2]);
          expect(innerDivs[0].getAttribute('name')).toBe('0 undefined');
          expect(innerDivs[1].getAttribute('name')).toBe('1 undefined');
          expect(innerDivs[2].getAttribute('name')).toBe('2 undefined');
          var innerDivs = getInnerDivs(arrayOfArrays[1]);
          expect(innerDivs[0].getAttribute('name')).toBe('0 undefined');
          expect(innerDivs[1].getAttribute('name')).toBe('1 undefined');
          var innerDivs = getInnerDivs(arrayOfArrays[0]);
          expect(innerDivs[0].getAttribute('name')).toBe('0 undefined');
        });
      });

      describe('when a referenced property is a function in the viewInterface', function() {
        it('calls the function on the viewInterface, after setting currElement, with the inner member, outer member, inner index and outer index as arguments', function() {
          var innerDivs = getInnerDivs(arrayOfArrays[2]);
          expect(innerDivs[0].textContent.trim()).toBe('inner-div0bob02undefined');
          expect(innerDivs[1].textContent.trim()).toBe('inner-div1bob12undefined');
          expect(innerDivs[2].textContent.trim()).toBe('inner-div2bob22undefined');
          var innerDivs = getInnerDivs(arrayOfArrays[1]);
          expect(innerDivs[0].textContent.trim()).toBe('inner-div0joe01undefined');
          expect(innerDivs[1].textContent.trim()).toBe('inner-div1joe11undefined');
          var innerDivs = getInnerDivs(arrayOfArrays[0]);
          expect(innerDivs[0].textContent.trim()).toBe('inner-div0ron00undefined');
        });
      });

      describe('the lookup chain outside of an inner fx-foreach loop', function() {
        it('consists of the member of the outer array and the index of that member', function() {
          var getTextNodes = function(div) {
            var nodes = Array.prototype.slice.call(div.childNodes);
            return nodes.filter(function(node) { return node.nodeType === 3; });
          }
          var outerText = getTextNodes(arrayOfArrays[2]);
          expect(outerText[0].textContent.trim()).toBe('array-of-arraysbob2undefined');
          expect(outerText[1].textContent.trim()).toBe('array-of-arraysbob2undefined');
          var outerText = getTextNodes(arrayOfArrays[1]);
          expect(outerText[0].textContent.trim()).toBe('array-of-arraysjoe1undefined');
          expect(outerText[1].textContent.trim()).toBe('array-of-arraysjoe1undefined');
          var outerText = getTextNodes(arrayOfArrays[0]);
          expect(outerText[0].textContent.trim()).toBe('array-of-arraysron0undefined');
          expect(outerText[1].textContent.trim()).toBe('array-of-arraysron0undefined');
        });
      });
    });

    describe('when fx-filter is provided', function() {
      describe('when the referenced property resolves to a function', function() {
        it('passes the function as the argument to array.filter', function() {
          expect(forEach.getElementsByClassName('array-filter-func').length).toBe(2);
        });
      });

      describe('when the referenced property does not resolve', function() {
        it('does not filter', function() {
          expect(forEach.getElementsByClassName('array-filter-undefined').length).toBe(3);
        });
      });

      describe('when the referenced property resolves to a non-function', function() {
        it('does not filter', function() {
          expect(forEach.getElementsByClassName('array-filter-nonfunc').length).toBe(3);
        });
      });
    });

    describe('when fx-sort is provided', function() {
      describe('when the reference resolves to a function', function() {
        it('passes the function to array.sort', function() {
          var sortFuncs = forEach.getElementsByClassName('array-sort-func');
          expect(sortFuncs[2].getElementsByTagName('p')[0].textContent.trim()).toBe('2');
          expect(sortFuncs[2].getElementsByTagName('p')[1].textContent.trim()).toBe('1');
          expect(sortFuncs[2].getElementsByTagName('p')[2].textContent.trim()).toBe('0');
        });
      });

      describe('when the reference does not resolve', function() {
        it('does not sort', function() {
          var sortUndefs = forEach.getElementsByClassName('array-sort-undefined');
          expect(sortUndefs[2].getElementsByTagName('p')[0].textContent.trim()).toBe('0');
          expect(sortUndefs[2].getElementsByTagName('p')[1].textContent.trim()).toBe('1');
          expect(sortUndefs[2].getElementsByTagName('p')[2].textContent.trim()).toBe('2');
        });
      });

      describe('when the reference resolves to a non-function', function() {
        it('does not sort', function() {
          var sortNonFuncs = forEach.getElementsByClassName('array-sort-nonfunc');
          expect(sortNonFuncs[2].getElementsByTagName('p')[0].textContent.trim()).toBe('0');
          expect(sortNonFuncs[2].getElementsByTagName('p')[1].textContent.trim()).toBe('1');
          expect(sortNonFuncs[2].getElementsByTagName('p')[2].textContent.trim()).toBe('2');
        });
      });
    });
  });

  describe('when the referenced property is an FXCollection', function() {
    describe('when no scope is given', function() {
      it('works the same as an array', function() {
        var collectionDivs = forEach.getElementsByClassName('collection-of-collections');
        var arrayDivs = forEach.getElementsByClassName('array-of-arrays');
        expect(collectionDivs[0].innerHTML).toBe(arrayDivs[0].innerHTML);
        expect(collectionDivs[1].innerHTML).toBe(arrayDivs[1].innerHTML);
        expect(collectionDivs[2].innerHTML).toBe(arrayDivs[2].innerHTML);
      });
    });

    describe('when a scope is given', function() {
      var testScopes = forEach.getElementsByClassName('test-scope');

      it('scopes the collection before iterating over its members', function() {
        expect(testScopes.length).toBe(2);
        expect(testScopes[1].getElementsByTagName('p').length).toBe(2);
        expect(testScopes[0].getElementsByTagName('p').length).toBe(1);
      });

      it('removes the fx-scope attribute', function() {
        expect(testScopes[1].hasAttribute('fx-scope')).toBe(false);
        expect(testScopes[0].hasAttribute('fx-scope')).toBe(false);
      });
    });

    describe('when fx-filter is given', function() {
      var testFilters = forEach.getElementsByClassName('test-filter');

      describe('when the referenced property resolves to a function', function() {
        it('filters the collection before iterating over its members', function() {
          expect(testFilters.length).toBe(2);
        });
      });

      describe('when the referenced property does not resolve', function() {
        describe('when the property in individual members is not a function', function() {
          it('treats it as a boolean property', function() {
            expect(testFilters[0].getElementsByClassName('filter-bool').length).toBe(1);
            expect(testFilters[1].getElementsByClassName('filter-bool').length).toBe(2);
          });
        });

        describe('when the property in individual members is undefined', function() {
          it('filters the members to none', function() {
            expect(testFilters[0].getElementsByClassName('filter-undefined').length).toBe(0);
            expect(testFilters[1].getElementsByClassName('filter-undefined').length).toBe(0);
          });
        });

        describe('when the property in individual members is a function', function() {
          it('uses the function as the filter function in the scope', function() {
            expect(testFilters[0].getElementsByClassName('filter-func').length).toBe(1);
            expect(testFilters[1].getElementsByClassName('filter-func').length).toBe(2);
          });
        });
      });

      it('removes the fx-filter attribute', function() {
        expect(testFilters[0].hasAttribute('fx-filter')).toBe(false);
        expect(testFilters[1].hasAttribute('fx-filter')).toBe(false);
      });

      describe('when the referenced property is not defined', function() {
        it('filters the members to none', function() {
          var noProps = forEach.getElementsByClassName('undefined-filter');
          expect(noProps.length).toBe(0);
        });
      });

      describe('when the referenced property is negated', function() {
        it('filters by the negated boolean of the property', function() {
          var negatedFilters = forEach.getElementsByClassName('negated-filter');
          expect(negatedFilters[0].getElementsByTagName('p').length).toBe(1);
          expect(negatedFilters[1].getElementsByTagName('p').length).toBe(1);
          expect(negatedFilters[2].getElementsByTagName('p').length).toBe(1);
        });
      });
    });

    describe('when fx-sort is given', function() {
      var testSorts = forEach.getElementsByClassName('test-sort');

      describe('when the referenced property does not resolve in the lookup chain', function() {
        describe('when the referenced property is a non-function in the members', function() {
          it('sorts by the property in each member', function() {
            expect(testSorts[0].getAttribute('name')).toBe('bob');
            expect(testSorts[1].getAttribute('name')).toBe('joe');
            expect(testSorts[2].getAttribute('name')).toBe('ron');
          });
        });

        describe('when the referenced property is a function in the members', function() {
          it('sorts by the return property of the function in each member', function() {
            expect(testSorts[0].getElementsByClassName('sort-inner-func')[0].textContent.trim()).toBe('2');
            expect(testSorts[0].getElementsByClassName('sort-inner-func')[1].textContent.trim()).toBe('1');
            expect(testSorts[0].getElementsByClassName('sort-inner-func')[2].textContent.trim()).toBe('0');
            expect(testSorts[1].getElementsByClassName('sort-inner-func')[0].textContent.trim()).toBe('1');
            expect(testSorts[1].getElementsByClassName('sort-inner-func')[1].textContent.trim()).toBe('0');
          });
        });

        describe('when the referenced property is undefined in the members', function() {
          it('does not sort them', function() {
            expect(testSorts[0].getElementsByClassName('sort-undefined')[0].textContent.trim()).toBe('0');
            expect(testSorts[0].getElementsByClassName('sort-undefined')[1].textContent.trim()).toBe('1');
            expect(testSorts[0].getElementsByClassName('sort-undefined')[2].textContent.trim()).toBe('2');
            expect(testSorts[1].getElementsByClassName('sort-undefined')[0].textContent.trim()).toBe('0');
            expect(testSorts[1].getElementsByClassName('sort-undefined')[1].textContent.trim()).toBe('1');
          });
        });
      });

      describe('when the referenced property resolves to a function', function() {
        it('sorts the collection before iterating over its members', function() {
          expect(testSorts[0].getElementsByClassName('sort-outer-func')[0].textContent.trim()).toBe('2');
          expect(testSorts[0].getElementsByClassName('sort-outer-func')[1].textContent.trim()).toBe('1');
          expect(testSorts[0].getElementsByClassName('sort-outer-func')[2].textContent.trim()).toBe('0');
          expect(testSorts[1].getElementsByClassName('sort-outer-func')[0].textContent.trim()).toBe('1');
          expect(testSorts[1].getElementsByClassName('sort-outer-func')[1].textContent.trim()).toBe('0');
        });
      });

      it('removes the fx-sort attribute', function() {
        expect(testSorts[0].hasAttribute('fx-sort')).toBe(false);
        expect(testSorts[1].hasAttribute('fx-sort')).toBe(false);
        expect(testSorts[2].hasAttribute('fx-sort')).toBe(false);
      });
    });

    describe('when fx-filter and fx-sort are given', function() {
      it('filters first, then sorts', function() {
        var filterSorts = forEach.getElementsByClassName('filter-sort');
        expect(filterSorts.length).toBe(2);
        expect(filterSorts[0].textContent.trim()).toBe('bob');
        expect(filterSorts[1].textContent.trim()).toBe('joe');
      });
    });

    describe('when fx-scope is given and overridden by fx-sort or fx-filter', function() {
      it('uses the given fx-sort and/or fx-filter', function() {
        var scopeFilters = forEach.getElementsByClassName('scope-filter');
        expect(scopeFilters.length).toBe(3);
      });
    });
  });

  describe('when the list reference resolves to undefined', function() {
    it('does nothing', function() {
      var noList = forEach.getElementsByClassName('no-list');
      // still has fx-foreach attribute because no processing has occurred:
      expect(noList[0].hasAttribute('fx-foreach')).toBe(true);
    });
  });

  describe('when the list reference resolves to a non-list', function() {
    it('does nothing', function() {
      var nonFuncFilter = forEach.getElementsByClassName('non-func-filter');
      // still has fx-foreach attribute because no processing has occurred:
      expect(nonFuncFilter[0].hasAttribute('fx-foreach')).toBe(true);
    });
  });

  describe('when a property of an object in an inner foreach masks a property name of an object in the outer foreach loop', function() {
    it('uses the proeprty in the inner foreach loop', function() {
      var arrayMasks = forEach.getElementsByClassName('array-mask');
      expect(arrayMasks.length).toBe(2);
      expect(arrayMasks[0].children.length).toBe(1);
      expect(arrayMasks[1].children.length).toBe(3);
    });
  });

  afterAll(function() { forEach.parentElement.removeChild(forEach); });
});

describe('fx-context', function() {
  var context = document.getElementById('context');
  var spans = context.getElementsByTagName('span');

  describe('when the textContent contains property references', function() {
    it('puts the context object in the lookup chain', function() {
      expect(spans[0].textContent.trim()).toBe('george');
    });
  });

  describe('when the attributes contain property references', function() {
    it('puts the context object in the lookup chain', function() {
      expect(spans[0].getAttribute('name')).toBe('my-name-is-george');
    });
  });

  describe('when fx-contexts are nested', function() {
    var span = context.getElementsByTagName('p')[0].getElementsByTagName('span')[0];

    it('prepends each new fx-context to the lookup chain', function() {
      expect(span.textContent.trim()).toBe('My name is john and I belong to george');
    });

    describe('viewInterface methods called from within fx-context', function() {
      it('take the fx-context objects as arguments, but no indices', function() {
        expect(span.getAttribute('name')).toBe('johngeorgeundefined');
      });
    });

    describe('when called within a foreach loop, viewInterface methods', function() {
      it('adds the context object to the lookupChain, but does not change the indices', function() {
        var array1s = context.getElementsByClassName('array-1');
        var getArray2 = function(array1) { return array1.getElementsByTagName('div')[0].children; }
        expect(getArray2(array1s[0])[0].textContent.trim()).toBe('john1georgea00undefined');
        expect(getArray2(array1s[0])[1].textContent.trim()).toBe('john2georgea10undefined');
        expect(getArray2(array1s[1])[0].textContent.trim()).toBe('john1georgeb01undefined');
        expect(getArray2(array1s[1])[1].textContent.trim()).toBe('john2georgeb11undefined');
        expect(getArray2(array1s[2])[0].textContent.trim()).toBe('john1georgec02undefined');
        expect(getArray2(array1s[2])[1].textContent.trim()).toBe('john2georgec12undefined');
      });
    });
  });

  describe('when an inner object has the same property name as an outer object', function() {
    it('uses the inner-most object\'s property', function() {
      var objectMask = context.getElementsByClassName('object-mask')[0];
      expect(objectMask.childNodes[0].textContent.trim()).toBe('outer');
      expect(objectMask.childNodes[1].textContent.trim()).toBe('inner');
      expect(objectMask.childNodes[2].textContent.trim()).toBe('outer');
    });
  });

  describe('when the property reference resolves to undefined', function() {
    it('does nothing', function() {
      expect(context.children[6].hasAttribute('fx-context')).toBe(true);
    });
  });

  it('removes the fx-context attribute', function() {
    expect(context.children[0].hasAttribute('fx-context')).toBe(false);
    expect(context.children[1].hasAttribute('fx-context')).toBe(false);
    expect(context.children[1].children[0].hasAttribute('fx-context')).toBe(false);
    expect(context.children[2].children[0].hasAttribute('fx-context')).toBe(false);
    expect(context.children[2].children[0].children[0].children[0].hasAttribute('fx-context')).toBe(false);
    expect(context.children[5].hasAttribute('fx-context')).toBe(false);
    expect(context.children[5].children[0].hasAttribute('fx-context')).toBe(false);
  });

  afterAll(function() { context.parentElement.removeChild(context); });
});

describe('fx-filter', function() {
  var fxFilter = document.getElementById('fx-filter');
  var ps = fxFilter.getElementsByTagName('p');

  describe('when given on the same element as fx-context', function() {
    it('filters the list before processing other attributes', function() {
      expect(ps[0].getAttribute('name')).toBe('2');
    });

    it('filters the list before processing textContent', function() {
      expect(ps[0].textContent.trim()).toBe('2');
    });

    it('filters the list before processing childElements', function() {
      var span = ps[0].getElementsByTagName('span')[0];
      expect(span.className).toBe('2');
    });
  });

  describe('when given in a child element', function() {
    it('filters the nearest object in the lookup chain', function() {
      expect(ps[1].children[0].children[0].textContent.trim()).toBe('2');
    });
  });

  describe('when combined with fx-foreach', function() {
    var arrayOfArrays = fxFilter.getElementsByClassName('array-of-arrays');

    describe('when given in the same element as the fx-foreach', function() {
      it('filters the toplevel list', function() {
        expect(arrayOfArrays.length).toBe(2);
      });
    });

    describe('when given in a child element', function() {
      it('filters the sublist', function() {
        expect(arrayOfArrays[0].children[0].textContent.trim()).toBe('2');
        expect(arrayOfArrays[1].children[0].textContent.trim()).toBe('1');
      });
    });
  });

  describe('when the property reference resolves to undefined', function() {
    it('does nothing', function() {
      expect(ps[4].hasAttribute('fx-filter')).toBe(true);
    });
  });

  describe('when the property reference resolves to a non-list', function() {
    it('does nothing', function() {
      expect(ps[5].hasAttribute('fx-filter')).toBe(true);
    });
  });

  describe('when the property does not resolve', function() {
    it('does nothing', function() {
      expect(ps[6].hasAttribute('fx-filter')).toBe(true);
    });
  });

  describe('when the property reference resolves to an FXCollection', function() {
    describe('when the property reference does not resolve', function() {
      describe('when the property in the members is a string', function() {
        it('filters the members using the property as a boolean', function() {
          expect(ps[7].textContent.trim()).toBe('1');
        });
      });

      describe('when the property in the members is a function', function() {
        it('filters the members by calling the function on the object and/or passing the object to the function as the argument', function() {
          expect(ps[11].textContent.trim()).toBe('2');
        });
      });

      describe('when the property is not found in the members', function() {
        it('filters the members to none', function() {
          expect(ps[8].textContent.trim()).toBe('0');
        });
      });
    });

    describe('when the property reference resolves to a function', function() {
      it('filters by calling the function on each member', function() {
        expect(ps[9].textContent.trim()).toBe('2');
      });

      it('also passes each member to the function as its only argument', function() {
        expect(ps[10].textContent.trim()).toBe('2');
      });
    });

    describe('when the property reference resolves to a non-function and non-string', function() {
      it('filters the members to none', function() {
        expect(ps[12].textContent.trim()).toBe('0');
      });
    });

    describe('when the property reference resolves to a string', function() {
      it('uses the string to access properties in the members', function() {
        expect(ps[13].textContent.trim()).toBe('1');
      });
    });
  });

  it('removes the fx-filter attribute', function() {
    expect(ps[0].hasAttribute('fx-filter')).toBe(false);
    expect(ps[1].children[0].children[0].hasAttribute('fx-filter')).toBe(false);
    expect(ps[2].children[0].hasAttribute('fx-filter')).toBe(false);
    expect(ps[3].children[0].hasAttribute('fx-filter')).toBe(false);
  });

  afterAll(function() { fxFilter.parentElement.removeChild(fxFilter); });
});

describe('fx-sort', function() {
  var fxSort = document.getElementById('fx-sort');

  afterAll(function() { fxSort.parentElement.removeChild(fxSort); });
});

// test watch
// test rebuild after change to watch

// array indexing as property reference?

// test fx-data
