describe('complete all checkbox', function() {

beforeAll(function() {
  this.todos = document.getElementsByClassName('todo-li');
  this.completeAll = function() { return document.getElementById('toggle-all'); }
});

describe('when all todos are not checked', function() {
  it('will not be checked', function() {
    expect(this.completeAll().checked).toBe(false);
    var click = new MouseEvent('click');
    this.todos[0].getElementsByClassName('toggle')[0].dispatchEvent(click);
    expect(this.completeAll().checked).toBe(false);
    this.todos[0].getElementsByClassName('toggle')[0].dispatchEvent(click);
    expect(this.completeAll().checked).toBe(false);
    this.todos[0].getElementsByClassName('toggle')[0].dispatchEvent(click);
    expect(this.completeAll().checked).toBe(false);
  });
});

describe('when all todos are checked', function() {
  it('will be checked', function() {
    var click = new MouseEvent('click');
    this.todos[0].getElementsByClassName('toggle')[0].dispatchEvent(click);
    expect(this.completeAll().checked).toBe(true);
  });
});

describe('when all todos are checked and one is unchecked', function() {
  it('will become unchecked', function() {
    var click = new MouseEvent('click');
    this.todos[2].getElementsByClassName('toggle')[0].dispatchEvent(click);
    expect(this.completeAll().checked).toBe(false);
  });
});

describe('when not all todos are checked and the completeAll checkbox is clicked', function() {
  it('the other checkboxes will become checked', function() {
    var click = new MouseEvent('click');
    this.todos[2].getElementsByClassName('toggle')[0].dispatchEvent(click);
    this.todos[3].getElementsByClassName('toggle')[0].dispatchEvent(click);
    expect(this.completeAll().checked).toBe(false);
    this.completeAll().dispatchEvent(click);
    expect(this.todos[0].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(this.todos[1].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(this.todos[2].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(this.todos[3].getElementsByClassName('toggle')[0].checked).toBe(true);
    expect(this.todos[4].getElementsByClassName('toggle')[0].checked).toBe(true);
  });
});

describe('when all todos are checked and the completeAll checkbox is clicked', function() {
  it('the other checkboxes will become unchecked', function() {
    var click = new MouseEvent('click');
    this.completeAll().dispatchEvent(click);
    expect(this.todos[0].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(this.todos[1].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(this.todos[2].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(this.todos[3].getElementsByClassName('toggle')[0].checked).toBe(false);
    expect(this.todos[4].getElementsByClassName('toggle')[0].checked).toBe(false);
  });
});

});
