describe('todo count', function() {

var todoCount, todoLis, countText;

beforeEach(function() {
  todoCount = document.getElementById('todo-count');
  todoLis = document.getElementsByClassName('todo-li');
  countText = todoCount.textContent.trim();
});

describe('initial count', function() {
  it('is 2 out of 3', function() {
    expect(countText).toBe('2 of 3 todos left');
  });
});

describe('when you add a todo', function() {
  beforeAll(function() {
    var newTodo = document.getElementById('new-todo');
    newTodo.value = "increasing total";
    newTodo.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
  });

  it('the total is increased', function() {
    expect(countText).toBe('3 of 4 todos left');
  });
});

describe('when you complete a todo', function() {
  beforeAll(function() {
    todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
  });

  it('the number left decreases', function() {
    expect(countText).toBe('2 of 4 todos left');
  });
});

describe('when you uncomplete a todo', function() {
  beforeAll(function() {
    todoLis[3].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
  });

  it('the number left increases', function() {
    expect(countText).toBe('3 of 4 todos left');
  });
});

describe('when you remove a todo', function() {
  beforeAll(function() {
    todoLis[2].getElementsByTagName('button')[0].dispatchEvent(new MouseEvent('click'));
  });

  it('the total number decreases', function() {
    expect(countText).toBe('2 of 3 todos left');
  });
});

});
