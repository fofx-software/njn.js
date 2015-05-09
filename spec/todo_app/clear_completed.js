describe('"clear completed" button', function() {

var todoLis, clearCompleted, shownCount;

beforeEach(function() {
  todoLis = document.getElementsByClassName('todo-li');
  clearCompleted = document.getElementById('clear-completed');
  shownCount = parseInt(clearCompleted.textContent.match(/[0-9]+/)[0]);
});

describe('its text', function() {
  it('shows the number of completed todos', function() {
    expect(shownCount).toBe(1);
  });

  describe('when you complete a todo', function() {
    beforeAll(function() {
      todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    });

    it('the count increases', function() {
      expect(shownCount).toBe(2);
    });
  });

  describe('when you uncomplete a todo', function() {
    beforeAll(function() {
      todoLis[2].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    });

    it('the count decreases', function() {
      expect(shownCount).toBe(1);
    });
  });
});

describe('when there are no completed todos', function() {
  beforeAll(function() {
    todoLis[2].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
  });

  it('is hidden', function() {
    expect(clearCompleted.style.display).toBe('none');
  });
});

describe('when you click it', function() {
  beforeAll(function() {
    todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    todoLis[1].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    clearCompleted.dispatchEvent(new MouseEvent('click'));
  });

  it('all completed todos are deleted', function() {
    expect(todoLis.length).toBe(1);
  });
});

});
