function FXModel(modelName) {
  this.name = modelName;
  this.selector = '[fx-model="' + this.name + '"]';
  this.members = [];
  this.functions = {};
}

FXModel.prototype.query = function() {
  return $(this.selector);
}

FXModel.prototype.populate = function(candidates) {
  if(!(candidates instanceof Array)) candidates = [candidates];

  candidates.forEach(function(candidate) {
    if(this.validate(candidate)) {
      var newMember = candidate;
      if(isFunction(this.initialize)) {
        newMember = {};
        this.initialize.call(newMember, candidate);
      }
      this.members.push(newMember);
    }
  }, this);
}

FXModel.prototype.validate = function(candidate) {
  return true;
}

FXModel.prototype.define = function(arg1, arg2) {
  if(typeof arg1 === 'string' && typeof arg2 === 'function') {
    this.functions[arg1] = arg2;
  } else if(typeof arg1 === 'object') {
    Object.keys(arg1).forEach(function(key) {
      if(typeof arg1[key] === 'function') {
        this.functions[key] = arg1[key];
      }
    }, this);
  }
  return this;
}
