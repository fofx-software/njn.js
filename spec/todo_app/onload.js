describe('page on load:', function() {

// todo list items:

describe('todo list items:', function() {
  beforeAll(function() {
    this.todos = document.getElementsByClassName('todo-li');
  });

  it('there are three.', function() {
    expect(this.todos.length).toBe(3);
  });

  describe('the completed one:', function() {
    beforeAll(function() {
      this.completed = document.getElementsByClassName('todo-li completed');
    });

    it('there is one.', function() {
      expect(this.completed.length).toBe(1);
    });

    it('its class matches "completed".', function() {
      expect(this.completed[0].className).toMatch(/completed/);
    });

    it('it is the last of the <li>s', function() {
      expect(this.completed[0].nextElementSibling).toBeNull();
    });
  });

  describe('tasks in editing:', function() {
    beforeAll(function() {
      this.editing = document.getElementsByClassName('todo-li editing');
    });

    it('there are none', function() {
      expect(this.editing.length).toBe(0);
    });
  });

  describe('editing subDivs:', function() {
    beforeAll(function() {
      this.editingSubDivs = document.getElementsByClassName('editing-subdiv');
    });

    it('there are three', function() {
      expect(this.editingSubDivs.length).toBe(3);
    });

    it('they are not displayed', function() {
      var allDisplayNone = true;
      for(var i = 0; i < this.editingSubDivs.length; i++) {
        var thisDisplay = this.editingSubDivs[i].style.display === 'none';
        allDisplayNone = allDisplayNone && thisDisplay;
      }
      expect(allDisplayNone).toBe(true);
    });
  });

  describe('not editing subdivs', function() {
    beforeEach(function() {
      this.notEditingSubDivs = document.getElementsByClassName("!editing-subdiv");
    });

    it('there are three', function() {
      expect(this.notEditingSubDivs.length).toBe(3);
    });

    it('they are displayed', function() {
      var allDisplayed = true;
      for(var i = 0; i < this.notEditingSubDivs.length; i++) {
        var thisDisplay = this.notEditingSubDivs[i].style.display === '';
        allDisplayed = allDisplayed && thisDisplay;
      }
      expect(allDisplayed).toBe(true);
    });

    describe('their <label> elements', function() {
      it('their textContent is the title of their todos', function() {
        expect(this.todos[0].textContent.trim()).toBe('Do something with it');
        expect(this.todos[1].textContent.trim()).toBe('Profit!');
        expect(this.todos[2].textContent.trim()).toBe('Build fxjs');
      });
    });

    describe('the !editing subDiv of the completed todo <li>', function() {
      describe('its checkbox', function() {
        it('should be checked', function() {
          var completedSubDiv = document.querySelector('.todo-li.completed > [class="!editing-subdiv"]');
          var checkbox = completedSubDiv.getElementsByClassName('toggle')[0];
          expect(checkbox.checked).toBe(true);
        });
      });
    });

    describe('the !editing subDiv of the active todo <li>s', function() {
      describe('their checkboxes', function() {
        it('should not be checked', function() {
          var query = '[class=todo-li] > [class="!editing-subdiv"] > .toggle';
          var checkboxes = document.querySelectorAll(query);
          expect(checkboxes.length).toEqual(2);
          expect(checkboxes[0].checked).toBe(false);
          expect(checkboxes[1].checked).toBe(false);
        });
      });
    });
  });
});

// end todo list items

// toggle complete all

describe('checkbox for completing all todos', function() {
  it('is not checked', function() {
    var checkbox = document.getElementById('toggle-all');
    expect(checkbox.checked).toBe(false);
  });
});

// end toggle complete all

// todo count

describe('todo count', function() {
  it('shows the correct number of tasks remaining and total number', function() {
    var todoCount = document.getElementById('todo-count');
    expect(todoCount.textContent.trim()).toBe('2 of 3 todos left');
  });
});

// end todo count

// button to clear completed:

describe('button to clear completed', function() {
  beforeAll(function() {
    this.button = document.getElementById('clear-completed');
  });

  it('is visible', function() {
    expect(this.button.style.display).toBe('');
  });

  it('shows the correct total number of todos', function() {
    expect(this.button.textContent.trim()).toBe('Clear completed 1');
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
