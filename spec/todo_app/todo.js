var todos = fxjs.collection({
  title: '',
  completed: false,
  editing: false
}).addMembers(
  { title: 'Do something with it' },
  { title: 'Build fxjs', completed: true },
  { title: 'Profit!' }
)

todos.memberModel.aliasProperty('!completed', 'active');

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

var listScope = { sort: 'completed' };

fxjs.controller('todoList', {
  todos: todos,
  listScope: listScope,
  editTodo: function(e, todo, index) {
    todo.editing = true;
    todos.broadcastChange();
    $(this[index]).find('input.edit').val(todo.title).focus();
    // return function() {
    //   $(this[index]).find('input.edit').val(todo.title).focus();
    // }
  },
  acceptChanges: function(e, todo) {
    var inputVal = $(e.target).val();
    if(fxjs.isBlank(inputVal)) {
      todos.remove(todo);
      todos.broadcastChange();
    } else {
      todo.title = inputVal;
      todo.editing = false;
      todos.broadcastChange();
    }
  },
  acceptOrReject: function(e, todo) {
    if(e.which === 13) {
      this.actions.acceptChanges(e, todo);
    } else if(e.keyCode === 27) {
      todo.editing = false;
      todos.broadcastChange();
    }
  },
  completeTodo: function(e, todo) {
    todo.completed = !todo.completed;
    todos.broadcastChange();
  },
  removeTodo: function(e, todo) {
    todos.remove(todo);
    todos.broadcastChange();
  }
}).watch(todos);

fxjs.controller('toggleCompleteAll', {
  completeAll: function(e) {
    var completeAll = !todos.areAll('completed');
    todos.setAll('completed', completeAll);
    todos.broadcastChange();
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
    todos.scope({ filter: 'completed' }).forEach(function(todo) {
      todos.remove(todo);
      todos.broadcastChange();
    });
  }
}).watch(todos);

fxjs.router.filter(listScope, '/:all', 'active', 'completed');
