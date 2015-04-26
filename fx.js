var fxjs = { controllers: {} };

$(document).ready(function() {
  var controllerSelectors = ['[fx-watch-coll]', '[fx-watch-obj]', '[fx-load-coll]', '[fx-load-obj]'];
  var controllerActions = controllerSelectors.map(function(selector) {
    return selector.replace(/[\[\]]/g,'');
  });
  var controllers = $(controllerSelectors.join(', '));
  var controllerCount = 0;

  controllers.each(function() {
    var controllerName = $(this).attr('fx-controller');
    if(!controllerName) controllerName = 'controller' + controllerCount;
    var controller = new FXController($(this));
    fxjs.controllers[controllerName] = controller;
  });

  Object.keys(fxjs.controllers).forEach(function(controllerName) {
    var controller = fxjs.controllers[controllerName];
    var action = controllerActions.find(function(action) {
      return controller.template.attr(action);
    }, this);
    var collection = window[controller.template.attr(action)];
    var methodName = fxjs.camelCase(action.replace('fx-',''));
    controller[methodName](collection);
    controllerCount++;
  });
});

fxjs.controller = function(controllerName, model) {
  var query = $('[fx-controller="' + controllerName + '"]');
  var controller = this.controllers[controllerName] = new FXController(query);
  Object.keys(model).forEach(function(propertyName) {
    controller[propertyName] = model[propertyName];
  });
}

fxjs.broadcastChange = function(collection) {
  Object.keys(this.controllers).forEach(function(controllerName) {
    var controller = this.controllers[controllerName];
    if(controller.referencedCollection === collection) {
      controller.refreshView();
    }
  }, this);
}

fxjs.interpolateObject = function(string, object) {
  var interpolator = /{{\w+}}/g;
  var matches = string.match(interpolator) || [];
  matches.forEach(function(match) {
    var innerMatch = match.match(/\w+/) || [];
    if(this.isDefined(object[innerMatch[0]])) {
      if(this.isFunction(object[innerMatch[0]])) {
        string = string.replace(match, object[innerMatch[0]]());
      } else {
        string = string.replace(match, object[innerMatch[0]]);
      }
    } else {
      string = string.replace(match, object.toString());
    }
  }, this);
  return string;
}

// utilities:

fxjs.isDefined = function(value) {
  return typeof value !== 'undefined';
}

fxjs.isBoolean = function(value) {
  return value === true || value === false;
}

fxjs.isString = function(value) {
  return typeof value === 'string';
}

fxjs.isFunction = function(value) {
  return typeof value === 'function';
}

fxjs.isPlainObject = function(value) {
  var test1 = typeof value === 'object';
  var test2 = !Array.isArray(value);
  var test3 = value !== null;
  return test1 && test2 && test3;
}

fxjs.isArray = function(value) {
  return Array.isArray(value);
}

fxjs.camelCase = function(string) {
  var splitString = string.split(/[-_]/);
  for(var i = 1; i < splitString.length; i++) {
    var firstLetter = splitString[i].slice(0, 1).toUpperCase();
    splitString[i] = firstLetter + splitString[i].slice(1);
  }
  return splitString.join('');
}
