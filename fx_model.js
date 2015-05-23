fxjs.Model = {
  propertyDescriptors: {
    isFXModel: { value: true },
    initialize: {
      value: function() {
        var newObject = {};
        Object.keys(this).forEach(function(propertyName) {
          fxjs.Model.transferProperty(newObject, this, propertyName);
        }, this);
        if(this.innerInitializer) {
          this.innerInitializer.apply(newObject, arguments);
        }
        Object.defineProperties(newObject, {
          fxModel: { value: this }
        });
        return newObject;
      }
    },
    defineInitializer: {
      value: function(initializer) {
        Object.defineProperty(this, 'innerInitializer', { value: initializer });
        return this;
      }
    }
  },
  transferProperty: function(receiver, model, property) {
    var nativeClasses = [Array, Boolean, Function, Number, Object, String];
    var isNativeClass = nativeClasses.indexOf(model[property]) > -1;
    var isNativeInstance = nativeClasses.find(function(klass) {
      var found = fxjs.typeOf(model[property]) === klass;
      return found && (klass !== Function || !isNativeClass);
    });
    if(isNativeClass || isNativeInstance) {
      var underlyingValue = isNativeInstance ? model[property] : undefined;
      if(fxjs.Object.isCloneable(underlyingValue)) {
        underlyingValue = fxjs.Object.clone(underlyingValue);
      }
      var mustBeClass = isNativeInstance || model[property];
      Object.defineProperty(receiver, property, {
        enumerable: true,
        get: function() { return underlyingValue; },
        set: function(newValue) {
          if(fxjs.typeOf(newValue) !== mustBeClass) {
            throw new Error('Value of ' + property + ' must be instance of ' + mustBeClass.name);
          }
          underlyingValue = newValue;
        }
      });
    }
  }
}

fxjs.model = function(modelObject) {
  modelObject = fxjs.Object.clone(modelObject || {});
  Object.defineProperties(modelObject, fxjs.Model.propertyDescriptors);
  return modelObject;
}
