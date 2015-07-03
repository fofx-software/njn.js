(function defineNJNModel() {

function NJNModel() {
  this.model = {};
  Object.defineProperty(this.model, 'njnModel', { value: this });
}

njn.Model = NJNModel;

njn.model = function(modelObject) {
  modelObject = modelObject || {};
  if(modelObject.isNJNModel) return modelObject;

  var newModel = new NJNModel;

  Object.keys(modelObject).forEach(function(propertyName) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(modelObject, propertyName);
    Object.defineProperty(newModel.model, propertyName, propertyDescriptor);
  });

  return newModel;
}

NJNModel.prototype.initialize = function() {
  // put inner model in newObject's prototype chain so convenience methods and properties
  // eg aliases can be added to inner model and accessed by newObject later:
  var newObject = Object.create(this.model);

  // although inner model is newObject's prototype, all ownProperties are added explicitly
  // and made enumerable ownProperties of newObject:
  Object.keys(this.model).forEach(function(propertyName) {
    NJNModel.transferProperty(newObject, this.model, propertyName);
  }, this);

  if(njn.isFunction(this.innerInitializer)) {
    this.innerInitializer.apply(newObject, arguments);
  }

  Object.freeze(newObject);

  return newObject;
}

NJNModel.prototype.defineInitializer = function(initializer) {
  Object.defineProperty(this, 'innerInitializer', { value: initializer });
  return this;
}

// test this:

NJNModel.prototype.define = function(propertyName, value) {
  Object.defineProperty(this.model, propertyName, { value: value });
}

NJNModel.prototype.create = function(newObject) {
  var newModel = this.initialize();
  newObject = newObject || {};

  Object.keys(this.model).forEach(function(propertyName) {
    if(newObject.hasOwnProperty(propertyName)) {
      newModel[propertyName] = newObject[propertyName];
    }
  });

  return newModel;
}

NJNModel.prototype.aliasProperty = function(currName, newName) {
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

NJNModel.prototype.isAlias = function(propertyName) {
  if(this.model.hasOwnProperty(propertyName)) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(this.model, propertyName);
    if(propertyDescriptor.get) { return propertyDescriptor.get.isAlias; }
  }
  return false;
}

NJNModel.transferProperty = function(receiver, model, property) {
  var nativeClasses = [Array, Boolean, Date, Function, Number, Object, String];
  var isNativeClass = nativeClasses.indexOf(model[property]) > -1;
  var isNativeInstance = nativeClasses.find(function(klass) {
    var found = njn.typeOf(model[property]) === klass;
    return found && (klass !== Function || !isNativeClass);
  });
  if(isNativeClass || isNativeInstance) {
    var underlyingValue = isNativeInstance ? model[property] : undefined;
    if(njn.Object.isCloneable(underlyingValue)) {
      underlyingValue = njn.Object.clone(underlyingValue);
    }
    var mustBeClass = isNativeInstance || model[property];
    Object.defineProperty(receiver, property, {
      enumerable: true,
      get: function() { return underlyingValue; },
      set: function(newValue) {
        if(njn.typeOf(newValue) !== mustBeClass) {
          throw new Error('Value of ' + property + ' must be instance of ' + mustBeClass.name);
        }
        underlyingValue = newValue;
      }
    });
  }
}

})();
