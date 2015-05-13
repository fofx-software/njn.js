describe('"clear completed" button', function() {

var clearCompleted = function() { return document.getElementById('clear-completed'); }
var shownCount = function() { return parseInt(clearCompleted().textContent.match(/[0-9]+/)[0]); }
var todoLis = document.getElementsByClassName('todo-li');

describe('its text', function() {
  it('shows the number of completed todos', function() {
    expect(shownCount()).toBe(1);
  });

  describe('when you complete a todo', function() {
    it('the count increases', function() {
      expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
      todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
      expect(shownCount()).toBe(2);
    });
  });

  describe('when you uncomplete a todo', function() {
    it('the count decreases', function() {
      expect(todoLis[2].getElementsByClassName('toggle')[0].checked)toBe(true);
      todoLis[2].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
      expect(shownCount()).toBe(1);
    });
  });
});

describe('when there are no completed todos', function() {
  it('is hidden', function() {
    expect(todoLis.length).toBe(5);
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[1].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[2].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(todoLis[3].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[4].getElementsByClassName('toggle')[0].checked).toBe(false);
    todoLis[2].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    expect(clearCompleted().style.display).toBe('none');
  });
});

describe('when you click it', function() {
  it('all completed todos are deleted', function() {
    todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    todoLis[1].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    clearCompleted().dispatchEvent(new MouseEvent('click'));
    expect(todoLis.length).toBe(1);
  });
});

});
