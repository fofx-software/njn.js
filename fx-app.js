function FXApp(appName) {
  this.name = appName;
  this.selector = '[fx-app="' + this.name + '"]';
  this.controllers = [];
  this.models = {};
}

FXApp.prototype.query = function() {
  return $(this.selector);
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

FXApp.prototype.controller = function(controllerName, callback) {
  var controller = new FXController(controllerName, this);
  if(typeof callback === 'function') callback.call(controller);
  this.controllers.push(controller);
  controller.modelTemplates = controller.detectModelTemplates();
  controller.modelTemplates.forEach(function(wrapper) {
    wrapper.element.remove();
  });
  return this;
}

FXApp.prototype.updateControllers = function(model) {
  this.controllers.forEach(function(controller) {
    controller.updateModelTemplates(model);
  }, this);
}
