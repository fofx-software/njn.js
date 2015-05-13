describe('each todo\'s checkbox', function() {

// live nodeList, will be updated as changes are made:
var todoLis = document.getElementsByClassName('todo-li');
var click = new MouseEvent('click');

describe('whether or not it\'s checked', function() {
  it('corresponds to whether the todo is completed', function() {
    todoLis[1].getElementsByClassName('toggle')[0].dispatchEvent(click);
    todoLis[3].getElementsByClassName('toggle')[0].dispatchEvent(click);

    expect(todoLis[0].className).not.toMatch(/completed/);
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[1].className).not.toMatch(/completed/);
    expect(todoLis[1].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[2].className).not.toMatch(/completed/);
    expect(todoLis[2].getElementsByClassName('toggle')[0].checked).toBe(false);

    expect(todoLis[3].className).toMatch(/completed/);
    expect(todoLis[3].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(todoLis[4].className).toMatch(/completed/);
    expect(todoLis[4].getElementsByClassName('toggle')[0].checked).toBe(true);
  });
});

describe('when unchecked from a checked state', function() {
  it('the todo is resorted to the end of the unchecked todos', function() {
    var lastTodo = todoLis[4];
    var lastCheckbox = lastTodo.getElementsByClassName('toggle')[0];
    expect(lastCheckbox.checked).toBe(true);
    lastCheckbox.dispatchEvent(click);

    // First 3 todoLis are active:
    expect(todoLis[0].className).not.toMatch(/completed/);
    expect(todoLis[1].className).not.toMatch(/completed/);
    expect(todoLis[2].className).not.toMatch(/completed/);

    // The one that was just unchecked, previously the last, is now the fourth:
    expect(todoLis[3].textContent).toBe(lastTodo.textContent);

    // The fifth todo is completed:
    expect(todoLis[4].className).toMatch(/completed/);
  });
});

describe('when checked from an unchecked state', function() {
  it('the todo is resorted to the end of the checked todos', function() {
    var secondTodo = todoLis[1];
    var secondCheckbox = secondTodo.getElementsByClassName('toggle')[0];
    expect(secondCheckbox.checked).toBe(false);
    secondCheckbox.dispatchEvent(click);

    // First 3 todoLis are active:
    expect(todoLis[0].className).not.toMatch(/completed/);
    expect(todoLis[1].className).not.toMatch(/completed/);
    expect(todoLis[2].className).not.toMatch(/completed/);

    // Fourth todoLi is completed:
    expect(todoLis[3].className).toMatch(/completed/);

    // The one that was just checked, previously the second, is now the fifth:
    expect(todoLis[4].textContent).toBe(secondTodo.textContent);
  });
});

});
