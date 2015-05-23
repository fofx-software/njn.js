(function defineFXCollection() {

function FXCollection(name) {
  this.name = name;
  this.members = [];
  this.registeredScopes = {};
  this.aliases = {};
}

fxjs.Collection = FXCollection;

// FXModel:
  function FXModel(collection) {
    this.collection = collection;
  }

  FXCollection.Model = FXModel;

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
    var collection = (new FXCollection(collectionName)).defineModel(model)
    fxjs.registeredCollections[collectionName] = collection;
    return collection;
  }
}

FXCollection.prototype.isFXCollection = true;

FXCollection.prototype.broadcastChange = function() {
  fxjs.registeredControllers.watching(this).forEach(function(controller) {
    controller.refreshView();
  });
}

FXCollection.prototype.defineModel = function(object) {
  this.memberModel = new FXModel(this);

  if(fxjs.isObject(object)) {
    Object.keys(object).forEach(function(property) {
      if(fxjs.isBoolean(object[property])) {
        this.registeredScopes[property] = { filter: property };
      }
      this.memberModel[property] = object[property];
    }, this);
  }

  return this;
}

FXCollection.prototype.addMembers = function() {
  var candidates = arguments;
  for(var i = 0; i < candidates.length; i++) {
    var newMember = candidates[i];

    if(this.memberModel) {
      var candidate = newMember;
      newMember = Object.create(this.memberModel);

      Object.keys(candidate).forEach(function(property) {
        if(this.memberModel.hasOwnProperty(property)) {
          newMember[property] = candidate[property];
        }
      }, this);
    }

    this.members.push(newMember);
  }
  this.broadcastChange();
  return this;
}

FXCollection.prototype.scope = function(scopeName) {
  var scope, negated, collection = this;
  if(fxjs.isString(scopeName)) {
    negated = /^!/.test(scopeName);
    scopeName = scopeName.replace(/^!/,'');
    scope = this.registeredScopes[scopeName];
  } else if(fxjs.isObject(scopeName)) {
    scope = scopeName;
  }
  if(scope) {
    var scopedMembers = Array.prototype.slice.call(this.members);
    if(fxjs.isDefined(scope.filter) && scope.filter !== 'all') {
      scopedMembers = scopedMembers.filter(function(member) {
        var filter = scope.filter;
        if(this.aliases[filter]) {
          filter = this.aliases[filter];
        }
        if(fxjs.isFunction(filter)) {
          return filter.call(member);
        } else if(filter.replace(/^!/,'') in member) {
          var result = member[filter.replace(/^!/,'')];
          if(/^!/.test(filter) || negated) { result = !result; }
          return result;
        }
      }, this);
    }
    if(fxjs.isDefined(scope.sort)) {
      scopedMembers = scopedMembers.sort(function(a, b) {
        var aVal, bVal;
        if(fxjs.isString(scope.sort)) {
          var trueProp = scope.sort.replace(/^!/,'');
          aVal = a[trueProp];
          bVal = b[trueProp];
          if(fxjs.isFunction(aVal)) aVal = aVal.call(a);
          if(fxjs.isFunction(bVal)) bVal = bVal.call(b);
          if(/^!/.test(scope.sort)) {
            aVal = !aVal;
            bVal = !bVal;
          }
        } else if(fxjs.isFunction(scope.sort)) {
          aVal = scope.sort.call(null, a);
          bVal = scope.sort.call(null, b);
        }
        if(fxjs.typeOf(aVal) !== fxjs.typeOf(bVal)) {
          var msg= 'cannot sort collection because member values ' + aVal + ' and ' + bVal + ' are not of same type';
          throw new TypeError(msg);
        }
        if(aVal > bVal) { return 1;  }
        if(aVal < bVal) { return -1; }
        return 0;
      });
    }
    return scopedMembers;
  }
}

FXCollection.prototype.aliasProperty = function(newName, currName) {
  this.aliases[newName] = currName;
  return this;
}

FXCollection.prototype.forEach = function(callback, thisArg) {
  this.members.forEach(callback, thisArg);
}

FXCollection.prototype.areAll = function(callbackOrProp) {
  return(this.members.reduce(function(prev, curr) {
    var currVal;
    if(fxjs.isString(callbackOrProp)) {
      currVal = curr[callbackOrProp];
    } else {
      currVal = callbackOrProp.call(curr);
    }
    return prev && currVal;
  }, true));
}

FXCollection.prototype.areAny = function(callbackOrProp) {
  return(!!this.members.find(function(member) {
    if(fxjs.isString(callbackOrProp)) {
      return member[callbackOrProp];
    } else {
      return callbackOrProp.call(member);
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
