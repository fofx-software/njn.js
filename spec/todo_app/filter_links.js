describe('filter links', function() {
  var todoLis, showAll, showCompleted, showActive;

  beforeAll(function() {
    var newTodo = document.getElementById('new-todo');
    for(var i = 0; i < 3; i ++) {
      newTodo.value = 'todo ' + i;
      newTodo.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
    }
    var todoLs = document.getElementsByClassName('todo-li');
    todoLs[2].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
    todoLs[2].getElementsByClassName('toggle')[0].dispatchEvent(new MouseEvent('click'));
  });

  beforeEach(function() {
    todoLis = document.getElementsByClassName('todo-li');
    showAll = document.getElementById('show-all');
    showCompleted = document.getElementById('show-completed');
    showActive = document.getElementById('show-active');
  });

  describe('initially', function() {
    it('show-all is selected', function() {
      expect(showAll.className).toMatch(/selected/);
    });
  });

  describe('when you click show-completed', function() {
    beforeAll(function() {
      showCompleted.dispatchEvent(new MouseEvent('click'));
    });

    it('the view is refreshed to show only completed todos', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === 'completed') {
          expect(todoLis.length).toBe(2);
          expect(todoLis[0].className).toMatch(/completed/);
          expect(todoLis[1].className).toMatch(/completed/);
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });

    it('the show-completed link is marked selected', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === 'completed') {
          expect(showCompleted.className).toMatch(/selected/);
          expect(showAll.className).not.toMatch(/selected/);
          expect(showActive.className).not.toMatch(/selected/);
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });
  });

  describe('when you click show-active', function() {
    beforeAll(function() {
      showActive.dispatchEvent(new MouseEvent('click'));
    });

    it('the view is refreshed to show only active todos', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === 'active') {
          expect(todoLis.length).toBe(2);
          expect(todoLis[0].className).not.toMatch(/completed/);
          expect(todoLis[1].className).not.toMatch(/completed/);
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });

    it('the show-active link is marked selected', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === 'active') {
          expect(showActive.className).toMatch(/selected/);
          expect(showCompleted.className).not.toMatch(/selected/);
          expect(showAll.className).not.toMatch(/selected/);
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });

    it('the clear completed button is not hidden', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === 'active') {
          var clearCompleted = document.getElementById('clear-completed');
          expect(clearCompleted.style.display).toBe('');
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });
  });

  describe('when you click show-all', function() {
    beforeAll(function() {
      showAll.dispatchEvent(new MouseEvent('click'));
    });

    it('the view is refreshed to show all todos', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === '') {
          expect(todoLis.length).toBe(4);
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });

    it('the show-all link is marked selected', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === '') {
          expect(showAll.className).toMatch(/selected/);
          expect(showActive.className).not.toMatch(/selected/);
          expect(showCompleted.className).not.toMatch(/selected/);
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });
  });

  describe('when you\'re in show-active and you complete a todo', function() {
    beforeAll(function() {
      showActive.dispatchEvent(new MouseEvent('click'));
    });

    it('the todo should disappear', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === 'active') {
          expect(todoLis.length).toBe(2);
          var checkbox = todoLis[0].getElementsByClassName('toggle')[0];
          checkbox.dispatchEvent(new MouseEvent('click'));
          expect(todoLis.length).toBe(1);
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });
  });

  describe('when you\'re in show-completed and you uncomplete a todo', function() {
    beforeAll(function() {
      showCompleted.dispatchEvent(new MouseEvent('click'));
    });

    it('the todo should disappear', function(done) {
      setTimeout(function checkHash() {
        if(fxjs.router.currentLocation === 'completed') {
          expect(todoLis.length).toBe(3);
          var checkbox = todoLis[0].getElementsByClassName('toggle')[0];
          checkbox.dispatchEvent(new MouseEvent('click'));
          expect(todoLis.length).toBe(2);
          done();
        } else {
          setTimeout(checkHash, 5);
        }
      }, 5);
    });
  });

  afterAll(function() {
    showAll.dispatchEvent(new MouseEvent('click'));
  });

});
