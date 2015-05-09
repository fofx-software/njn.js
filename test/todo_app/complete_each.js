describe('each todo\'s checkbox', function() {

beforeAll(function() {
  this.todos = document.getElementsByClassName('todo-li');
});

describe('whether or not it\'s checked', function() {
  beforeAll(function() {
    var click = new MouseEvent('click');
    this.todos[1].querySelector('input[type="checkbox"]').dispatchEvent(click);
    this.todos[3].querySelector('input[type="checkbox"]').dispatchEvent(click);
  });

  it('corresponds to whether the todo is completed', function() {
    expect(this.todos[0].className).not.toMatch(/completed/);
    expect(this.todos[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(this.todos[1].className).not.toMatch(/completed/);
    expect(this.todos[1].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(this.todos[2].className).not.toMatch(/completed/);
    expect(this.todos[2].getElementsByClassName('toggle')[0].checked).toBe(false);

    expect(this.todos[3].className).toMatch(/completed/);
    expect(this.todos[3].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(this.todos[4].className).toMatch(/completed/);
    expect(this.todos[4].getElementsByClassName('toggle')[0].checked).toBe(true);
  });
});

describe('when unchecked from a checked state', function() {
  beforeAll(function() {
    this.lastTodo = this.todos[4];
    this.lastCheckbox = this.lastTodo.getElementsByClassName('toggle')[0];
  });

  describe('initially', function() {
    it('it is checked', function() {
      expect(this.lastCheckbox.checked).toBe(true);
    });
  });

  describe('after you uncheck it', function() {
    it('the todo is resorted to be among the unchecked todos', function() {
      this.lastCheckbox.dispatchEvent(new MouseEvent('click'));
      expect(this.todos[3].textContent).toBe(this.lastTodo.textContent);
    });
  });
});

describe('when checked from an unchecked state', function() {
  beforeAll(function() {
    this.secondTodo = this.todos[1];
    this.secondCheckbox = this.secondTodo.getElementsByClassName('toggle')[0];
  });

  describe('initially', function() {
    it('it is not checked', function() {
      expect(this.secondCheckbox.checked).toBe(false);
    });
  });

  describe('after you check it', function() {
    it('the todo is resorted to be among the checked todos', function() {
      this.secondCheckbox.dispatchEvent(new MouseEvent('click'));
      expect(this.todos[3].textContent).toBe(this.secondTodo.textContent);
    });
  });
});

});
