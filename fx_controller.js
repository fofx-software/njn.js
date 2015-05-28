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

  var template;

  if(fxjs.isDefined(controllerName)) {
    var query = '[fx-controller="' + controllerName + '"]';
    template = document.querySelector(query);
  }

  var controller = new FXController(controllerName, template, viewInterface);

  if(fxjs.isDefined(controllerName)) {
    fxjs.registeredControllers[controllerName] = controller;
  }

  return controller;
}

FXController.prototype.init = function() {
  this.liveElement = this.template.cloneNode(true);

  // 'this.watching' given in case called by watch()
  // if init() was called directly, 'this.watching' is undefined, with no effect
  this.processElement(this.liveElement, [this.watching]);
  this.template.parentElement.replaceChild(this.liveElement, this.template);
}

FXController.prototype.watch = function(toWatch) {
  this.watching = toWatch;
  this.init();
}

FXController.prototype.refreshView = function() {
  var oldElement = this.liveElement;
  this.liveElement = this.template.cloneNode(true);

  // again, if controller initialized with init(), 'this.watching'
  // is undefined, with no effect:
  this.processElement(this.liveElement, [this.watching]);
  oldElement.parentElement.replaceChild(this.liveElement, oldElement);
}

FXController.prototype.processElement = function(element, lookupChain, listIndex) {
  lookupChain = lookupChain || [];
  if(element.hasAttribute('fx-filter')) {
    lookupChain[0] = lookupChain[0].scope({ filter: element.getAttribute('fx-filter') });
  }
  if(element.hasAttribute('fx-foreach')) {
    this.buildList(element, lookupChain);
  } else {
    this.processAttributes(element, lookupChain, listIndex);
    // convert to an array to make it a non-live list. This prevents re-processing
    // of child elements added by buildList during loop:
    var childNodes = Array.prototype.slice.call(element.childNodes);
    for(var i = 0; i < childNodes.length; i++) {
      if(childNodes[i].nodeType === 1) {
        this.processElement(childNodes[i], lookupChain, listIndex);
      } else if(childNodes[i].nodeType === 3) {
        var textContent = childNodes[i].textContent;
        var processedText = this.processText(textContent, lookupChain);
        childNodes[i].textContent = processedText;
      }
    }
  }
}

FXController.prototype.buildList = function(element, list) {
  if(list.isFXCollection) {
    var collection = list;
    var scope = { filter: 'all' };
    if(element.hasAttribute('fx-scope')) {
      scope = this.viewInterface[element.getAttribute('fx-scope')];
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
    this.processElement(cloneElement, item, listIndex);
    elementParent.insertBefore(cloneElement, nextSibling);
    // quick fix, need to change:
    this[listIndex] = cloneElement;
  }, this);
}

FXController.prototype.processAttributes = function(element, lookupChain, indices) {
  var attributes = element.attributes;
  for(var i = 0; i < attributes.length; i++) {
    var currAttr = attributes[i].name;
    if(currAttr.match(/^fx-attr/)) {
      this.configureAttribute(element, currAttr, lookupChain, indices);
    } else {
      switch(attributes[i].name) {
        case 'fx-toggle-display':
          this.toggleDisplay(element, lookupChain);
        break;
        case 'fx-toggle-class':
          this.toggleClasses(element, lookupChain);
        break;
        case 'fx-on':
          this.addEventListeners(element, lookupChain, indices);
        break;
        case 'fx-checked':
          this.checkCheckbox(element, lookupChain);
        break;
      }
    }
  }
}

FXController.prototype.processText = function(text, lookupChain, indices) {
  var interpolator = /{{\w+}}/g;
  var matches = text.match(interpolator) || [];
  matches.forEach(function(match) {
    var innerMatch = match.match(/\w+/)[0];
    var replacement = this.findInLookupChain(innerMatch, lookupChain, indices);
    text = text.replace(match, replacement);
  }, this);
  return text;
}

FXController.prototype.findInLookupChain = function(propertyName, lookupChain, indices) {
  var returnVal;
  lookupChain = lookupChain || [];
  indices = indices || [];
  lookupChain.concat(this.viewInterface).some(function(context, index, array) {
    if(fxjs.isDefined(context[propertyName])) {
      returnVal = context[propertyName];
      if(fxjs.isFunction(returnVal)) {
        var isLast = index === array.length - 1;
        var lookupArg = isLast ? lookupChain.concat(indices) : [];
        returnVal = returnVal.apply(context, lookupArg);
      }
      return true;
    }
  });
  return returnVal;
}

FXController.prototype.configureAttribute = function(element, attr, lookupChain, indices) {
  var originalText = element.getAttribute(attr);
  var newText = this.processText(originalText, lookupChain, indices);
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
      return this.findInLookupChain(className, lookupChain, indices);
    }, this);
    if(classesToAdd.length) {
      var oldClassName = element.className;
      var newClassName = classesToAdd.join(' ');
      element.className = oldClassName ? oldClassName + ' ' + newClassName : newClassName;
    }
    element.removeAttribute('fx-toggle-class');
    return element;
  }
}

FXController.prototype.toggleDisplay = function(element, object){
  var testPropertyRaw = element.getAttribute('fx-toggle-display');
  var testProperty = testPropertyRaw.replace(/^!/,'');
  var testValue;
  if(testProperty in object) {
    testValue = object[testProperty];
  } else if(this.viewInterface.hasOwnProperty(testProperty)) {
    if(fxjs.isFunction(this.viewInterface[testProperty])) {
      testValue = this.viewInterface[testProperty].call(this);
    }
  }
  if(/^!/.exec(testPropertyRaw)) { testValue = !testValue; }
  element.style.display = testValue ? '' : 'none';
}

FXController.prototype.addEventListeners = function(element, object, index) {
  var eventsList = element.getAttribute('fx-on').split(/; ?/);
  var eventsAndHandlers = eventsList.map(function(eventAndHandler) {
    return eventAndHandler.split(/: ?/);
  });
  eventsAndHandlers.forEach(function(eventAndHandler) {
    if(eventAndHandler[0].match(/,/)) {
      var multipleEvents = eventAndHandler[0].split(/, ?/);
      eventAndHandler[0] = multipleEvents.shift();
      multipleEvents.forEach(function(ev) {
        eventsAndHandlers.push([ev, eventAndHandler[1]]);
      });
    }
  });
  var controller = this;
  eventsAndHandlers.forEach(function(eventAndHandler) {
    var handler = eventAndHandler[1];
    element.addEventListener(eventAndHandler[0], function(e) {
      var prop = controller.viewInterface[handler];
      if(fxjs.isFunction(prop)) {
        controller.viewInterface[handler].call(controller, e, object, index);
      } else {
        var objectProp = object[handler];
        if(fxjs.isBoolean(objectProp)) {
          object[handler] = !objectProp;
          // used to be .set() how to fix?
        } else if(fxjs.isFunction(objectProp)) {
          objectProp.call(object);
        }
      }
    }, false);
  });
}

FXController.prototype.checkCheckbox = function(element, lookupChain) {
  var checkboxProperty = element.getAttribute('fx-checked');
  var propertyValue;
  lookupChain.concat(this.viewInterface).some(function(context) {
    if(fxjs.isDefined(context[checkboxProperty])) {
      if(fxjs.isFunction(context[checkboxProperty])) {
        propertyValue = context[checkboxProperty].call(context);
      } else {
        propertyValue = context[checkboxProperty];
      }
      return true;
    }
  });
  element.checked = propertyValue;
}

})();
