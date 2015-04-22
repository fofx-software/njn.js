function FXTemplate(query) {
  this.element = query;
  this.parentElement = query.parent();
}

FXTemplate.prototype.insert = function() {
  this.parentElement.append(this.element);
}
