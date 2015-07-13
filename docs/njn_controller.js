var __njn_controller_utilities__ = (function defineNJNController() {

njn.Controller = function NJNController() { }

njn.controller = function(controllerName, viewInterface) {
  var controller = new njn.Controller;

  controller.viewInterface = viewInterface || (njn.isObject(controllerName) ? controllerName : {});
  controller.viewInterface.controller = controller;

  if(njn.isString(controllerName)) {
    controller.name = controllerName;
    njn.registerController(controllerName, controller);
    var template = document.getElementById(controllerName);
    if(template) controller.loadTemplate(template);
  }

  return controller;
}

njn.Controller.prototype.loadTemplate = function(template) {
  this.template = template;
  this.parentElement = template.parentElement;
  return this.refreshView();
}

njn.Controller.prototype.refreshView = function() {
  var processed = processHTML(this.template, this.viewInterface);
  (document.getElementById(this.name) || this.template).outerHTML = processed;
  repeatElements(document.getElementById(this.name), this.viewInterface, 1);
  var liveElement = document.getElementById(this.name);
  liveElement.outerHTML = stripBracketsAndTripleBraces(liveElement.outerHTML);
  return document.getElementById(this.name);
}

function repeatElements(parentElement, resolveIn, depth) {
  var plusSigns = '';
  for(var i = 0; i < depth; i++) { plusSigns += '+'; }
  var repeaters = parentElement.querySelectorAll('[data-njnrepeat]:not([data-njnrepeat^="' + plusSigns + '"]');
  for(i = 0; i < repeaters.length; i++) {
    var repeater = repeaters[i];
    var list = resolveValue(repeater.dataset.njnrepeat.match(/\w+/)[0], resolveIn);
    var container = document.createElement('div');
    for(var j = 0; j < list.length; j++) {
      container.innerHTML += processHTML(repeater, list[j], depth);
      repeatElements(container.lastChild, list[j], depth + 1);
    }
    repeater.outerHTML = container.innerHTML;
  }
}

function processHTML (elementOrHTML, resolveIn, depth) {
  var container = document.createElement('div');
  container.innerHTML = elementOrHTML.outerHTML || elementOrHTML;
  var interpolator = interpolatorRE(depth);
  while(container.innerHTML.search(interpolator) > -1) {
    container.innerHTML = processText(container.innerHTML, resolveIn, interpolator);
  }
  return container.innerHTML;
}

function interpolatorRE(depth) {
  var plusSigns = '';
  for(var i = 0; i < depth; i++) {
    plusSigns += '\\+';
  }
  var regexp = '\\{\\{' + plusSigns + '[!=]?\\w+\\??\\}\\}(?!\\})';
  return new RegExp(regexp, 'g');
}

var escapeHTMLRE = /\[\[([^\]]|\n)+\]\]/g;

function processText(text, resolveIn, interpolator) {
  return text.replace(interpolator, function(match) {
    var innerMatch = match.match(/\{\{\+*([^\+]+)\}\}/)[1];
    var negate = /^\{\{!/.test(innerMatch);
    var propertyName = match.match(/\w+\??/)[0];
    var replacement = resolveValue(propertyName, resolveIn);
    if(njn.isDefined(replacement)) {
      if(negate) { replacement = !replacement; }
      if(njn.isHTMLElement(replacement)) {
        replacement = replacement.outerHTML;
      }
      return replacement;
    } else {
      return match + '}';
    }
  }).replace(escapeHTMLRE, function(match) {
    return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
}

function resolveValue(propertyName, resolveIn) {
  var splitProperty = propertyName.split('.');
  var firstProperty = splitProperty.shift();
  if(njn.hasProperty(resolveIn, firstProperty)) {
    var value = resolveIn[firstProperty];
    value = value.call ? value.call(resolveIn) : value;
    while(splitProperty.length) {
      subValue = value[splitProperty.shift()];
      value = subValue.call ? subValue.call(value) : subValue;
    }
    return value;
  }
}

function stripBracketsAndTripleBraces(html) {
  return html.replace(/\[?\[\[|\]?\]\]/g, function(match) {
    return match.length === 3 ? match.slice(0,2) : '';
  }).replace(/\{\{\{/g, '{{').replace(/\}\}\}/g, '}}');
}

if(window['testing'])
  return {
    interpolatorRE: interpolatorRE,
    escapeHTMLRE: escapeHTMLRE,
    resolveValue: resolveValue,
    processText: processText,
    stripBracketsAndTripleBraces: stripBracketsAndTripleBraces
  };

})();
