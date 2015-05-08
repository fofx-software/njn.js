describe('complete all checkbox', function() {

beforeEach(function() {
  this.todos = document.getElementById('todo-list').getElementsByTagName('li');
  this.completeAll = function() { return document.getElementById('toggle-all'); }
});

describe('when all todos are not checked', function() {
  it('will not be checked', function() {
    expect(this.completeAll().checked).toEqual(false);
    var click = new MouseEvent('click');
    this.todos[0].querySelector('input[type="checkbox"]').dispatchEvent(click);
    expect(this.completeAll().checked).toEqual(false);
    this.todos[0].querySelector('input[type="checkbox"]').dispatchEvent(click);
    expect(this.completeAll().checked).toEqual(false);
    this.todos[0].querySelector('input[type="checkbox"]').dispatchEvent(click);
    expect(this.completeAll().checked).toEqual(false);
  });
});

describe('when all todos are checked', function() {
  it('will be checked', function() {
    var click = new MouseEvent('click');
    this.todos[0].querySelector('input[type="checkbox"]').dispatchEvent(click);
    expect(this.completeAll().checked).toEqual(true);
  });
});

describe('when all todos are checked and one is unchecked', function() {
  it('will become unchecked', function() {
    var click = new MouseEvent('click');
    this.todos[2].querySelector('input[type="checkbox"]').dispatchEvent(click);
    expect(this.completeAll().checked).toEqual(false);
  });
});

describe('when not all todos are checked and the completeAll checkbox is clicked', function() {
  it('the other checkboxes will become checked', function() {
    var click = new MouseEvent('click');
    this.todos[2].querySelector('input[type="checkbox"]').dispatchEvent(click);
    this.todos[3].querySelector('input[type="checkbox"]').dispatchEvent(click);
    expect(this.completeAll().checked).toEqual(false);
    this.completeAll().dispatchEvent(click);
    expect(this.todos[0].querySelector('input[type="checkbox"]').checked).toEqual(true);
    expect(this.todos[1].querySelector('input[type="checkbox"]').checked).toEqual(true);
    expect(this.todos[2].querySelector('input[type="checkbox"]').checked).toEqual(true);
    expect(this.todos[3].querySelector('input[type="checkbox"]').checked).toEqual(true);
    expect(this.todos[4].querySelector('input[type="checkbox"]').checked).toEqual(true);
  });
});

describe('when all todos are checked and the completeAll checkbox is clicked', function() {
  it('the other checkboxes will become unchecked', function() {
    var click = new MouseEvent('click');
    this.completeAll().dispatchEvent(click);
    expect(this.todos[0].querySelector('input[type="checkbox"]').checked).toEqual(false);
    expect(this.todos[1].querySelector('input[type="checkbox"]').checked).toEqual(false);
    expect(this.todos[2].querySelector('input[type="checkbox"]').checked).toEqual(false);
    expect(this.todos[3].querySelector('input[type="checkbox"]').checked).toEqual(false);
    expect(this.todos[4].querySelector('input[type="checkbox"]').checked).toEqual(false);
  });
});

});
