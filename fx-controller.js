function FXController(controllerName, module) {
  this.name = controllerName;
  this.module = module;
  this.element = module.query().find('[fx-controller="' + this.name + '"]');
}

FXController.prototype.detectModelTemplates = function() {
  var query = this.element.find('[fx-model]');
  var queryWrappers = query.map(function() {
    var wrapper = {
      element: $(this)
    };

    if($(this).prev().length) wrapper.prev = $(this).prev();
    else if($(this).next().length) wrapper.next = $(this).next();
    else wrapper.parent = $(this).parent();

    return wrapper;
  });
  return queryWrappers.get();
}

FXController.prototype.updateModelTemplates = function(model) {
  var modelTemplate = this.modelTemplates.find(function(wrapper) {
    return wrapper.element.attr('fx-model') === model.name;
  });
  if(modelTemplate) {
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
      template.attr(trueAttr, model.functions[attr.value](instance, index));
    }
  }
}

FXController.prototype.processText = function(template, instance) {
  var text = template.text();
  var interpolator = /{{\w+}}/;
  var newText = text.replace(interpolator, instance);
  template.text(newText);
}
