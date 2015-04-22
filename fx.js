var fxjs = { apps: {} };

Object.defineProperties(fxjs.apps, {
  detectControllers: {
    value: function() {
      Object.keys(this).forEach(function(key) {
        this[key].detectControllers();
      }, this);
    }
  },
  initializeControllers: {
    value: function() {
      Object.keys(this).forEach(function(key) {
        var app = this[key];
        Object.keys(app.controllers).forEach(function(controllerName) {
          var controller = app.controllers[controllerName];
          controller.initialize(app);
          Object.keys(app.models).forEach(function(modelName) {
            controller.updateModelTemplates(app.models[modelName]);
          });
        });
      }, this);
    }
  },
  detectModels: {
    value: function() {
      Object.keys(this).forEach(function(key) {
        this[key].detectModels();
      }, this);
    }
  },
  updateControllers: {
    value: function() {
      Object.keys(this).forEach(function(key) {
        var app = this[key];
        var modelNames = Object.keys(app.models);
        modelNames.forEach(function(modelName) {
          app.updateControllers(app.models[modelName]);
        });
      });
    }
  }
});

fxjs.detectApps = function detectApps() {
  var withAppAttribute = $('[fx-app]');
  withAppAttribute.get().forEach(function(element) {
    var appName = $(element).attr('fx-app');
    if(typeof this.apps[appName] === 'undefined')
      this.apps[appName] = new FXApp(appName);
  }, this);
}

$(document).ready(function() {
  fxjs.detectApps();
  fxjs.apps.detectModels();
  //fxjs.apps.initializeModels();
  fxjs.apps.detectControllers();
  fxjs.apps.initializeControllers();
});

// utitlies:

function isDefined(value) {
  return typeof value !== 'undefined';
}

function isFunction(value) {
  return typeof value === 'function';
}

function isObject(value) {
  var test1 = typeof value === 'object';
  var test2 = !Array.isArray(value);
  var test3 = value !== null;
  return test1 && test2 && test3;
}

function isArray(value) {
  return Array.isArray(value);
}
