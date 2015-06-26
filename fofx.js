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

// utilities:

fxjs.isArray = function(value) {
  if(Array.isArray) {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
}

fxjs.isBoolean = function(value) {
  return typeof value === 'boolean';
}

fxjs.isDate = function(value) {
  return value instanceof Date;
}

fxjs.isDefined = function(value) {
  return typeof value !== 'undefined';
}

fxjs.isFunction = function(value) {
  return typeof value === 'function';
}

fxjs.isNull = function(value) {
  return value === null;
}

fxjs.isNumber = function(value) {
  return typeof value === "number" && value === value;
}

fxjs.isObject = function(value) {
  if(typeof value !== 'object') return false;
  if(fxjs.isDate(value)) return false;
  if(fxjs.isArray(value)) return false;
  if(fxjs.isNull(value)) return false;
  return true;
}

fxjs.isRegExp = function(val) {
  return val instanceof RegExp;
}

fxjs.isString = function(value) {
  return typeof value === 'string';
}

fxjs.typeOf = function(val) {
  if(fxjs.isArray(val))       return Array;
  if(fxjs.isBoolean(val))     return Boolean;
  if(fxjs.isDate(val))        return Date;
  if(!fxjs.isDefined(val))    return undefined;
  if(fxjs.isFunction(val))    return Function;
  if(fxjs.isNull(val))        return null;
  if(fxjs.isNumber(val))      return Number;
  if(fxjs.isObject(val))      return Object;
  if(fxjs.isRegExp(val))      return RegExp;
  if(fxjs.isString(val))      return String;
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

// mock classes:

fxjs.Object = {
  clone: function(original, deep) {
    if(fxjs.isArray(original)) {
      return original.slice();
    } else {
      var newObj = Object.create(Object.getPrototypeOf(original));
      Object.keys(original).forEach(function(propertyName) {
        newObj[propertyName] = original[propertyName];
      });
      return newObj;
    }
  },
  isCloneable: function(object) {
    return fxjs.isObject(object) || fxjs.isArray(object);
  },
  values: function(object) {
    var values = [];
    for(var property in object) {
      if(object.hasOwnProperty(property) && object.propertyIsEnumerable(property)) {
        values.push(object[property]);
      }
    }
    return values;
  }
}
