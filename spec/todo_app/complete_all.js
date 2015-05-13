describe('complete all checkbox', function() {

var todoLis = document.getElementsByClassName('todo-li');;
var completeAll = function() { return document.getElementById('toggle-all'); }
var click = new MouseEvent('click');

describe('when all todos are not checked', function() {
  it('will not be checked', function() {
    // Initially, completeAll is not checked:
    expect(completeAll().checked).toBe(false);

    // Just to keep track, there are five todos:
    expect(todoLis.length).toBe(5);

    // The fifth todo is already completed:
    expect(todoLis[4].getElementsByClassName('toggle')[0].checked).toBe(true);

    // First todo is active:
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    // Now we check it:
    todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(click);
    // completeAll is still not checked:
    expect(completeAll().checked).toBe(false);

    // Second todo (now first) is active:
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    // Now we check it:
    todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(click);
    // completeAll is still not checked:
    expect(completeAll().checked).toBe(false);

    // Third todo (now first) is active:
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    // Now we check it:
    todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(click);
    // completeAll is still not checked:
    expect(completeAll().checked).toBe(false);

    // Fourth todo (now first) is still active:
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    // completeAll is still not checked:
    expect(completeAll().checked).toBe(false);
  });
});

describe('when all todos are checked', function() {
  it('will be checked', function() {
    // Only one todo is still active (see above):
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    // Now we check it:
    todoLis[0].getElementsByClassName('toggle')[0].dispatchEvent(click);
    // Now completeAll is checked:
    expect(completeAll().checked).toBe(true);
  });
});

describe('when all todos are checked and one is unchecked', function() {
  it('will become unchecked', function() {
    // At first, completeAll is checked (see above):
    expect(completeAll().checked).toBe(true);
    // Now we uncheck one todo:
    todoLis[2].getElementsByClassName('toggle')[0].dispatchEvent(click);
    // Now, completeAll is unchecked:
    expect(completeAll().checked).toBe(false);
  });
});

describe('when not all todos are checked and the completeAll() checkbox is clicked', function() {
  it('the other checkboxes will become checked', function() {
    // All todos are checked (see above), so we uncheck two:
    todoLis[2].getElementsByClassName('toggle')[0].dispatchEvent(click);
    todoLis[3].getElementsByClassName('toggle')[0].dispatchEvent(click);

    // completeAllis now unchecked:
    expect(completeAll().checked).toBe(false);
    // We click it:
    completeAll().dispatchEvent(click);

    // All todos are now checked:
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(todoLis[1].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(todoLis[2].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(todoLis[3].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(todoLis[4].getElementsByClassName('toggle')[0].checked).toBe(true);
  });
});

describe('when all todos are checked and the completeAll() checkbox is clicked', function() {
  it('the other checkboxes will become unchecked', function() {
    completeAll().dispatchEvent(click);
    expect(todoLis[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[1].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[2].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[3].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(todoLis[4].getElementsByClassName('toggle')[0].checked).toBe(false);
  });
});

});
