describe('each todo\'s checkbox', function() {

beforeAll(function() {
  this.todos = document.getElementById('todo-list').getElementsByTagName('li');
});

describe('whether or not it\'s checked', function() {
  beforeEach(function() {
    var click = new MouseEvent('click');
    this.todos[1].querySelector('input[type="checkbox"]').dispatchEvent(click);
    this.todos[3].querySelector('input[type="checkbox"]').dispatchEvent(click);
  });

  it('corresponds to whether the todo is completed', function() {
    for(var i = 0; i < 5; i++) {
      var checkbox = this.todos[i].querySelector('input[type="checkbox"]');
      expect(checkbox.checked).toEqual(/completed/.test(this.todos[i].className));
    }
  });
});

describe('when unchecked from a checked state', function() {
  beforeEach(function() {
    this.lastTodo = this.todos[4];
    this.lastCheckbox = this.lastTodo.querySelector('input[type="checkbox"]');
  });

  describe('initially', function() {
    it('is checked', function() {
      expect(this.lastCheckbox.checked).toEqual(true);
    });
  });

  describe('after you uncheck it', function() {
    it('the todo is resorted to be among the unchecked todos', function() {
      this.lastCheckbox.dispatchEvent(new MouseEvent('click'));
      expect(this.todos[3].textContent).toEqual(this.lastTodo.textContent);
    });
  });
});

describe('when checked from an unchecked state', function() {
  beforeEach(function() {
    this.secondTodo = this.todos[1];
    this.secondCheckbox = this.secondTodo.querySelector('input[type="checkbox"]');
  });

  describe('initially', function() {
    it('it is not checked', function() {
      expect(this.secondCheckbox.checked).toEqual(false);
    });
  });

  describe('after you check it', function() {
    it('the todo is resorted to be among the checked todos', function() {
      this.secondCheckbox.dispatchEvent(new MouseEvent('click'));
      expect(this.todos[3].textContent).toEqual(this.secondTodo.textContent);
    });
  });
});

});
