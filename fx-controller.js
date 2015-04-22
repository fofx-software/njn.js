function FXController(controllerName) {
  this.name = controllerName;
}

FXController.prototype.initialize = function(parentApp) {
  this.element = parentApp.query().find('[fx-controller="' + this.name + '"]');
  this.modelTemplates = this.detectModelTemplates();
}

FXController.prototype.detectModelTemplates = function() {
  var query = this.element.find('[fx-model]');
  var parentController = this;

  var queryWrappers = query.map(function() {
    var wrapper = {
      element: $(this)
    };

    // this needs to be improved:

    if($(this).prev().length) {
      wrapper.prev = $(this).prev();
    } else if($(this).next().length) {
      wrapper.next = $(this).next();
    } else {
      wrapper.parent = $(this).parent();
    }

    return wrapper;
  });

  return queryWrappers.get();
}

FXController.prototype.updateModelTemplates = function(model) {
  var modelTemplate = this.modelTemplates.find(function(wrapper) {
    return wrapper.element.attr('fx-model') === model.name;
  });
  if(modelTemplate) {
    this.element.find('[fx-model="' + model.name + '"]').remove();
    model.members.forEach(function(member, index) {
      var processedTemplate = this.processTemplate(modelTemplate.element.clone(), member, index, model);
      if(modelTemplate.prev) processedTemplate.insertAfter(modelTemplate.prev);
      else if(modelTemplate.next) processedTemplate.insertBefore(modelTemplate.next);
      else processedTemplate.appendTo(modelTemplate.parent);
    }, this);
  }
}

FXController.prototype.processTemplate = function(template, instance, index, model) {
  this.processAttributes(template, instance, index, model);
  this.processText(template, instance);
  return template;
}

FXController.prototype.processAttributes = function(template, instance, index, model) {
  var attributes = template[0].attributes;
  var dontCount = [
    'fx-app',
    'fx-controller',
    'fx-model'
  ];
  for(var i = 0; i < attributes.length; i++) {
    var attr = attributes[i];
    if(dontCount.indexOf(attr.name) === -1 && /^fx-/.test(attr.name)) {
      var trueAttr = attr.name.replace('fx-', '');
      template.attr(trueAttr, this.parseString(attr.value, instance));
    }
  }
}

FXController.prototype.processText = function(template, instance) {
  if(template.text()) {
    var parsedText = this.parseString(template.text(), instance);
    template.text(parsedText);
  }
}

FXController.prototype.parseString = function(string, instance) {
  var interpolator = /{{\w+}}/;
  var matches = string.match(interpolator);
  matches.forEach(function(match) {
    var innerMatch = match.match(/\w+/)[0];
    if(instance.hasOwnProperty(innerMatch)) {
      if(isFunction(instance[innerMatch])) {
        string = string.replace(match, instance[innerMatch](instance));
      } else {
        string = string.replace(match, instance[innerMatch]);
      }
    } else {
      string = string.replace(match, instance.toString());
    }
  });
  return string;
}
