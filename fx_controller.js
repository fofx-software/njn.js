function FXController(elementOrId) {
  if(fxjs.isString(elementOrId)) {
    this.template = $('#' + elementOrId);
  } else {
    this.template = elementOrId;
  }
  this.parentElement = this.template.parent();
  this.classesToToggle = this.detectClassesToToggle();
  this.childrenToToggle = this.detectChildrenToToggle();
  this.template.remove();
  this.renderedTemplates = [];
  this.watching = [];
}

FXController.prototype.detectClassesToToggle = function() {
  if(this.template.attr('fx-toggle-class')) {
    return this.template.attr('fx-toggle-class').split(' ');
  } else {
    return [];
  }
}

FXController.prototype.toggleClasses = function(element, object) {
  this.classesToToggle.forEach(function(klass) {
    if(object[klass]) element.addClass(klass);
  }, this);
}

FXController.prototype.detectChildrenToToggle = function() {
  var query = this.template.find('[fx-toggle-display]');
  var mappedValues = [];
  if(query.length) {
    query.each(function() {
      var toggleDisplay = $(this).attr('fx-toggle-display');
      if(mappedValues.indexOf(toggleDisplay) === -1 && toggleDisplay.slice(0,1) !== '!') {
        mappedValues.push(toggleDisplay);
      }
    });
  }
  return mappedValues;
}

FXController.prototype.toggleChildrenDisplay = function(element, object) {
  this.childrenToToggle.forEach(function(childClass) {
    var trueChildren = element.find('[fx-toggle-display="' + childClass + '"]');
    var falseChildren = element.find('[fx-toggle-display="!' + childClass + '"]');
    if(object[childClass]) {
      trueChildren.show();
      falseChildren.hide();
    } else {
      falseChildren.show();
      trueChildren.hide();
    }
  }, this);
}

FXController.prototype.refreshView = function fxctrRefreshView() {
  this.liveElements.remove();
  this.renderView();
}

FXController.prototype.renderView = function fxctrRenderView() {
  this.liveElements = jQuery(this.watching.map(function(reference, index) {
    var clone = this.template.clone();
    this.toggleClasses(clone, reference);
    this.toggleChildrenDisplay(clone, reference);
    FXController.renderTemplate(clone, reference, this, index);
    this.parseAttributes(clone, reference, this, index);
    return clone[0];
  }, this));
  this.parentElement.append(this.liveElements);
}

FXController.prototype.loadColl = function(collectionOrArray) {
  if(fxjs.isArray(collectionOrArray)) {
    this.watching = collectionOrArray;
  } else if(collectionOrArray instanceof FXCollection) {
    this.watching = collectionOrArray.members;
  }
  this.renderView();
}

FXController.prototype.watchColl = function(collection) {
  this.watching = collection;
  this.referencedCollection = collection;
  this.loadColl(collection);
}

FXController.prototype.loadObj = function(collection) {
  this.renderView();
  //FXController.renderTemplate(clone, collection, this, 0);
  //this.parentElement.append(clone);
}

FXController.prototype.watchObj = function(object) {
  this.watching = [object];
  this.referencedCollection = object;
  this.loadObj(object);
}

FXController.prototype.get = function(integer) {
  return this.liveElements.eq(integer);
}

FXController.renderTemplate = function(element, object, template, index) {
  var contents = element.contents().remove();
  if(element.attr('fx-filter')) {
    object = object[element.attr('fx-filter')]();
  }
  contents.each(function() {
    if(this.nodeType !== 8) {
      if(this.nodeType === 3) {
        element.append(fxjs.interpolateObject($(this).text(), object));
      } else {
        var rendered = FXController.renderTemplate($(this), object, template, index);
        template.parseAttributes(rendered, object, index);
        element.append(rendered);
      }
    }
  });
  return element;
}

FXController.prototype.parseAttributes = function(element, object, index) {
  var attributes = element[0].attributes;
  var template = this;
  for(var i = 0; i < attributes.length; i++) {
    var attr = attributes[i];
    if(/^fx-attr-/.test(attr.name)) {
      var trueAttr = attr.name.replace('fx-attr-', '');
      if(trueAttr === 'checked') {
        var prop = this[attr.value] || object[attr.value];
        if(fxjs.isFunction(prop)) prop = prop();
        element.attr(trueAttr, prop);
      } else {
        element.attr(trueAttr, fxjs.interpolateObject(attr.value, object));
      }
    } else if(attr.name === 'fx-on') {
      var split = attr.value.split(';');
      var keyVals = split.map(function(pair) {
        return pair.split(':');
      });
      keyVals.forEach(function(pair) {
        pair[1] = pair[1].replace(/^ /,'');
        pair[0] = pair[0].replace(/^ /,'');
        if(pair[0].match(/,/)) {
          var split = pair[0].split(',');
          pair[0] = split[0];
          keyVals.push([split[1], pair[1]]);
        }
      });
      keyVals.forEach(function(pair) {
        element.on(pair[0], function(e) {
          var prop = template[pair[1]];
          if(fxjs.isFunction(prop)) {
            template[pair[1]](e, object, index);
          } else {
            var objectProp = object[pair[1]];
            if(fxjs.isBoolean(objectProp)) {
              object.set(pair[1], !object[pair[1]]);
              template.refreshView();
            }
          }
        });
      });
    }
  }
}

FXController.prototype.toggleClass = function() {
  for(var i = 0; i < arguments.length; i++) {
    this.classesToToggle.push(arguments[i]);
  }
  return this;
}

FXController.prototype.toggleChildren = function() {
  for(var i = 0; i < arguments.length; i++) {
    this.childrenToToggle.push(arguments[i]);
  }
  return this;
}
