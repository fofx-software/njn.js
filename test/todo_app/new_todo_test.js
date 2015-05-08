describe('new todo input', function() {

var count = 0;

beforeEach(function() {
  this.newTodoInput = document.getElementById('new-todo');
  this.newTodoInput.value = 'new todo ' + count;
  count++;
  this.returnKey = new KeyboardEvent('keyup', { keyCode: 13 });
});

describe('when you input a value and hit enter', function() {


  it('should create a new todo and clear the input', function() {
    this.newTodoInput.dispatchEvent(this.returnKey);
    var todos = document.querySelectorAll('[fx-controller="todoList"]');
    expect(todos.length).toEqual(4);
    expect(this.newTodoInput.value).toEqual('');
  });

  it('should always put the new todo at the bottomof the list of active todos, above the completed todos', function() {
    this.newTodoInput.dispatchEvent(this.returnKey);
    var todos = document.querySelectorAll('[fx-controller="todoList"]');
    expect(todos[2].textContent.trim()).toEqual('new todo 0');
    expect(todos[3].textContent.trim()).toEqual('new todo 1');
    expect(todos[4].className).toEqual('completed');
  });
});

describe('when you input a value and hit escape', function() {
  it('should clear the input', function() {
    var escKey = new KeyboardEvent('keyup', { keyCode: 27 });
    expect(this.newTodoInput.value).toEqual('new todo 2');
    this.newTodoInput.dispatchEvent(escKey);
    expect(this.newTodoInput.value).toEqual('');
  });
});

});
