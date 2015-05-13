describe('new todo input', function() {

var count = 0;
var newTodoInput = document.getElementById('new-todo');
var returnPress = new KeyboardEvent('keyup', { keyCode: 13 });
var todoLis = document.getElementsByClassName('todo-li');

beforeEach(function() {
  newTodoInput.value = 'new todo ' + count;
  count++;
});

describe('when you input a value and hit enter', function() {
  it('should create a new todo and clear the input', function() {
    expect(todoLis.length).toBe(3);
    newTodoInput.dispatchEvent(returnPress);
    expect(todoLis.length).toBe(4);
    expect(newTodoInput.value).toBe('');
  });

  it('should sort the new todo to the end of the active todos, above the completed todos', function() {
    newTodoInput.dispatchEvent(returnPress);
    expect(todoLis.length).toBe(5);
    expect(todoLis[0].className).not.toMatch(/completed/);
    expect(todoLis[1].className).not.toMatch(/completed/);
    expect(todoLis[2].textContent.trim()).toBe('new todo 0');
    expect(todoLis[2].className).not.toMatch(/completed/);
    expect(todoLis[3].textContent.trim()).toBe('new todo 1');
    expect(todoLis[3].className).not.toMatch(/completed/);
    expect(todoLis[4].className).toMatch(/completed/);
  });
});

describe('when you input a value and hit escape', function() {
  it('should clear the input and not add a new todo', function() {
    expect(newTodoInput.value).toBe('new todo 2');
    var escPress = new KeyboardEvent('keyup', { keyCode: 27 });
    newTodoInput.dispatchEvent(escPress);
    expect(newTodoInput.value).toBe('');
    expect(todoLis.length).toBe(5);
  });
});

});
