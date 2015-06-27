// recalculable attributes
// njn-style-*
// viewInterface doctree
// append when property reference resolves to htmlElement

(function defineNJNCollection() {

function NJNCollection() {
  this.members = [];
}

njn.Collection = NJNCollection;

njn.collection = function(model) {
  var collection = new NJNCollection;
  if(model) { collection.defineModel(model); }
  return collection;
}

NJNCollection.prototype.isNJNCollection = true;

NJNCollection.prototype.broadcastChange = function() {
  njn.registeredControllers.watching(this).forEach(function(controller) {
    controller.refreshView();
  });
}

NJNCollection.prototype.defineModel = function(object) {
  this.memberModel = njn.model(object);
  var collection = this;
  this.memberModel.define('set', function(property, value) {
    if(njn.isObject(property)) {
      Object.keys(property).forEach(function(key) {
        this[key] = property[key];
      }, this);
      collection.broadcastChange();
    } else {
      this[property] = value;
      collection.broadcastChange();
    }
  });
  return this;
}

NJNCollection.prototype.addMembers = function() {
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

NJNCollection.prototype.concatMembers = function(array) {
// test this
  return this.addMembers.apply(this, array);
}

NJNCollection.prototype.scope = function(scope) {
  var negated, collection = this;
  if(scope) {
    var scopedMembers = Array.prototype.slice.call(this.members);
    if(njn.isDefined(scope.filter) && scope.filter !== 'all') {
      scopedMembers = scopedMembers.filter(function(member) {
        var filter = scope.filter;
        if(njn.isFunction(filter)) {
          return filter.call(member, member);
        } else if(njn.isString(filter)) {
          var trueName = filter.replace(/^!/,'');
          var hasOwnProperty = member.hasOwnProperty(trueName);
          var isAlias = false;
          if(member.fxModel) { isAlias = member.fxModel.isAlias(trueName); }
          if(hasOwnProperty || isAlias) {
            var result = member[trueName];
            if(njn.isFunction(result)) { result = result.call(member, member); }
            if(/^!/.test(filter) || negated) { result = !result; }
            return result;
          }
        }
      }, this);
    }
    if(njn.isDefined(scope.sort)) {
      scopedMembers = scopedMembers.sort(function(a, b) {
        var aVal, bVal;
        if(njn.isString(scope.sort)) {
          var trueProp = scope.sort.replace(/^!/,'');
          aVal = a[trueProp];
          bVal = b[trueProp];
          if(njn.isFunction(aVal)) aVal = aVal.call(a);
          if(njn.isFunction(bVal)) bVal = bVal.call(b);
          if(/^!/.test(scope.sort)) {
            aVal = !aVal;
            bVal = !bVal;
          }
        } else if(njn.isFunction(scope.sort)) {
          aVal = scope.sort.call(null, a);
          bVal = scope.sort.call(null, b);
        }
        if(njn.typeOf(aVal) !== njn.typeOf(bVal)) {
          var msg= 'cannot sort collection because member values ' + aVal + ' and ' + bVal + ' are not of same type';
          throw new TypeError(msg);
        }
        if(aVal > bVal) { return 1;  }
        if(aVal < bVal) { return -1; }
        return 0;
      });
    }

    var scopedCollection;
    if(njn.isDefined(this.memberModel)) {
      scopedCollection = njn.collection(collection.memberModel.model);
    } else {
      scopedCollection = njn.collection();
    }
    // transfer members directly so they are the same objects:
    scopedCollection.members = scopedMembers;
    return scopedCollection;
  }
}

NJNCollection.prototype.filter = function() {
  return this.scope({ filter: arguments[0] });
}

NJNCollection.prototype.sort = function() {
  return this.scope({ sort: arguments[0] });
}

NJNCollection.prototype.forEach = function(callback, thisArg) {
  this.members.forEach(callback, thisArg);
}

NJNCollection.prototype.remove = function(member) {
  var index = this.members.indexOf(member);
  this.members.splice(index, 1);
  this.broadcastChange();
}

NJNCollection.prototype.areAll = function(callbackOrProp) {
  return(this.members.every(function(member) {
    if(njn.isString(callbackOrProp)) {
      var val = member[callbackOrProp];
      if(njn.isFunction(val)) {
        return val.call(member);
      } else {
        return val;
      }
    } else {
      return callbackOrProp.call(null, member);
    }
  }, true));
}

NJNCollection.prototype.areAny = function(callbackOrProp) {
  return(this.members.some(function(member) {
    if(njn.isString(callbackOrProp)) {
      var val = member[callbackOrProp];
      if(njn.isFunction(val)) {
        return val.call(member);
      } else {
        return val;
      }
    } else {
      return callbackOrProp.call(null, member);
    }
  }));
}

NJNCollection.prototype.setAll = function(propName, value) {
  this.members.forEach(function(member) {
    member[propName] = value;
  });
  this.broadcastChange();
}

NJNCollection.prototype.count = function() {
  return this.members.length;
}

})();
