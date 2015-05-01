var todos = fxjs.collection('todos', {
  title: '',
  completed: false,
  editing: false
}).addMembers(
  { title: 'Build f(js)', completed: true },
  { title: 'Do something with it' },
  { title: 'Profit!' }
).defAlias('active', '!completed')
 .defScope('listScope', { sort: 'completed' });

//fxjs.controller('newTodo', {
//  acceptChanges: function(e) {
//    var inputVal = $(e.target).val();
//    if(fxjs.isBlank(inputVal)) {
//      this.cancelChanges(e);
//    } else {
//      this.createTodo(e, inputVal);
//    }
//  },
//  cancelChanges: function(e) {
//    $(e.target).val('');
//  },
//  acceptOrReject: function(e) {
//    if(e.which === 13) {
//      this.acceptChanges(e);
//    } else if(e.keyCode === 27) {
//      this.cancelChanges();
//    }
//  },
//  createTodo: function(e, title) {
//    todos.addMembers({ title: title });
//    this.cancelChanges(e);
//  }
//});

fxjs.controller('todoList', {
  editTodo: function(e, todo, index) {
    todo.set('editing', true);
    this.getNode(index).find('input.edit').val(todo.title).focus();
  },
  acceptChanges: function(e, todo) {
    var inputVal = $(e.target).val();
    if(fxjs.isBlank(inputVal)) {
      todo.delete();
    } else {
      todo.set('title', inputVal);
      todo.set('editing', false);
    }
  },
  acceptOrReject: function(e, todo) {
    if(e.which === 13) {
      this.acceptChanges(e, todo);
    } else if(e.keyCode === 27) {
      todo.set('editing', false);
    }
  },
}).list('todos', 'listScope');

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

fxjs.router.filter(todos.scopes.listScope, ':all', 'active', 'completed');
