describe('todo count', function() {

var todoCount = function() { return document.getElementById('todo-count'); }
var countText = function() { return todoCount().textContent.trim(); }
var todoLis = document.getElementsByClassName('todo-li');

describe('initial count', function() {
  it('is 2 out of 3', function() {
    expect(countText()).toBe('2 of 3 todos left');
  });
});

describe('when you add a todo', function() {
  it('the total is increased', function() {
    var newTodo = document.getElementById('new-todo');
    newTodo.value = "increasing total";
    newTodo.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
    expect(countText()).toBe('3 of 4 todos left');
  });
});

describe('when you complete a todo', function() {
  it('the number left decreases', function() {
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    expect(countText()).toBe('2 of 4 todos left');
  });
});

describe('when you uncomplete a todo', function() {
  it('the number left increases', function() {
    expect(todoLis[3].getElementsByClassName('toggle')[0].checked).toBe(true);
    todoLis[3].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    expect(countText()).toBe('3 of 4 todos left');
  });
});

describe('when you remove a todo', function() {
  it('the total number decreases', function() {
    todoLis[2].getElementsByTagName('button')[0].dispatchEvent(new MouseEvent('click'));
    expect(countText()).toBe('2 of 3 todos left');
  });
});

});
