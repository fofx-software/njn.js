(function defineNJNRouter() {

var NJNRouter = { routes: {} };

njn.router = NJNRouter;

njn.route = function() {
  if(arguments.length === 1) {
    var paramsObject = arguments[0];
    Object.keys(paramsObject).forEach(function(routeName) {
      newKey = routeName === '/' ? '' : routeName.toString();
      NJNRouter.routes[newKey] = paramsObject[routeName];
    });
  } else {
    if(arguments[0] === '/') arguments[0] = '';
    NJNRouter.routes[arguments[0]] = arguments[1];
  }
}

NJNRouter.parseLocation = function() {
  var hash = location.hash.replace(/^#\//,'');
  if(NJNRouter.routes[hash]) {
    NJNRouter.routes[hash]();
    //njn.registeredControllers.watching(NJNRouter).forEach(function(controller) {
    //  controller.refreshView();
    //});
    NJNRouter.currentLocation = hash;
  } else {
    var matchingPattern = Object.keys(NJNRouter.routes).find(function(routeName) {
      if(/^\/.+\//.test(routeName)) {
        var regexpBody = routeName.match(/[^\/]+/)[0];
        var flags = routeName.match(/[^\/]+$/);
        var regexp = new RegExp(regexpBody, flags);
        return (regexp).test(hash);
      }
    });
    if(matchingPattern) {
      NJNRouter.routes[matchingPattern]();
    }
  }
}

NJNRouter.filter = function(scope) {
  for(var i = 1; i < arguments.length; i++) {
    (function(routeName) {
      var split = routeName.split(':');
      njn.route(split[0], function() {
        scope.set('filter', split[1] || split[0]);
      });
    })(arguments[i]);
  }
}

window.onhashchange = NJNRouter.parseLocation;
window.onload = NJNRouter.parseLocation;

})();
