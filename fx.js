var fxjs = {
  controllers: {},
  collections: {}
};

fxjs.controllers.asArray = function() {
  return(Object.keys(this).map(function(controllerName) {
    return fxjs.controllers[controllerName];
  }));
}

fxjs.controllers.watching = function(collection) {
  return(fxjs.controllers.asArray().filter(function(controller) {
    return controller.watching === collection;
  }));
}

// utilities:

fxjs.isDefined = function(value) {
  return typeof value !== 'undefined';
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
  if(Array.isArray(value)) return false;
  if(value === null) return false;
  return true;
}

fxjs.isArray = function(value) {
  if(Array.isArray) {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
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

fxjs.isRegExp = function(val) {
  return val instanceof RegExp;
}
