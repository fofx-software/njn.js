(function defineFXCollection() {

function FXCollection() {
  this.members = [];
}

fxjs.Collection = FXCollection;

fxjs.collection = function(model) {
  var collection = (new FXCollection).defineModel(model)
  return collection;
}

FXCollection.prototype.isFXCollection = true;

FXCollection.prototype.broadcastChange = function() {
  fxjs.registeredControllers.watching(this).forEach(function(controller) {
    controller.refreshView();
  });
}

FXCollection.prototype.defineModel = function(object) {
  this.memberModel = fxjs.model(object);
  return this;
}

FXCollection.prototype.addMembers = function() {
  var candidates = arguments;
  for(var i = 0; i < candidates.length; i++) {
    var newMember = candidates[i];

    if(this.memberModel) {
      newMember = this.memberModel.create(newMember);
    }

    this.members.push(newMember);
  }
  this.broadcastChange();
  return this;
}

FXCollection.prototype.scope = function(scope) {
  var negated, collection = this;
  if(scope) {
    var scopedMembers = Array.prototype.slice.call(this.members);
    if(fxjs.isDefined(scope.filter) && scope.filter !== 'all') {
      scopedMembers = scopedMembers.filter(function(member) {
        var filter = scope.filter;
        if(fxjs.isFunction(filter)) {
          return filter.call(null, member);
        } else {
          var trueName = filter.replace(/^!/,'');
          var hasOwnProperty = member.hasOwnProperty(trueName);
          var isAlias = false;
          if(member.fxModel) { isAlias = member.fxModel.isAlias(trueName); }
          if(hasOwnProperty || isAlias) {
            var result = member[trueName];
            if(fxjs.isFunction(result)) { result = result.call(member); }
            if(/^!/.test(filter) || negated) { result = !result; }
            return result;
          }
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

FXCollection.prototype.filter = function() {
  return this.scope({ filter: arguments[0] });
}

FXCollection.prototype.sort = function() {
  return this.scope({ sort: arguments[0] });
}

FXCollection.prototype.forEach = function(callback, thisArg) {
  this.members.forEach(callback, thisArg);
}

FXCollection.prototype.remove = function(member) {
  var index = this.members.indexOf(member);
  this.members.splice(index, 1);
  this.broadcastChange();
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
