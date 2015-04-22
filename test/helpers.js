function makeDiv(componentType, componentName, parentElement) {
  return($(document.createElement('div'))
    .appendTo(parentElement)
    .attr('fx-' + componentType, componentName));
}
