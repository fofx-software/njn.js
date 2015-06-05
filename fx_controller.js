(function defineFXController() {

function FXController(name, template, viewInterface) {
  this.name = name;
  this.template = template;
  this.viewInterface = viewInterface;
}

fxjs.Controller = FXController;

fxjs.controller = function(controllerName, viewInterface) {
  if(fxjs.isObject(controllerName)) {
    viewInterface = controllerName;
    controllerName = undefined;
  }

  viewInterface = viewInterface || {};

  var template;

  if(fxjs.isString(controllerName)) {
    var query = '[fx-controller="' + controllerName + '"]';
    template = document.querySelector(query);
  }

  var controller = new FXController(controllerName, template, viewInterface);
  if(template) { controller.init(); }

  if(fxjs.isString(controllerName)) { fxjs.registeredControllers[controllerName] = controller; }

  return controller;
}

FXController.prototype.init = function() {
  this.liveElement = this.template.cloneNode(true);

  this.processElement(this.liveElement, this.watching ? [this.watching] : []);
  this.template.parentElement.replaceChild(this.liveElement, this.template);
}

FXController.prototype.watch = function(toWatch) {
  this.watching = toWatch;
}

FXController.prototype.refreshView = function() {
  var oldElement = this.liveElement;
  this.liveElement = this.template.cloneNode(true);

  this.processElement(this.liveElement, this.watching ? [this.watching] : []);
  oldElement.parentElement.replaceChild(this.liveElement, oldElement);
}

FXController.prototype.processElement = function(element, lookupChain, indices) {
  element.removeAttribute('fx-controller');

  // copy lookupChain so changes in here don't affect outer scope:
  lookupChain = (lookupChain || []).slice();

  if(element.hasAttribute('fx-filter')) {
    lookupChain[0] = lookupChain[0].scope({ filter: element.getAttribute('fx-filter') });
  }
  if(element.hasAttribute('fx-foreach')) {
    var listName = element.getAttribute('fx-foreach');
    var list = this.getFromLookupChain(listName, lookupChain, indices), element;
    this.buildList(element, list, lookupChain, indices);
  } else {
    this.processAttributes(element, lookupChain, indices);
    // convert to an array to make it a non-live list. This prevents re-processing
    // of child elements added by buildList during loop:
    var childNodes = Array.prototype.slice.call(element.childNodes);
    for(var i = 0; i < childNodes.length; i++) {
      if(childNodes[i].nodeType === 1) {
        this.processElement(childNodes[i], lookupChain, indices);
      } else if(childNodes[i].nodeType === 3) {
        var textContent = childNodes[i].textContent;
        var processedText = this.processText(textContent, lookupChain, indices, element);
        childNodes[i].textContent = processedText;
      }
    }
  }
}

FXController.prototype.buildList = function(element, list, lookupChain, indices) {
  if(list.isFXCollection) {
    var collection = list;
    var scope = { filter: 'all' };
    if(element.hasAttribute('fx-scope')) {
      scope = this.getFromLookupChain(element.getAttribute('fx-scope'), lookupChain, indices, element);
    }
    // quick fix, need to change:
    scope.set = function(propertyName, value) {
      scope[propertyName] = value;
      collection.broadcastChange();
    }
    list = list.scope(scope).members;
  }

  var nextSibling = element.nextSibling;
  var elementParent = element.parentElement;
  elementParent.removeChild(element);

  list.forEach(function(item, listIndex) {
    var cloneElement = element.cloneNode(true);
    cloneElement.removeAttribute('fx-foreach');
    this.processElement(cloneElement, [item], [listIndex]);
    elementParent.insertBefore(cloneElement, nextSibling);
    // quick fix, need to change:
    this.viewInterface[listIndex] = cloneElement;
  }, this);
}

FXController.prototype.processAttributes = function(element, lookupChain, indices) {
  var attributes = Array.prototype.slice.call(element.attributes);
// test for: for loop while attributes being changed caused some to be skipped
  attributes.forEach(function(attribute) {
    var currAttr = attribute.name;
    if(currAttr.match(/^fx-attr/)) {
      this.configureAttribute(element, currAttr, lookupChain, indices);
    } else {
      switch(currAttr) {
        case 'fx-toggle-display':
          this.toggleDisplay(element, lookupChain, indices);
        break;
        case 'fx-toggle-class':
          this.toggleClasses(element, lookupChain, indices);
        break;
        case 'fx-on':
          this.addEventListeners(element, lookupChain, indices);
        break;
        case 'fx-checked':
          this.checkCheckbox(element, lookupChain, indices);
        break;
      }
    }
  }, this);
}

FXController.prototype.processText = function(text, lookupChain, indices, element) {
  var interpolator = /{{!?\w+\??}}/g;
  var matches = text.match(interpolator) || [];
  matches.forEach(function(match) {
    var negate = /^{{!/.test(match);
    var innerMatch = match.match(/\w+\??/)[0];
    var replacement = this.getFromLookupChain(innerMatch, lookupChain, indices, element);
    if(negate) { replacement = !replacement; }
    text = text.replace(match, replacement);
  }, this);
  return text;
}

FXController.prototype.findInLookupChain = function(propertyName, lookupChain) {
  lookupChain = (lookupChain || []).concat(this.viewInterface);
  for(var i = 0; i < lookupChain.length; i++) {
    if(fxjs.isDefined(lookupChain[i][propertyName])) {
      return lookupChain[i];
    }
  }
}

FXController.prototype.getFromLookupChain = function(propertyName, lookupChain, indices, currElement, eventArg) {
  lookupChain = lookupChain || [];
  indices = indices || [];
  var hasProperty = this.findInLookupChain(propertyName, lookupChain);
  if(hasProperty) {
    var returnVal = hasProperty[propertyName];
    if(fxjs.isFunction(returnVal)) {
      this.viewInterface.currElement = currElement;
      var isInterface = hasProperty === this.viewInterface;
      var lookupArg = isInterface ? lookupChain.concat(indices) : [];
      if(isInterface && eventArg) { lookupArg.unshift(eventArg); }
      returnVal = returnVal.apply(hasProperty, lookupArg);
      delete this.viewInterface.currElement;
    }
    return returnVal;
  }
}

FXController.prototype.configureAttribute = function(element, attr, lookupChain, indices) {
  var originalText = element.getAttribute(attr);
  var newText = this.processText(originalText, lookupChain, indices, element);
  var trueAttribute = attr.replace(/^fx-attr-/,'');
  element.setAttribute(trueAttribute, newText);
  element.removeAttribute(attr);
  return this;
}

FXController.prototype.toggleClasses = function(element, lookupChain, indices) {
  var classesToToggle = element.getAttribute('fx-toggle-class');
  if(classesToToggle) {
    classesToToggle = classesToToggle.split(/ +/);
    var classesToAdd = classesToToggle.filter(function(className) {
      return this.getFromLookupChain(className, lookupChain, indices, element);
    }, this);
    if(classesToAdd.length) {
      var newClassName = classesToAdd.join(' ');
      element.className = (element.className ? element.className + ' ' : '') + newClassName;
    }
    element.removeAttribute('fx-toggle-class');
  }
}

FXController.prototype.toggleDisplay = function(element, lookupChain, indices){
  var toggleProperties = element.getAttribute('fx-toggle-display').split(/ +/);
  var oneFound = toggleProperties.some(function(property) {
    var trueProperty = property.replace(/^!/,'');
    var isTrue = this.getFromLookupChain(trueProperty, lookupChain, indices, element);
    return trueProperty === property ? isTrue : !isTrue;
  }, this);
  element.style.display = oneFound ? '' : 'none';
  element.removeAttribute('fx-toggle-display');
}

FXController.prototype.addEventListeners = function(element, lookupChain, indices) {
  var eventsList = element.getAttribute('fx-on').split(/; */);
  var eventsAndHandlers = eventsList.map(function(eventAndHandler) {
    return eventAndHandler.split(/: */);
  });
  eventsAndHandlers.forEach(function(eventAndHandler) {
    if(eventAndHandler[0].match(/,/)) {
      var multipleEvents = eventAndHandler[0].split(/, */);
      eventAndHandler[0] = multipleEvents.shift();
      multipleEvents.forEach(function(ev) {
        eventsAndHandlers.push([ev, eventAndHandler[1]]);
      });
    }
  });
  eventsAndHandlers.forEach(function(eventAndHandler) {
    if(eventAndHandler[0]) {
      var handlers = eventAndHandler[1].split(/, */);
      element.addEventListener(eventAndHandler[0], function(e) {
        handlers.forEach(function(handler) {
          var result = this.getFromLookupChain(handler, lookupChain, indices, element, e);
          if(fxjs.isBoolean(result)) {
            var hasProperty = this.findInLookupChain(handler, lookupChain);
            hasProperty[handler] = !result;
          }
        }, this);
      }.bind(this), false);
    }
  }, this);
  element.removeAttribute('fx-on');
}

FXController.prototype.checkCheckbox = function(element, lookupChain, indices) {
  var checkboxProperty = element.getAttribute('fx-checked');
  element.checked = this.getFromLookupChain(checkboxProperty, lookupChain, indices, element);
  element.removeAttribute('fx-checked');
}

})();
