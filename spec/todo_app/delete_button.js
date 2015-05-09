describe('delete "X" button', function() {

beforeAll(function() {
  this.todos = document.getElementsByClassName('todo-li');
  this.todoCount = this.todos.length;
  var button = this.todos[2].getElementsByTagName('button')[0];
  button.dispatchEvent(new Event('click'));
});

it('deletes the todo', function() {
  expect(this.todos.length).toBe(3);
});

});
