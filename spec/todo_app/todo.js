var todos = fxjs.collection({
  title: '',
  completed: false,
  editing: false
}).addMembers(
  { title: 'Do something with it' },
  { title: 'Build fxjs', completed: true },
  { title: 'Profit!' }
);

todos.memberModel.aliasProperty('!completed', 'active');

fxjs.controller('newTodo', {
  acceptChanges: function(e) {
    this.createTodo(e, $(e.target).val());
  },
  acceptOrReject: function(e) {
    if(e.keyCode === 13) {
      this.acceptChanges.call(this, e);
    } else if(e.keyCode === 27) {
      $(e.target).val('');
    }
  },
  createTodo: function(e, title) {
    todos.addMembers({ title: title });
    $(e.target).val('');
  }
});

var listScope = { sort: 'completed' };

fxjs.controller('todoList', {
  todos: todos,
  listScope: listScope,
  editTodo: function(e, todo, index) {
    todo.set('editing', true);
    $(this[index]).find('input.edit').val(todo.title).focus();
  },
  acceptChanges: function(e, todo) {
    var inputVal = $(e.target).val();
    if(fxjs.isBlank(inputVal)) {
      todos.remove(todo);
    } else {
      todo.set({ title: inputVal, editing: false });
    }
  },
  acceptOrReject: function(e, todo) {
    if(e.which === 13) {
      this.acceptChanges(e, todo);
    } else if(e.keyCode === 27) {
      todo.set('editing', false);
    }
  },
  completeTodo: function(e, todo) {
    todo.set('completed', !todo.completed);
  },
  removeTodo: function(e, todo) {
    todos.remove(todo);
  }
}, todos);

fxjs.controller('toggleCompleteAll', {
  completeAll: function(e) {
    var completeAll = !todos.areAll('completed');
    todos.setAll('completed', completeAll);
  },
  allComplete: function() {
    return todos.areAll('completed');
  }
}, todos);

fxjs.controller('countTodos').watch(todos);

fxjs.controller('linkController', {
  'selected?': function() {
    var a = this.currElement;
    var hrefHash = /#\/.*/.exec(a.href)[0].replace(/#\//,'');
    if(location.hash.replace(/#\//,'') === hrefHash) return 'selected';
  }
}, fxjs.router);

fxjs.controller('clearCompleted', {
  'anyCompleted?': function() {
    return todos.areAny('completed');
  },
  clearAll: function(e, todo, index) {
    todos.scope({ filter: 'completed' }).forEach(function(todo) {
      todos.remove(todo);
    });
  }
}, todos);

fxjs.router.filter(listScope, '/:all', 'active', 'completed');
