(function defineFXController() {

function FXController() { }

fxjs.controller = function() {
  var controllerName = arguments[0];
  var actions = arguments[1];
  if(actions) {
    var controller = new FXController();
    var query = '[fx-controller="' + controllerName + '"]';
    controller.template = document.querySelector(query);

    if(controller.template) {
      fxjs.controllers[controllerName] = controller;
      Object.keys(actions).forEach(function(action) {
        controller[action] = actions[action];
      });
    }
  }
  return fxjs.controllers[controllerName];
}

FXController.prototype.watch = function() {
  this.watching = arguments[0];
  this.parentNode = this.template.parentNode;
  this.parentNode.removeChild(this.template);
  var cloneNode = this.template.cloneNode(true);
  this.processNode(cloneNode, this.watching, 0);
  this.parentNode.appendChild(cloneNode);
}

FXController.prototype.list = function() {
  var list = arguments[0];
  if(fxjs.isString(list)) {
    this.watching = this.listing = fxjs.collections[list];
    if(arguments[1]) {
      this.listScope = arguments[1];
    }
  }
  this.parentNode = this.template.parentNode;
  this.parentNode.removeChild(this.template);
  this.buildList(this.listing.scoped(this.listScope));
}

FXController.prototype.buildList = function(list) {
  this.liveNodes = list.map(function(item, listIndex) {
    var cloneNode = this.template.cloneNode(true);
    this.processNode(cloneNode, item, listIndex);
    this.parentNode.appendChild(cloneNode);
    return cloneNode;
  }, this);
}

FXController.prototype.refreshView = function() {
  if(this.listing) {
    this.liveNodes.forEach(function(node) {
      node.parentElement.removeChild(node);
    });
    this.buildList(this.listing.scoped(this.listScope));
  } else if(this.watching) {
    var cloneNode = this.template.cloneNode(true);
    this.processNode(cloneNode, this.watching, 0);
    this.parentNode.appendChild(cloneNode);
  }
}

FXController.prototype.processNode = function(node, object, listIndex) {
  this.processAttributes(node, object, listIndex);
  var childNodes = node.childNodes;
  for(var i = 0; i < childNodes.length; i++) {
    if(childNodes[i].nodeType === 1) {
      this.processNode(childNodes[i], object, listIndex);
    } else if(childNodes[i].nodeType === 3) {
      var textContent = childNodes[i].textContent;
      var processedText = this.processText(textContent, object);
      var processedNode = document.createTextNode(processedText);
      node.replaceChild(processedNode, childNodes[i]);
    }
  }
}

FXController.prototype.processAttributes = function(node, object, listIndex) {
  var attributes = node.attributes;
  for(var i = 0; i < attributes.length; i++) {
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

FXController.prototype.processText = function(text, object) {
  var interpolator = /{{\w+}}/g;
  var matches = text.match(interpolator) || [];
  matches.forEach(function(match) {
    var innerMatch = match.match(/\w+/) || [];
    if(fxjs.isDefined(object[innerMatch[0]])) {
      if(fxjs.isFunction(object[innerMatch[0]])) {
        text = text.replace(match, object[innerMatch[0]]());
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
  if(classesToAdd.length) { node.className = classesToAdd.join(' '); }
}

FXController.prototype.toggleDisplay = function(node, object){
  var testProperty = node.getAttribute('fx-toggle-display');
  var testValue = object[testProperty.replace(/^!/,'')];
  if(testProperty.slice(0,1) === '!') { testValue = !testValue; }
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
  eventsAndHandlers.forEach(function(eventAndHandler) { // this became an infinite loop
    var handler = eventAndHandler[1];
    node.addEventListener(eventAndHandler[0], function(e) {
      var prop = controller[handler];
      if(fxjs.isFunction(prop)) {
        controller[handler](e, object, index);
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
    propertyValue = this[checkboxProperty]();
  }
  node.checked = propertyValue;
}

FXController.prototype.getNode = function(index) {
  var node = this.liveNodes[index];
  return jQuery ? jQuery(node) : node;
}

})();
