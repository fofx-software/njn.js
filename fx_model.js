(function defineFXModel() {

function FXModel() {
  this.model = {};
  Object.defineProperty(this.model, 'fxModel', { value: this });
}

fofx.Model = FXModel;

fofx.model = function(modelObject) {
  modelObject = modelObject || {};
  if(modelObject.isFXModel) return modelObject;

  var newModel = new FXModel;

  Object.keys(modelObject).forEach(function(propertyName) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(modelObject, propertyName);
    Object.defineProperty(newModel.model, propertyName, propertyDescriptor);
  });

  return newModel;
}

FXModel.prototype.initialize = function() {
  // put inner model in newObject's prototype chain so convenience methods and properties
  // eg aliases can be added to inner model and accessed by newObject later:
  var newObject = Object.create(this.model);

  // although inner model is newObject's prototype, all ownProperties are added explicitly
  // and made enumerable ownProperties of newObject:
  Object.keys(this.model).forEach(function(propertyName) {
    FXModel.transferProperty(newObject, this.model, propertyName);
  }, this);

  if(fofx.isFunction(this.innerInitializer)) {
    this.innerInitializer.apply(newObject, arguments);
  }

  Object.freeze(newObject);

  return newObject;
}

FXModel.prototype.defineInitializer = function(initializer) {
  Object.defineProperty(this, 'innerInitializer', { value: initializer });
  return this;
}

// test this:

FXModel.prototype.define = function(propertyName, value) {
  Object.defineProperty(this.model, propertyName, { value: value });
}

FXModel.prototype.create = function(newObject) {
  var newModel = this.initialize();
  newObject = newObject || {};

  Object.keys(this.model).forEach(function(propertyName) {
    if(newObject.hasOwnProperty(propertyName)) {
      newModel[propertyName] = newObject[propertyName];
    }
  });

  return newModel;
}

FXModel.prototype.aliasProperty = function(currName, newName) {
  var negated = /^!/.test(currName);
  var trueName = currName.replace(/^!/,'');
  var getFunc = function() {
    var currVal = this[trueName];
    return negated ? !currVal : currVal;
  }
  getFunc.isAlias = true;
  var setFunc = function(newVal) {
    this[trueName] = negated ? !newVal : newVal;
  }
  setFunc.isAlias = true;
  Object.defineProperty(this.model, newName, {
    get: getFunc,
    set: setFunc
  });
}

FXModel.prototype.isAlias = function(propertyName) {
  if(this.model.hasOwnProperty(propertyName)) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(this.model, propertyName);
    if(propertyDescriptor.get) { return propertyDescriptor.get.isAlias; }
  }
  return false;
}

FXModel.transferProperty = function(receiver, model, property) {
  var nativeClasses = [Array, Boolean, Date, Function, Number, Object, String];
  var isNativeClass = nativeClasses.indexOf(model[property]) > -1;
  var isNativeInstance = nativeClasses.find(function(klass) {
    var found = fofx.typeOf(model[property]) === klass;
    return found && (klass !== Function || !isNativeClass);
  });
  if(isNativeClass || isNativeInstance) {
    var underlyingValue = isNativeInstance ? model[property] : undefined;
    if(fofx.Object.isCloneable(underlyingValue)) {
      underlyingValue = fofx.Object.clone(underlyingValue);
    }
    var mustBeClass = isNativeInstance || model[property];
    Object.defineProperty(receiver, property, {
      enumerable: true,
      get: function() { return underlyingValue; },
      set: function(newValue) {
        if(fofx.typeOf(newValue) !== mustBeClass) {
          throw new Error('Value of ' + property + ' must be instance of ' + mustBeClass.name);
        }
        underlyingValue = newValue;
      }
    });
  }
}

})();
