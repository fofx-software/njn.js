(function defineFXController() {

function FXController(name, template, actions) {
  this.name = name;
  this.template = template;
  this.actions = actions;
}

fxjs.Controller = FXController;

fxjs.controller = function(controllerName, actionsObject) {
  if(fxjs.isString(controllerName)) {
    var query = '[fx-controller="' + controllerName + '"]';
    var template = document.querySelector(query);

    var controller = new FXController(controllerName, template, actionsObject);
    fxjs.registeredControllers[controllerName] = controller;
    return controller;
  }
}

FXController.prototype.init = function() {
  this.liveElement = this.template.cloneNode(true);

  // 'this.watching' given in case called by watch()
  // if init() was called directly, 'this.watching' is undefined, with no effect
  this.processElement(this.liveElement, this.watching);
  this.template.parentElement.replaceChild(this.liveElement, this.template);
}

FXController.prototype.watch = function(toWatch) {
  this.watching = toWatch;
  this.init();
}

//FXController.prototype.list = function(list, scope) {
//  if(fxjs.isString(list)) {
//    this.watching = this.listing = fxjs.collections[list];
//  } else if(list.isFXCollection) {
//    this.watching = this.listing = list;
//  }
//
//  if(this.listing) {
//    this.listScope = scope;
//    var controller = this;
//
//    this.listScope.set = function(propertyName, value) {
//      this[propertyName] = value;
//      controller.refreshView();
//    }
//
//    this.nextSibling = this.template.nextSibling;
//    this.parentElement = this.template.parentElement;
//    this.parentElement.removeChild(this.template);
//    this.buildList(this.listing, nextSibling);
//  }
//}

FXController.prototype.refreshView = function() {
  if(this.listing) {
    var afterList;
    this.liveElements.forEach(function(element, index) {
      afterList = element.nextSibling;
      element.parentElement.removeChild(element);
      delete this[index];
    });
    this.buildList(this.listing, afterList);
  } else {
    var oldElement = this.liveElement;
    this.liveElement = this.template.cloneNode(true);

    // again, if controller initialized with init(), 'this.watching'
    // is undefined, with no effect:
    this.processElement(this.liveElement, this.watching);
    oldElement.parentElement.replaceChild(this.liveElement, oldElement);
  }
}

FXController.prototype.processElement = function(element, object, listIndex) {
  if(element.hasAttribute('fx-filter')) {
    object = object.scope({ filter: element.getAttribute('fx-filter') });
  }
  if(element.hasAttribute('fx-foreach')) {
    this.buildList(element, object);
  } else {
    this.processAttributes(element, object, listIndex);
    // convert to an array to make it a non-live list. This prevents re-processing
    // of child elements added by buildList during loop (because element.childNodes is live):
    var childNodes = Array.prototype.slice.call(element.childNodes);
    for(var i = 0; i < childNodes.length; i++) {
      if(childNodes[i].nodeType === 1) {
        this.processElement(childNodes[i], object, listIndex);
      } else if(childNodes[i].nodeType === 3) {
        var textContent = childNodes[i].textContent;
        var processedText = this.processText(textContent, object);
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
      scope = this.actions[element.getAttribute('fx-scope')];
    }
    // quick fix, need to change:
    scope.set = function(propertyName, value) {
      scope[propertyName] = value;
      collection.broadcastChange();
    }
    list = list.scope(scope);
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

FXController.prototype.processAttributes = function(element, object, listIndex) {
  var attributes = element.attributes;
  for(var i = 0; i < attributes.length; i++) {
    var currAttr = attributes[i].name;
    if(currAttr.match(/^fx-attr/)) {
      this.configureAttribute(element, currAttr, object, listIndex);
    } else {
      switch(attributes[i].name) {
        case 'fx-toggle-display':
          this.toggleDisplay(element, object);
        break;
        case 'fx-toggle-class':
          this.toggleClass(element, object);
        break;
        case 'fx-on':
          this.addEventListeners(element, object, listIndex);
        break;
        case 'fx-checked':
          this.checkCheckbox(element, object);
        break;
      }
    }
  }
}

FXController.prototype.configureAttribute = function(element, attr, object, index) {
  var propertyName = element.getAttribute(attr);
  var trueAttribute = attr.replace(/^fx-attr-/,'');
  if(fxjs.isFunction(this.actions[propertyName])) {
    var returnValue = this.actions[propertyName].call(this, element, object, index);
    if(returnValue) {
      element.setAttribute(trueAttribute, returnValue);
    }
  }
}

FXController.prototype.processText = function(text, object) {
  var interpolator = /{{\w+}}/g;
  var matches = text.match(interpolator) || [];
  matches.forEach(function(match) {
    var innerMatch = match.match(/\w+/) || [];
    if(fxjs.isDefined(object[innerMatch[0]])) {
      if(fxjs.isFunction(object[innerMatch[0]])) {
        text = text.replace(match, object[innerMatch[0]].call(object));
      } else {
        text = text.replace(match, object[innerMatch[0]]);
      }
    } else {
      text = text.replace(match, object.toString());
    }
  });
  return text;
}

FXController.prototype.toggleClass = function(element, object) {
  var classesToToggle = element.getAttribute('fx-toggle-class').split(/, ?| /);
  var classesToAdd = classesToToggle.filter(function(klass) {
    return object[klass];
  });
  if(classesToAdd.length) {
    var oldClassName = element.className;
    var newClassName = classesToAdd.join(' ');
    element.className = oldClassName ? oldClassName + ' ' + newClassName : newClassName;
  }
}

FXController.prototype.toggleDisplay = function(element, object){
  var testPropertyRaw = element.getAttribute('fx-toggle-display');
  var testProperty = testPropertyRaw.replace(/^!/,'');
  var testValue;
  if(testProperty in object) {
    testValue = object[testProperty];
  } else if(this.actions.hasOwnProperty(testProperty)) {
    if(fxjs.isFunction(this.actions[testProperty])) {
      testValue = this.actions[testProperty].call(this);
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
      var prop = controller.actions[handler];
      if(fxjs.isFunction(prop)) {
        controller.actions[handler].call(controller, e, object, index);
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

FXController.prototype.checkCheckbox = function(element, object) {
  var checkboxProperty = element.getAttribute('fx-checked');
  var propertyValue;
  if(fxjs.isDefined(object[checkboxProperty])) {
    propertyValue = object[checkboxProperty];
  } else {
    propertyValue = this.actions[checkboxProperty].call(this);
  }
  element.checked = propertyValue;
}

})();
