(function defineFXCollection() {

function FXCollection(name) {
  this.name = name;
  this.members = [];
  this.scopes = {};
}

function FXModel(collection) {
  this.set = function(prop, val) {
    this[prop] = val;
    collection.broadcastChange();
  }
  this.remove = function() {
    var index = collection.members.indexOf(this);
    collection.members.splice(index, 1);
    collection.broadcastChange();
  }
}

fxjs.collection = function() {
  var collectionName = arguments[0];
  var model = arguments[1];
  if(model) {
    var collection = fxjs.collections[collectionName] = new FXCollection(collectionName);
    if(fxjs.isPlainObject(model)) {
      collection.model(model);
    }
  }
  return fxjs.collections[collectionName];
}

FXCollection.prototype.broadcastChange = function() {
  fxjs.controllers.watching(this).forEach(function(controller) {
    controller.refreshView();
  });
}

FXCollection.prototype.model = function(object) {
  this.memberModel = new FXModel(this);
  Object.keys(object).forEach(function(property) {
    if(fxjs.isBoolean(object[property])) {
      this[property] = function() {
        return this.members.filter(function(member) {
          return member[property];
        });
      }
      this['!' + property] = function() {
        return this.members.filter(function(member) {
          return !member[property];
        });
      }
    }
    this.memberModel[property] = object[property];
  }, this);
  return this;
}

FXCollection.prototype.addMembers = function() {
  var candidates = arguments;
  if(arguments.length === 1 && fxjs.isArray(arguments[0])) {
    candidates = arguments[0];
  }
  for(var i = 0; i < candidates.length; i++) {
    var newMember = Object.create(this.memberModel);
    var instance = candidates[i];
    Object.keys(candidates[i]).forEach(function(property) {
      newMember[property] = instance[property];
    });
    this.members.push(newMember);
  }
  return this;
}

FXCollection.prototype.defScope = function(scopeName, paramsObject) {
  this.scopes[scopeName] = paramsObject;
  var collection = this;
  paramsObject.set = function(propName, val) {
    this[propName] = val;
    collection.broadcastChange();
  }
  return this;
}

FXCollection.prototype.scoped = function(scopeName) {
  if(fxjs.isDefined(this[scopeName])) {
    var scopedMembers = this.members.filter(function(member) {
      return member[scopeName];
    });
    return scopedMembers;
  } else if(fxjs.isDefined(this.scopes[scopeName])) {
    var scope = this.scopes[scopeName];
    var scopedMembers = this.members;
    if(scope.filter === 'all') {
      scopedMembers = this.members;
    } else if(fxjs.isDefined(scope.filter)) {
      if(this[scope.filter]) {
        scopedMembers = this[scope.filter]();
      } else {
        scopedMembers = scopedMembers.filter(function(member) {
          return member[scope.filter];
        });
      }
    }
    if(fxjs.isDefined(scope.sort)) {
      scopedMembers = scopedMembers.sort(function(a, b) {
        if(a[scope.sort] > b[scope.sort]) return 1;
        if(a[scope.sort] === b[scope.sort]) return 0;
        if(a[scope.sort] < b[scope.sort]) return -1;
      });
    }
    return scopedMembers;
  } else {
    return this.members;
  }
}

FXCollection.prototype.defAlias = function(newName, currName) {
  this[newName] = this[currName];
  return this;
}

FXCollection.prototype.forEach = function(callback, thisArg) {
  this.members.forEach(callback, thisArg);
}

FXCollection.prototype.areAll = function(callbackOrMethod) {
  return(this.members.reduce(function(prev, curr) {
    var currVal;
    if(fxjs.isString(callbackOrMethod)) {
      currVal = curr[callbackOrMethod];
    } else {
      currVal = callbackOrMethod.call(curr);
    }
    return prev && currVal;
  }, true));
}

FXCollection.prototype.setAll = function(propName, value) {
  this.members.forEach(function(member) {
    member[propName] = value;
  });
  this.broadcastChange();
}

})();
