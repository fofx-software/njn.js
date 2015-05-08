describe('page on load:', function() {

describe('newTodo input element:', function() {
  var newTodoInput = document.querySelectorAll('[fx-controller="newTodo"]');

  it('there is exactly one.', function() {
    expect(newTodoInput.length).toEqual(1);
  });
});

// todo list items:

describe('todo list items:', function() {
  var todoLiQuery = '[fx-controller="todoList"]';

  beforeEach(function() {
    this.todos = document.querySelectorAll(todoLiQuery);
    this.todosArray = Array.prototype.slice.call(this.todos);
  });

  it('there are three.', function() {
    expect(this.todos.length).toEqual(3);
  });

  describe('the completed one:', function() {
    beforeEach(function() {
      this.completed = document.querySelectorAll(todoLiQuery + '.completed');
    });

    it('there is one.', function() {
      expect(this.completed.length).toEqual(1);
    });

    it('its class == "completed".', function() {
      expect(this.completed[0].className).toEqual('completed');
    });

    it('is the last of the <li>s', function() {
      var parentNode = this.completed[0].parentNode;
      expect(this.completed[0]).toEqual(parentNode.lastElementChild);
    });
  });

  describe('tasks in editing:', function() {
    beforeEach(function() {
      this.editing = document.querySelectorAll(todoLiQuery + '.editing');
    });

    it('there are none', function() {
      expect(this.editing.length).toEqual(0);
    });
  });

  describe('li > div[fx-toggle-display="editing"]', function() {
    beforeEach(function() {
      this.editingSubDivs = this.todosArray.filter(function(todoLi) {
        var subDiv = todoLi.querySelectorAll('div[fx-toggle-display="editing"]');
        if(subDiv.length === 1) return subDiv;
      }).map(function(todoLi) {
        return todoLi.querySelector('div[fx-toggle-display="editing"]');
      });
    });

    it('there are three', function() {
      expect(this.editingSubDivs.length).toEqual(3);
    });

    it('they are not displayed', function() {
      var allDisplayNone = this.editingSubDivs.every(function(subDiv) {
        return subDiv.style.display === 'none';
      });
      expect(allDisplayNone).toEqual(true);
    });
  });

  describe('li > div[fx-toggle-display="!editing"]', function() {
    var notEditingQuery = 'div[fx-toggle-display="!editing"]';

    beforeEach(function() {
      this.notEditingSubDivs = this.todosArray.filter(function(todoLi) {
        var subDiv = todoLi.querySelectorAll(notEditingQuery);
        if(subDiv.length === 1) return subDiv;
      }).map(function(todoLi) {
        return todoLi.querySelector(notEditingQuery);
      });
    });

    it('there are three', function() {
      expect(this.notEditingSubDivs.length).toEqual(3);
    });

    it('they are displayed', function() {
      var allDisplayed = this.notEditingSubDivs.every(function(subDiv) {
        return !subDiv.style.display;
      });
      expect(allDisplayed).toEqual(true);
    });

    describe('their <label> elements', function() {
      it('their textContent is the title of their todos', function() {
        expect(this.todos[0].textContent.trim()).toEqual('Do something with it');
        expect(this.todos[1].textContent.trim()).toEqual('Profit!');
        expect(this.todos[2].textContent.trim()).toEqual('Build fxjs');
      });
    });

    describe('the !editing subDiv of the completed todo <li>', function() {
      describe('its checkbox', function() {
        it('should be checked', function() {
          var query =  todoLiQuery + '.completed > ' + notEditingQuery;
          var completedSubDiv = document.querySelector(query);
          var checkbox = completedSubDiv.querySelector('input[type="checkbox"]');
          expect(checkbox.checked).toEqual(true);
        });
      });
    });

    describe('the !editing subDiv of the active todo <li>s', function() {
      describe('their checkboxes', function() {
        it('should not be checked', function() {
          var query = todoLiQuery + ':not(.completed) > ' + notEditingQuery;
          var checkboxes = document.querySelectorAll(query + ' > input[type="checkbox"]');
          expect(checkboxes.length).toEqual(2);
          expect(checkboxes[0].checked).toEqual(false);
          expect(checkboxes[1].checked).toEqual(false);
        });
      });
    });
  });
});

// end todo list items

// toggle complete all

describe('checkbox for completing all todos', function() {
  beforeEach(function() {
    this.checkbox = document.querySelector('[fx-controller="toggleCompleteAll"]');
  });

  it('is not checked', function() {
    expect(this.checkbox.checked).toEqual(false);
  });

  it('is inserted in the correct order among its sibling(s)', function() {
    var previousSibling = this.checkbox.previousElementSibling;
    var nextSibling = this.checkbox.nextElementSibling;
    expect(previousSibling).toEqual(document.getElementById('todo-list'));
    expect(nextSibling).toBeNull();
  });
});

// end toggle complete all

// todo count

describe('todo count', function() {
  it('shows the correct number of tasks remaining and total number', function() {
    var todoCount = document.querySelector('[fx-controller="countTodos"]');
    expect(todoCount.textContent.trim()).toEqual('2 of 3 todos left');
  });
});

// end todo count

// button to clear completed:

describe('button to clear completed', function() {
  beforeEach(function() {
    this.button = document.querySelector('[fx-controller="clearCompleted"]');
  });

  it('is visible', function() {
    expect(this.button.style.display).toEqual('');
  });

  it('shows the correct total number of todos', function() {
    expect(this.button.textContent.trim()).toEqual('Clear completed 1');
  });
});

// end button to clear completed

// footer section

describe('footer section\'s child elements', function() {
  it('are in the correct order', function() {
    var children = document.getElementById('footer').children;
    expect(children[0]).toEqual(document.getElementById('todo-count'));
    expect(children[1]).toEqual(document.getElementById('filters'));
    expect(children[2]).toEqual(document.getElementById('clear-completed'));
  });
});

// end footer section
});
