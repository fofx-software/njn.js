var fxjs = {};

fxjs.app = function(appName) {
  return new FXApp(appName);
}

// from http://stackoverflow.com/a/14645827/2041696

//(function(old) {
//  $.fn.attr = function() {
//    if(arguments.length === 0) {
//      if(this.length === 0) {
//        return null;
//      }
//
//      var obj = {};
//      $.each(this[0].attributes, function() {
//        if(this.specified) {
//          obj[this.name] = this.value;
//        }
//      });
//      return obj;
//    }
//
//    return old.apply(this, arguments);
//  };
//})($.fn.attr);

/*
(function($) {
  fxjs = {
    module: []
  };

  function FxComponent(elementName, parentElement) {
    if(typeof elementName !== 'undefined') {
      this.element = parentElement.querySelector('[fx-' + this.componentType + '="' + elementName + '"]');
    }
  }

  fxjs.module = function(moduleName) {
    var module = new fxModule(moduleName);
    this.modules.push(module);
    return module;
  }

  function Controller(controllerName, parentApp) {
    FxComponent.call(this, controllerName, parentApp);
    this.models = [];
  }

  Controller.prototype = new FxComponent;
  Controller.prototype.constructor = Controller;
  Controller.prototype.componentType = 'controller';

  Controller.prototype.model = function(modelName, initializer) {
    var model = new Model(modelName, this);

    var modelContainer = { model: model };
    var nodes = this.element.querySelectorAll('[fx-model="' + modelName + '"]');
    modelContainer.relatedNodes = Array.prototype.slice.call(nodes).map(function(node) {
      return { parentNode: node.parentNode, node: node };
    });
    modelContainer.initialTextNodes = modelContainer.relatedNodes.map(function(nodeContainer) {
      var childNodes = nodeContainer.node.childNodes;
      var textNodes = [];
      for(var i = 0; i < childNodes.length; i++) {
        if(childNodes[i].nodeName === '#text') textNodes.push(childNodes[i]);
      }
      return textNodes;
    }, this);

    this.models.push(modelContainer);
    this.removeNodes(modelContainer);
    if(typeof initializer === 'function') initializer.call(model);
    this.updateModelNodes(modelContainer);

    return this;
  }

  Controller.prototype.updateModelNodes = function(modelContainer) {
    var count = modelContainer.model.instances.length;
    if(count) {
      modelContainer.relatedNodes.forEach(function(node, index) {
        modelContainer.model.instances.forEach(function(instance) {
          var textTemplate = modelContainer.initialTextNodes[index][0].textContent;
          var processedNode = this.processNode(node.node, textTemplate, instance);
          node.parentNode.appendChild(node.node);
        }, this);
      }, this);
    } else {
      this.removeNodes(modelContainer);
    }
  }

  Controller.prototype.processNode = function(node, textTemplate, instance) {
    if((/{{\w+}}/).test(textTemplate)) {
      var interpolators = textTemplate.match(/{{[\w\.]+}}/g);
      var newText = textTemplate;
      interpolators.forEach(function(interpolater) {
        var propertyName = interpolater.match(/[\w+\.]/)[0];
        if(instance.hasOwnProperty(propertyName)) {
          newText = newText.replace(interpolater, instance[interpolater]);
        } else {
          newText = newText.replace(interpolater, instance.toString());
        }
      });
      node.textContent = newText;
    }
  }

  Controller.prototype.removeNodes = function(modelContainer) {
    modelContainer.relatedNodes.forEach(function(node) {
      
    });
  }

  function Model(modelName, controller) {
    this.controller = controller;
    this.instances = [];
  }

  Model.prototype.makeInstances = function(array) {
    this.instances = this.instances.concat(array);
    return this;
  }
})(jQuery);
*/
