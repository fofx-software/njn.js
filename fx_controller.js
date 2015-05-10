(function defineFXController() {

function FXController(name, template, actions) {
  this.name = name;
  this.template = template;
  this.actions = actions;
}

fxjs.controller = function(controllerName, actionsObject) {
  if(controllerName && !fxjs.controllers[controllerName]) {
    var query = '[fx-controller="' + controllerName + '"]';
    var template = document.querySelector(query);

    if(template) {
      var controller = new FXController(controllerName, template, actionsObject);
      fxjs.controllers[controllerName] = controller;
    }
  }

  return fxjs.controllers[controllerName];
}

FXController.prototype.init = function() {
  this.liveElement = this.template.cloneNode(true);

  // 'this.watching' given in case called by watch()
  // if init() was called directly, 'this.watching' is undefined, with no effect
  this.processNode(this.liveElement, this.watching);
  this.template.parentNode.replaceChild(this.liveElement, this.template);
}

FXController.prototype.watch = function(toWatch) {
  this.watching = toWatch;
  this.init();
}

FXController.prototype.list = function(list, scope) {
  if(fxjs.isString(list)) {
    this.watching = this.listing = fxjs.collections[list];
  } else if(list.isFXCollection) {
    this.watching = this.listing = list;
  }

  if(this.listing) {
    this.listScope = scope;
    var nextSibling = this.template.nextSibling;
    this.parentNode = this.template.parentNode;
    this.parentNode.removeChild(this.template);
    this.buildList(this.listing, nextSibling);
  }
}

FXController.prototype.buildList = function(list, afterList) {
  if(list.isFXCollection) {
    list = this.listing.scoped(this.listScope);
  }
  this.liveElements = list.map(function(item, listIndex) {
    var cloneNode = this.template.cloneNode(true);
    this.processNode(cloneNode, item, listIndex);
    this.parentNode.insertBefore(cloneNode, afterList);
    this[listIndex] = cloneNode;
    return cloneNode;
  }, this);
}

FXController.prototype.refreshView = function() {
  if(this.listing) {
    var afterList;
    this.liveElements.forEach(function(node, index) {
      afterList = node.nextSibling;
      node.parentElement.removeChild(node);
      delete this[index];
    });
    this.buildList(this.listing, afterList);
  } else {
    var oldElement = this.liveElement;
    this.liveElement = this.template.cloneNode(true);

    // again, if controller initialized with init(), 'this.watching'
    // is undefined, with no effect:
    this.processNode(this.liveElement, this.watching);
    oldElement.parentNode.replaceChild(this.liveElement, oldElement);
  }
}

FXController.prototype.processNode = function(node, object, listIndex) {
  if(node.getAttribute('fx-filter')) {
    object = object.scoped(node.getAttribute('fx-filter'));
  }
  this.processAttributes(node, object, listIndex);
  var childNodes = node.childNodes;
  for(var i = 0; i < childNodes.length; i++) {
    if(childNodes[i].nodeType === 1) {
      this.processNode(childNodes[i], object, listIndex);
    } else if(childNodes[i].nodeType === 3) {
      var textContent = childNodes[i].textContent;
      var processedText = this.processText(textContent, object);
      childNodes[i].textContent = processedText;
    }
  }
}

FXController.prototype.processAttributes = function(node, object, listIndex) {
  var attributes = node.attributes;
  for(var i = 0; i < attributes.length; i++) {
    var currAttr = attributes[i].name;
    if(currAttr.match(/^fx-attr/)) {
      this.configureAttribute(node, currAttr, object, listIndex);
    } else {
      switch(attributes[i].name) {
        case 'fx-toggle-display':
          this.toggleDisplay(node, object);
        break;
        case 'fx-toggle-class':
          this.toggleClass(node, object);
        break;
        case 'fx-on':
          this.addEventListeners(node, object, listIndex);
        break;
        case 'fx-checked':
          this.checkCheckbox(node, object);
        break;
      }
    }
  }
}

FXController.prototype.configureAttribute = function(node, attr, object, index) {
  var propertyName = node.getAttribute(attr);
  var trueAttribute = attr.replace(/^fx-attr-/,'');
  if(fxjs.isFunction(this.actions[propertyName])) {
    var returnValue = this.actions[propertyName].call(this, node, object, index);
    if(returnValue) {
      node.setAttribute(trueAttribute, returnValue);
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

FXController.prototype.toggleClass = function(node, object) {
  var classesToToggle = node.getAttribute('fx-toggle-class').split(/, ?| /);
  var classesToAdd = classesToToggle.filter(function(klass) {
    return object[klass];
  });
  if(classesToAdd.length) {
    var oldClassName = node.className;
    var newClassName = classesToAdd.join(' ');
    node.className = oldClassName ? oldClassName + ' ' + newClassName : newClassName;
  }
}

FXController.prototype.toggleDisplay = function(node, object){
  var testPropertyRaw = node.getAttribute('fx-toggle-display');
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
  node.style.display = testValue ? '' : 'none';
}

FXController.prototype.addEventListeners = function(node, object, index) {
  var eventsList = node.getAttribute('fx-on').split(/; ?/);
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
    node.addEventListener(eventAndHandler[0], function(e) {
      var prop = controller.actions[handler];
      if(fxjs.isFunction(prop)) {
        controller.actions[handler].call(controller, e, object, index);
      } else {
        var objectProp = object[handler];
        if(fxjs.isBoolean(objectProp)) {
          object.set(handler, !objectProp);
        } else if(fxjs.isFunction(objectProp)) {
          objectProp.call(object);
        }
      }
    }, false);
  });
}

FXController.prototype.checkCheckbox = function(node, object) {
  var checkboxProperty = node.getAttribute('fx-checked');
  var propertyValue;
  if(fxjs.isDefined(object[checkboxProperty])) {
    propertyValue = object[checkboxProperty];
  } else {
    propertyValue = this.actions[checkboxProperty].call(this);
  }
  node.checked = propertyValue;
}

})();
