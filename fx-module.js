function FXModule(moduleName) {
  if(typeof moduleName === 'undefined')
    throw new Error('moduleName argument to FXModule was undefined');

  this.cssSelector = '[fx-module="' + moduleName + '"]';
  this.name = moduleName;
  this.controllers = [];
  this.models = [];
}

FXModule.prototype.query = function() {
  var result = $(this.cssSelector);
  return result.length ? result : null;
}

FXModule.prototype.controller = function(controllerName, initializer) {
  var controller = new Controller(controllerName, this);
  this.controllers.push(controller);
  if(typeof initializer === 'function') initializer.call(controller);
  return this;
}
