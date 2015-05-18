var fxjs = {};

(function() {
  var controllersPrototype = {
    asArray: function() {
      return(Object.getOwnPropertyNames(fxjs.registeredControllers).map(function(controllerName) {
        return fxjs.registeredControllers[controllerName];
      }));
    },
    
    watching: function(collection) {
      return(fxjs.registeredControllers.asArray().filter(function(controller) {
        return controller.watching === collection;
      }));
    },
  
    reset: function() {
      fxjs.registeredControllers = Object.create(controllersPrototype);
    }
  };
  
  fxjs.registeredControllers = Object.create(controllersPrototype);
})();

(function() {
  var collectionsPrototype = {
    reset: function() {
      fxjs.registeredCollections = Object.create(collectionsPrototype);
    }
  };

  fxjs.registeredCollections = Object.create(collectionsPrototype);
})();

// utilities:

fxjs.isDefined = function(value) {
  return typeof value !== 'undefined';
}

fxjs.isNull = function(value) {
  return value === null;
}

fxjs.isBoolean = function(value) {
  return typeof value === 'boolean';
}

fxjs.isString = function(value) {
  return typeof value === 'string';
}

fxjs.isFunction = function(value) {
  return typeof value === 'function';
}

fxjs.isPlainObject = function(value) {
  if(typeof value !== 'object') return false;
  if(fxjs.isArray(value)) return false;
  if(fxjs.isNull(value)) return false;
  return true;
}

fxjs.isArray = function(value) {
  if(Array.isArray) {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
}

fxjs.isRegExp = function(val) {
  return val instanceof RegExp;
}

fxjs.typeOf = function(val) {
  if(fxjs.isPlainObject(val)) return 'object';
  if(fxjs.isArray(val))       return 'array';
  if(fxjs.isRegExp(val))      return 'regexp';
  if(fxjs.isNull(val))        return 'null';
  return typeof val;
}

fxjs.camelCase = function(string) {
  var splitString = string.split(/[-_ ]/);
  for(var i = 1; i < splitString.length; i++) {
    var firstLetter = splitString[i].slice(0, 1).toUpperCase();
    splitString[i] = firstLetter + splitString[i].slice(1);
  }
  return splitString.join('');
}

fxjs.isBlank = function(string) {
  var emptyString = string === '';
  var whiteSpace = !!string.match(/^\s+$/);
  return emptyString || whiteSpace;
}
