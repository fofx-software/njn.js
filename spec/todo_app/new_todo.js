describe('new todo input', function() {

var count = 0;

beforeEach(function() {
  this.newTodoInput = document.getElementById('new-todo');
  this.newTodoInput.value = 'new todo ' + count;
  count++;
  this.returnKey = new KeyboardEvent('keyup', { keyCode: 13 });
  this.todos = document.getElementsByClassName('todo-li')
});

describe('when you input a value and hit enter', function() {
  it('should create a new todo and clear the input', function() {
    this.newTodoInput.dispatchEvent(this.returnKey);
    expect(this.todos.length).toBe(4);
    expect(this.newTodoInput.value).toBe('');
  });

  it('should always put the new todo at the bottom of the list of active todos, above the completed todos', function() {
    this.newTodoInput.dispatchEvent(this.returnKey);
    expect(this.todos[2].textContent.trim()).toBe('new todo 0');
    expect(this.todos[3].textContent.trim()).toBe('new todo 1');
    expect(this.todos[4].className).toMatch(/completed/);
  });
});

describe('when you input a value and hit escape', function() {
  it('should clear the input', function() {
    var todoLength = this.todos.length;
    var escKey = new KeyboardEvent('keyup', { keyCode: 27 });
    expect(this.newTodoInput.value).toBe('new todo 2');
    this.newTodoInput.dispatchEvent(escKey);
    expect(this.newTodoInput.value).toBe('');
    expect(this.todos.length).toBe(todoLength);
  });
});

});
