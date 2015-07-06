// njn-style-*
// recalculable attributes
// viewInterface tree named elements

var __njn_controller_utility_functions__ = (function defineNJNController() {

function NJNController(name, viewInterface, watching) {
  this.name = name;
  this.viewInterface = viewInterface;
  this.watching = watching;
}

njn.Controller = NJNController;

njn.controller = function(controllerName, viewInterface, watching) {
  if(njn.isObject(controllerName)) {
    viewInterface = controllerName;
    controllerName = undefined;
  }

  viewInterface = viewInterface || {};

  var controller = new NJNController(controllerName, viewInterface, watching);

  if(njn.isString(controllerName)) {
    njn.registerController(controllerName, controller);
    var query = '[njn-controller="' + controllerName + '"]';
    controller.loadTemplate(document.querySelector(query));
  }

  return controller;
}

NJNController.prototype.loadTemplate = function(templateElement) {
  this.template = templateElement;
  if(this.template) this.refreshView(this.template);
  return this.liveElement;
}

NJNController.prototype.refreshView = function(oldElement) {
  this.liveElement = this.template.cloneNode(true);

  this.liveElement.removeAttribute('njn-controller');
  processHTML(this.liveElement, [this.viewInterface], []);

  if(oldElement.parentElement) {
    oldElement.parentElement.replaceChild(this.liveElement, oldElement);
  }

  return this.liveElement;
}

function processHTML(element, lookupChain, indices) {
  // copy arrays so changes in here don't affect outer scope:
  indices = indices.slice();

  // modifyLookupChain also copies lookupChain for same reason explained above:
  lookupChain = modifyLookupChain(element, lookupChain, indices);

  if(element.hasAttribute('njn-foreach')) {
    repeatElement(element, lookupChain, indices);
  } else {
    processAttributes(element, lookupChain, indices);
    // convert to an array to make it a non-live list. This prevents re-processing
    // of child elements added by buildList during loop:
    [].slice.call(element.childNodes).forEach(function(node) {
      if(node.nodeType === 1) {
        processHTML(node, lookupChain, indices);
      } else if(node.nodeType === 3) {
        processTextNode(node, lookupChain, indices);
      }
    });
  }

  // in case noparse attribute was used in processTextNode, it can safely be removed now:
  element.removeAttribute('noparse');

  return element;
}

function findInLookupChain(propertyName, lookupChain) {
  return lookupChain.find(function(member) {
    return njn.hasProperty(member, propertyName);
  });
}

function resolveFromLookupChain(propertyName, lookupChain, indices, currElement, eventArg) {
  var viewInterface = lookupChain.slice(-1)[0];
  var found = findInLookupChain(propertyName, lookupChain);
  if(found) {
    var resolved = found[propertyName];
    if(njn.isFunction(resolved)) {
      viewInterface.currElement = currElement;
      var lookupArg = [];
      if(found === viewInterface) lookupArg = lookupChain.slice(0,-1).concat(indices);
      if(found === viewInterface && eventArg) lookupArg.unshift(eventArg);
      resolved = resolved.apply(found, lookupArg);
      delete viewInterface.currElement;
    }
    return resolved;
  }
}

function modifyLookupChain(element, lookupChain, indices) {
  // in case element has njn-context attribute, add the new context to lookupChain:
  lookupChain = addContextObjectToLookupChain(element, lookupChain, indices);
  // above goes before below so newly added context object is what is filtered/sorted below.

  // in case element has njn-filter or njn-sort attribute, filter or sort first element in lookupChain:
  lookupChain = filterSortFirstMemberOfLookupChain(element, lookupChain, indices);

  return lookupChain;
}

function addContextObjectToLookupChain(element, lookupChain, indices) {
  var attribute = element.getAttribute('njn-context') || element.getAttribute('njn-foreach');
  if(attribute) {
    var contextObject = resolveFromLookupChain(attribute, lookupChain, indices, element);
    if(njn.isDefined(contextObject)) {
      lookupChain = [contextObject].concat(lookupChain);
    }
    element.removeAttribute('njn-context');
  }
  return lookupChain;
}

function filterSortFirstMemberOfLookupChain(element, lookupChain, indices) {
  lookupChain = lookupChain.slice();
  if(element.hasAttribute('njn-filter') || element.hasAttribute('njn-sort')) {
    if(lookupChain[0].isNJNCollection) {
/*
      var collection = lookupChain[0];
      var scope = { filter: 'all' };
      if(element.hasAttribute('njn-scope')) {
        scope = resolveFromLookupChain(controller, element.getAttribute('njn-scope'), lookupChain, indices, element);
        element.removeAttribute('njn-scope');
      }
      ['njn-filter', 'njn-sort'].forEach(function(attributeName) {
        if(element.hasAttribute(attributeName)) {
          var hasIt = findInLookupChain(controller, element.getAttribute(attributeName), lookupChain, indices, element);
          if(hasIt) {
            scope[attributeName.replace('njn-','')] = hasIt[element.getAttribute(attributeName)];
          } else {
            scope[attributeName.replace('njn-','')] = element.getAttribute(attributeName);
          }
          element.removeAttribute(attributeName);
        }
      }, controller);
      // quick fix, need to change:
      scope.set = function(propertyName, value) {
        scope[propertyName] = value;
        collection.broadcastChange();
      }
      lookupChain[0] = lookupChain[0].scope(scope).members;
*/
    } else if(njn.isArray(lookupChain[0])) {
      // filter first, then sort:
      ['njn-filter', 'njn-sort'].forEach(function(attributeName) {
        if(element.hasAttribute(attributeName)) {
          var hasIt = findInLookupChain(element.getAttribute(attributeName), lookupChain);
          if(hasIt) {
            var func = hasIt[element.getAttribute(attributeName)];
            if(njn.isFunction(func)) {
              // slice to avoid altering array when sorting:
              lookupChain[0] = lookupChain[0].slice()[attributeName.replace('njn-','')](func);
            }
          }
        }
      });
    }
  }
  element.removeAttribute('njn-filter');
  element.removeAttribute('njn-sort');
  return lookupChain;
}

function repeatElement(element, lookupChain, indices) {
  element.removeAttribute('njn-foreach');
  var nextSibling = element.nextSibling;
  var elementParent = element.parentElement;
  elementParent.removeChild(element);

  lookupChain[0].forEach(function(item, listIndex) {
    var cloneElement = element.cloneNode(true);
    processHTML(cloneElement, [item].concat(lookupChain), [listIndex].concat(indices));
    elementParent.insertBefore(cloneElement, nextSibling);
  });
}

function processTextNode(textNode, lookupChain, indices) {
  var parentElement = textNode.parentElement;
  var nextSibling = textNode.nextSibling;
  parentElement.removeChild(textNode);

  var noparse = parentElement.hasAttribute('noparse');
  var textContent = textNode.textContent;
  var nextProcess = noparse ? '{{' : '{{|<';
  var newNode = document.createTextNode('');

  while(textContent.match(nextProcess)) {
    var upToRegExp = new RegExp('^([^{<]|\{(?!\{)|\n)+(?=' + nextProcess + ')');
    if(noparse) upToRegExp = new RegExp('^([^{]|\{(?!\{)|\n)+(?=' + nextProcess + ')');
    var upTo = textContent.match(upToRegExp);
    if(upTo) {
      newNode.textContent += upTo[0];
      textContent = textContent.replace(upTo[0], '');
    }
    var interpolatorRegExp = /^\{\{([^}]|\}(?!\}))+\}\}/;
    var interpolator = textContent.match(interpolatorRegExp);
    if(interpolator) {
      var processed = processText(interpolator[0], lookupChain, indices, parentElement);
      if(njn.isHTMLElement(processed)) {
        if(newNode.textContent) {
// test this:
          newNode.textContent = unescapeHTML(newNode.textContent);
          parentElement.insertBefore(newNode, nextSibling);
          newNode = document.createTextNode('');
        }
        var element = processHTML(processed, lookupChain, indices);
        parentElement.insertBefore(element, nextSibling);
        textContent = textContent.replace(interpolatorRegExp,'');
      } else {
        textContent = textContent.replace(interpolatorRegExp, processed);
      }
    } else if(!noparse && textContent.match(/^</)) {
      if(newNode.textContent) {
// test this:
        newNode.textContent = unescapeHTML(newNode.textContent);
        parentElement.insertBefore(newNode, nextSibling);
        newNode = document.createTextNode('');
      }
      var processed = parseHTML(textContent);
      var element = processHTML(processed[0], lookupChain, indices);
      parentElement.insertBefore(element, nextSibling);
      textContent = processed[1];
    }
  }
  if(textContent) {
    newNode.textContent += textContent;
// test this:
    newNode.textContent = unescapeHTML(newNode.textContent);
    parentElement.insertBefore(newNode, nextSibling);
  }
}

