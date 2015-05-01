var fxjs = {
  controllers: {},
  collections: {}
};

fxjs.controllers.asArray = function() {
  return(Object.keys(this).map(function(controllerName) {
    return this[controllerName];
  }, this));
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

fxjs.isBlank = function(string) {
  var emptyString = string === '';
  var whiteSpace = !!string.match(/^\s+$/);
  return emptyString || whiteSpace;
}

fxjs.isRegExp = function(val) {
  return val instanceof RegExp;
}
