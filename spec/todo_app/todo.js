var todos = fxjs.collection('todos', {
  title: '',
  completed: false,
  editing: false
}).addMembers(
  { title: 'Do something with it' },
  { title: 'Build fxjs', completed: true },
  { title: 'Profit!' }
).defineScope('listScope', { sort: 'completed' })
 .aliasScope('active', '!completed');

fxjs.controller('newTodo', {
  acceptChanges: function(e) {
    this.actions.createTodo(e, $(e.target).val());
  },
  acceptOrReject: function(e) {
    if(e.keyCode === 13) {
      this.actions.acceptChanges.call(this, e);
    } else if(e.keyCode === 27) {
      $(e.target).val('');
    }
  },
  createTodo: function(e, title) {
    todos.addMembers({ title: title });
    $(e.target).val('');
  }
}).init();

fxjs.controller('todoList', {
  editTodo: function(e, todo, index) {
    todo.set('editing', true);
    $(this[index]).find('input.edit').val(todo.title).focus();
  },
  acceptChanges: function(e, todo) {
    var inputVal = $(e.target).val();
    if(fxjs.isBlank(inputVal)) {
      todo.remove();
    } else {
      todo.set('title', inputVal);
      todo.set('editing', false);
    }
  },
  acceptOrReject: function(e, todo) {
    if(e.which === 13) {
      this.actions.acceptChanges(e, todo);
    } else if(e.keyCode === 27) {
      todo.set('editing', false);
    }
  },
}).list(todos, 'listScope');

fxjs.controller('toggleCompleteAll', {
  completeAll: function(e) {
    var completeAll = !todos.areAll('completed');
    todos.setAll('completed', completeAll);
  },
  allComplete: function() {
    return todos.areAll('completed');
  }
}).watch(todos);

fxjs.controller('countTodos').watch(todos);

fxjs.controller('linkController', {
  'selected?': function(a) {
    var hrefHash = /#\/.*/.exec(a.href)[0].replace(/#\//,'');
    if(location.hash.replace(/#\//,'') === hrefHash) return 'selected';
  }
}).watch(fxjs.router);

fxjs.controller('clearCompleted', {
  'anyCompleted?': function() {
    return todos.areAny('completed');
  },
  clearAll: function(e, todo, index) {
    todos.scoped('completed').forEach(function(todo) {
      todo.remove();
    });
  }
}).watch(todos);

fxjs.router.filter(todos.scopes.listScope, ':all', 'active', 'completed');
