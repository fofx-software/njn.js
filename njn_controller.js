var __njn_controller_utilities__ = (function defineNJNController() {

njn.Controller = function NJNController() { }

njn.controller = function(controllerName, viewInterface) {
  var controller = new njn.Controller;

  controller.viewInterface = viewInterface || (njn.isObject(controllerName) ? controllerName : {});

  if(njn.isString(controllerName)) {
    controller.name = controllerName;
    njn.registerController(controllerName, controller);
    var template = document.querySelector(controller.liveElement());
    if(template) controller.loadTemplate(template);
  }

  return controller;
}

njn.Controller.prototype.liveElement = function() {
  return document.querySelector('[data-njn="' + this.name + '"]');
}

njn.Controller.prototype.loadTemplate = function(template) {
  this.template = template;
  this.parentElement = template.parentElement;
  return this.refreshView();
}

njn.Controller.prototype.refreshView = function() {
  this.liveElement().outerHTML = this.processHTML(this.template, this.viewInterface);
  return this.liveElement();
}

njn.Controller.prototype.processHTML = function(elementOrHTML, resolveIn) {
  var container = document.createElement('div');
  container.innerHTML = elementOrHTML.outerHTML || elementOrHTML;
  while(container.innerHTML.search(interpolatorRE) > -1) {
    container.innerHTML = processText(container.innerHTML, resolveIn);
  }
  return stripBracketsAndTripleBraces(container.innerHTML);
}

var interpolatorRE = /\{\{!?\w+\??\}\}(?!\})/g;
var escapeHTMLRE = /\[\[([^]|\n)+\]\]/g;

function processText(text, resolveIn) {
  return text.replace(interpolatorRE, function(match) {
    var negate = /^\{\{!/.test(match);
    var innerMatch = match.match(/\w+\??/)[0];
    var replacement = resolveValue(innerMatch, resolveIn);
    if(negate) { replacement = !replacement; }
    if(njn.isHTMLElement(replacement)) {
      replacement = replacement.outerHTML;
    }
    return replacement;
  }).replace(escapeHTMLRE, function(match) {
    return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
}

function resolveValue(propertyName, resolveIn) {
  var value = resolveIn[propertyName];
  return value.call ? value.call(resolveIn) : value;
}

function stripBracketsAndTripleBraces(html) {
  return html.replace(/\[?\[\[|\]?\]\]/g, function(match) {
    return match.length === 3 ? match.slice(0,2) : '';
  }).replace(/\{\{\{/g, '{{').replace(/\}\}\}/g, '}}');
}

njn.Controller.prototype.mapHTML = function(list, elementOrHTML, join) {
  var mapped = list.map(function(member) {
    return this.processHTML(elementOrHTML, member);
  }, this);
  return njn.isDefined(join) ? mapped.join(join) : mapped;
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
