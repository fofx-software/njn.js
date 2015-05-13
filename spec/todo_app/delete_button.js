describe('delete "X" button', function() {

beforeAll(function() {
});

it('deletes the todo', function() {
  var todoLis = document.getElementsByClassName('todo-li');
  expect(todoLis.length).toBe(4);
  var button = todoLis[2].getElementsByTagName('button')[0];
  button.dispatchEvent(new Event('click'));
  expect(todoLis.length).toBe(3);
});

});
