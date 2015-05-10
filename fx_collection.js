(function defineFXCollection() {

function FXCollection(name) {
  this.name = name;
  this.members = [];
  this.scopes = {};
  this.aliases = {};
}

fxjs.Collection = FXCollection;

// FXModel:
  function FXModel(collection) {
    this.collection = collection;
  }

  FXModel.prototype.set = function(prop, val) {
    this[prop] = val;
    this.collection.broadcastChange();
  }

  FXModel.prototype.remove = function() {
    var index = this.collection.members.indexOf(this);
    this.collection.members.splice(index, 1);
    this.collection.broadcastChange();
  }

  FXModel.prototype.isFXModel = true;
// FXModel done

fxjs.collection = function(collectionName, model) {
  if(fxjs.isString(collectionName)) {
    if(fxjs.collections.hasOwnProperty(collectionName)) {
      throw new Error('FXCollection "' + collectionName + '" already registered');
    } else {
      fxjs.collections[collectionName] = (new FXCollection(collectionName)).defineModel(model);
      return fxjs.collections[collectionName];
    }
  }
}

FXCollection.prototype.isFXCollection = true;

FXCollection.prototype.broadcastChange = function() {
  fxjs.controllers.watching(this).forEach(function(controller) {
    controller.refreshView();
  });
}

FXCollection.prototype.defineModel = function(object) {
  this.memberModel = new FXModel(this);

  if(fxjs.isPlainObject(object)) {
    Object.keys(object).forEach(function(property) {
      if(fxjs.isBoolean(object[property])) {
        this.scopeByMemberBoolean(property);
      }
      this.memberModel[property] = object[property];
    }, this);
  }

  return this;
}

FXCollection.prototype.scopeByMemberBoolean = function(propertyName) {
  this.scopes[propertyName] = {
    filter: propertyName
  };

  this.scopes['!' + propertyName] = {
    filter: function() {
      return !this[propertyName];
    }
  };
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
  this.broadcastChange();
  return this;
}

FXCollection.prototype.defineScope = function(scopeName, paramsObject) {
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
          var filter = scope.filter;
          if(this.aliases[filter]) {
            filter = this.aliases[filter];
          }
          if(fxjs.isFunction(filter)) {
            return filter.call(member);
          } else {
            var result = member[filter];
            if(/^!/.test(filter)) {
              result = !member[filter.replace(/^!/,'')];
            }
            return result;
          }
        }, this);
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

FXCollection.prototype.aliasScope = function(newName, currName) {
  this.aliases[newName] = currName;
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

FXCollection.prototype.areAny = function(callbackOrMethod) {
  return(!!this.members.find(function(member) {
    if(fxjs.isString(callbackOrMethod)) {
      return member[callbackOrMethod];
    } else {
      return callbackOrMethod.call(member);
    }
  }));
}

FXCollection.prototype.setAll = function(propName, value) {
  this.members.forEach(function(member) {
    member[propName] = value;
  });
  this.broadcastChange();
}

FXCollection.prototype.count = function() {
  return this.members.length;
}

})();
