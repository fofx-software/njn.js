(function defineFXRouter() {

var FXRouter = { routes: {} };

fxjs.router = FXRouter;

fxjs.route = function() {
  var routes;

  if(arguments.length === 1) {
    var paramsObject = arguments[0];
    Object.keys(paramsObject).forEach(function(routeName) {
      newKey = routeName === '/' ? '' : routeName.toString();
      FXRouter.routes[newKey] = paramsObject[routeName];
    });
  } else {
    if(arguments[0] === '/') arguments[0] = '';
    FXRouter.routes[arguments[0]] = arguments[1];
  }
}

FXRouter.parseLocation = function() {
  var hash = location.hash.replace(/^#\//,'');
  if(FXRouter.routes[hash]) {
    FXRouter.routes[hash]();
    fxjs.controllers.watching(FXRouter).forEach(function(controller) {
      controller.refreshView();
    });
    FXRouter.currentLocation = hash;
  } else {
    var matchingPattern = Object.keys(FXRouter.routes).find(function(routeName) {
      if(/^\/.+\//.test(routeName)) {
        var regexpBody = routeName.match(/[^\/]+/)[0];
        var flags = routeName.match(/[^\/]+$/);
        var regexp = new RegExp(regexpBody, flags);
        return (regexp).test(hash);
      }
    });
    if(matchingPattern) {
      FXRouter.routes[matchingPattern]();
    }
  }
}

FXRouter.filter = function(scope) {
  for(var i = 1; i < arguments.length; i++) {
    (function(routeName) {
      var split = routeName.split(':');
      fxjs.route(split[0], function() {
        scope.set('filter', split[1] || split[0]);
      });
    })(arguments[i]);
  }
}

window.onhashchange = FXRouter.parseLocation;
window.onload = FXRouter.parseLocation;

})();