function processText(text, lookupChain, indices, element) {
  var interpolator = /{{!?\w+\??}}/g;
  (text.match(interpolator) || []).forEach(function(match) {
    var negate = /^{{!/.test(match);
    var innerMatch = match.match(/\w+\??/)[0];
    var replacement = resolveFromLookupChain(innerMatch, lookupChain, indices, element);
    if(negate) { replacement = !replacement; }
    if(njn.isHTMLElement(replacement)) {
      text = replacement;
    } else {
      text = text.replace(match, replacement);
    }
  });
  return text;
}

function parseHTML(html) {
  var element;
  if(html.match(/^<(?!!--)/)) {
    var openTagRegExp = /^<([^>]+)>/;
    var openingTag = html.match(openTagRegExp)[1].split(' ');
    var tagName = openingTag.shift();
    element = document.createElement(tagName);
    openingTag.forEach(function(attrVal) {
      var attr = attrVal.split('=')[0];
      var valu = attrVal.split('=')[1] || '';
      element.setAttribute(attr, (valu.match(/[^"']+/) || [''])[0]);
    });
    html = html.replace(openTagRegExp, '');
    var closingTag = new RegExp('^</' + tagName + '>');
    while(!tagName.match(/^(img|br|input)$/) && html && !html.match(closingTag)) {
      var processed = parseHTML(html);
      if(element.hasAttribute('noparse')) {
// refactor this:
        var outerHTML = processed[0].outerHTML;
        if(outerHTML) processed[0] = document.createTextNode(unescapeHTML(outerHTML));
      }
      element.appendChild(processed[0]);
      html = processed[1];
    }
    html = html.replace(closingTag, '');
  } else {
    var textPart = /^([^<]|<(?=!--))+/;
    var unescaped = unescapeHTML(html.match(textPart)[0]);
    element = document.createTextNode(unescaped);
    html = html.replace(textPart,'');
  }
  return [element, html];
}

function unescapeHTML(html) {
  return html.replace(/&lt;/g,'<')
             .replace(/&gt;/g,'>')
             .replace(/&amp;/g, '&')
             .replace(/&#123;/g,'{')
             .replace(/&#125;/g,'}');
}

function configureAttribute(element, attr, lookupChain, indices) {
  var originalText = element.getAttribute(attr);
  var newText = processText(originalText, lookupChain, indices, element);
  var trueAttribute = attr.replace(/^njn\-/,'');
  element.setAttribute(trueAttribute, newText);
  element.removeAttribute(attr);
}

function toggleClasses(element, lookupChain, indices) {
  var classesToToggle = element.getAttribute('njn-toggle-class');
  classesToToggle = classesToToggle.split(/ /);
  var classesToAdd = classesToToggle.filter(function(className) {
    return resolveFromLookupChain(className, lookupChain, indices, element);
  });
  if(classesToAdd.length) {
    var newClassName = classesToAdd.map(function(className) {
      return njn.unCamel(className, '-');
    }).join(' ');
    element.className = (element.className + ' ' + newClassName).trim();
  }
  element.removeAttribute('njn-toggle-class');
}

function toggleDisplay(element, lookupChain, indices) {
  var toggleProperties = element.getAttribute('njn-toggle-display').split(/ /);
  var oneFound = toggleProperties.some(function(property) {
    var realProperty = property.replace(/^!/,'');
    var isTrue = resolveFromLookupChain(realProperty, lookupChain, indices, element);
    return realProperty === property ? isTrue : !isTrue;
  });
  element.style.display = oneFound ? '' : 'none';
  element.removeAttribute('njn-toggle-display');
}

function addEventListeners(element, lookupChain, indices) {
  var eventsList = element.getAttribute('njn-on').split(/; ?/);
  var eventsAndHandlers = eventsList.map(function(eventAndHandler) {
    return eventAndHandler.split(/: ?/);
  });
  eventsAndHandlers.forEach(function(eventAndHandler) {
    if(eventAndHandler[0].match(/,/)) {
      var multipleEvents = eventAndHandler[0].split(/, ?/);
      eventAndHandler[0] = multipleEvents.shift();
      multipleEvents.forEach(function(ev) {
        eventsAndHandlers.push([ev, eventAndHandler[1]]);
      });
    }
  });
  eventsAndHandlers.forEach(function(eventAndHandler) {
    if(eventAndHandler[0]) {
      var handlers = eventAndHandler[1].split(/, ?/);
      element.addEventListener(eventAndHandler[0], function(e) {
        handlers.forEach(function(handler) {
          var result = resolveFromLookupChain(handler, lookupChain, indices, element, e);
          if(njn.isBoolean(result)) {
            var hasProperty = findInLookupChain(handler, lookupChain);
            hasProperty[handler] = !result;
          }
        });
      }, false);
    }
  });
  element.removeAttribute('njn-on');
}

function checkCheckbox(element, lookupChain, indices) {
  var checkboxProperty = element.getAttribute('njn-checked');
  element.checked = resolveFromLookupChain(checkboxProperty, lookupChain, indices, element);
  element.removeAttribute('njn-checked');
}

function processAttributes(element, lookupChain, indices) {
  // convert to array for non-live list so loop is not affected by changes to attributes:
  [].slice.call(element.attributes).forEach(function(attribute) {
    var currAttr = attribute.name;
    switch(currAttr) {
      case 'njn-toggle-display':
        toggleDisplay(element, lookupChain, indices);
      break;
      case 'njn-toggle-class':
        toggleClasses(element, lookupChain, indices);
      break;
      case 'njn-on':
        addEventListeners(element, lookupChain, indices);
      break;
      case 'njn-checked':
        checkCheckbox(element, lookupChain, indices);
      break;
      default:
        if(currAttr.match(/^njn-/)) {
          configureAttribute(element, currAttr, lookupChain, indices);
        }
    }
  });
}

if(window['testing'])
  return {
    findInLookupChain: findInLookupChain,
    resolveFromLookupChain: resolveFromLookupChain,
    addContextObjectToLookupChain: addContextObjectToLookupChain,
    filterSortFirstMemberOfLookupChain: filterSortFirstMemberOfLookupChain,
    modifyLookupChain: modifyLookupChain,
    repeatElement: repeatElement,
    processTextNode: processTextNode,
    processText: processText,
    parseHTML: parseHTML,
    configureAttribute: configureAttribute,
    toggleClasses: toggleClasses,
    toggleDisplay: toggleDisplay,
    addEventListeners: addEventListeners,
    checkCheckbox: checkCheckbox,
    processAttributes: processAttributes,
    processHTML: processHTML
  };

})();
