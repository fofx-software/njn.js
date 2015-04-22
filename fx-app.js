function FXApp(appName) {
  this.name = appName;
  this.selector = '[fx-app="' + this.name + '"]';
  this.controllers = {};
  this.models = {};
}

FXApp.prototype.query = function() {
  return $(this.selector);
}

FXApp.prototype.detectControllers = function() {
  var withAttribute = this.query().find('[fx-controller]');
  var mapValues = withAttribute.map(function() {
    return $(this).attr('fx-controller');
  }).get();
  mapValues.forEach(function(controllerName) {
    if(!isDefined(this.controllers[controllerName])) {
      this.controllers[controllerName] = new FXController(controllerName);
    }
  }, this);
}

FXApp.prototype.detectModels = function() {
  var withAttribute = this.query().find('[fx-model]');
  withAttribute.get().forEach(function(element) {
    var modelName = $(element).attr('fx-model');
    if(typeof this.models[modelName] === 'undefined') {
      var model = this.models[modelName] = new FXModel(modelName);
      if(isDefined(window[this.name]) && isDefined(window[this.name][modelName])) {
        var value = window[this.name][modelName];
        if(isFunction(value)) {
          model.initialize = window[this.name][modelName];
        } else if(isObject(value)) {
          model.initialize = value.init;
          if(isDefined(value.members)) model.populate(value.members);
        } else if(isArray(value)) {
          model.populate.call(model, value);
        }
      }
    }
  }, this);
}

FXApp.prototype.model = function(modelName, arg1, arg2) {
  var model = new FXModel(modelName);
  if(typeof arg1 === 'function') {
    arg1.call(model);
  } else {
    if(typeof arg2 === 'function') {
      arg2.call(model);
    }
    model.populate(arg1);
  }
  this.models[modelName] = model;
  this.updateControllers(model);
  return this;
}

FXApp.prototype.updateControllers = function(model) {
  Object.keys(this.controllers).forEach(function(controllerName) {
    this.controllers[controllerName].updateModelTemplates(model);
  }, this);
}
