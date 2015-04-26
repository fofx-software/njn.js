function FXCollection() {
  var members = [], prototype = null, initialize;

  for(var i = 0; i < arguments.length; i++) {
    if(fxjs.isArray(arguments[i])) {
      members = arguments[i];
    } else if(fxjs.isPlainObject(arguments[i])) {
      prototype = arguments[i];
    } else if(fxjs.isFunction(arguments[i])) {
      initialize = arguments[i];
    }
  }

  if(prototype) {
    Object.keys(prototype).forEach(function(property) {
      if(fxjs.isBoolean(prototype[property])) {
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

  var collection = this;

  this.memberPrototype = prototype || {};
  this.memberPrototype.set = function(prop, val) {
    this[prop] = val;
    collection.broadcastChange();
  }

  this.initializeMember = initialize || function() { }

  this.initialize = function(candidate) {
    var newObject = Object.create(this.memberPrototype);
    Object.keys(candidate).forEach(function(property) {
      newObject[property] = candidate[property];
    });
    this.initializeMember.call(newObject);
    return newObject;
  }

  this.members = [];

  this.addMembers.apply(this, members);
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
  var newModel = Object.create(this.memberPrototype);
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
