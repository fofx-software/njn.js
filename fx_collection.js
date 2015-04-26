function FXCollection() {
  var members = [], model = null, initialize;

  for(var i = 0; i < arguments.length; i++) {
    if(fxjs.isArray(arguments[i])) {
      members = arguments[i];
    } else if(fxjs.isPlainObject(arguments[i])) {
      model = arguments[i];
    } else if(fxjs.isFunction(arguments[i])) {
      initialize = arguments[i];
    }
  }

  if(model) {
    Object.keys(model).forEach(function(property) {
      if(fxjs.isBoolean(model[property])) {
        this[property] = function() {
          return(this.scope(property));
        }
        this['!' + property] = function() {
          return(this.scope(function() {
            return !this[property];
          }));
        }
      }
    }, this);
  }

  this.model = this.initializeModel(model || {});

  this.initializeMember = initialize || function() { }

  this.initialize = function(candidate) {
    var newObject = Object.create(this.model);
    Object.keys(candidate).forEach(function(property) {
      newObject[property] = candidate[property];
    });
    this.initializeMember.call(newObject);
    return newObject;
  }

  this.members = [];

  this.addMembers.apply(this, members);
}

FXCollection.prototype.initializeModel = function(model) {
  var collection = this;
  model.set = function(prop, val) {
    this[prop] = val;
    collection.broadcastChange();
  }
  model.delete = function() {
    var index = collection.members.indexOf(this);
    collection.members.splice(index, 1);
    collection.broadcastChange();
  }
  return model;
}

FXCollection.prototype.broadcastChange = function() {
  fxjs.broadcastChange(this);
}

FXCollection.prototype.scope = function(callbackOrMethodName) {
  var filteredMembers = this.members.filter(function(member) {
    if(fxjs.isString(callbackOrMethodName)) {
      var returnVal = member[callbackOrMethodName];
      if(fxjs.isFunction(returnVal)) {
        return returnVal();
      } else {
        return returnVal;
      }
    } else if(fxjs.isFunction(callbackOrMethodName)) {
      return callbackOrMethodName.call(member);
    }
  });
  var newModel = Object.create(this.model);
  return(new FXCollection(filteredMembers, newModel, this.initializeMember));
}

FXCollection.prototype.addMembers = function() {
  for(var i = 0; i < arguments.length; i++) {
    this.members.push(this.initialize(arguments[i]));
  }
  return this;
}

FXCollection.prototype.count = function() {
  return this.members.length;
}

FXCollection.prototype.setAll = function(propName, value) {
  this.members.forEach(function(member) {
    member[propName] = value;
  });
  this.broadcastChange();
}

FXCollection.prototype.all = function(propName) {
  return(this.members.reduce(function(prev, curr) {
    return prev && curr[propName];
  }, true));
}
