window.onload = function() {

var controllerQuery = document.querySelectorAll('[fx-controller]');

for(var i = 0; i < controllerQuery.length; i++) {
  var element = controllerQuery[i];
  var controllerName = element.getAttribute('fx-controller');
  var controller = fxjs.controller(controllerName);
}

}
