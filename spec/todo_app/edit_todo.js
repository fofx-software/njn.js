describe('editing a todo', function() {
  var todoLis = document.getElementsByClassName('todo-li');
  var dblclick = new MouseEvent('dblclick');

  describe('when you double click on a todo title', function() {
    beforeAll(function() {
      var label = todoLis[2].getElementsByTagName('label')[0];
      label.dispatchEvent(dblclick);
    });

    it('its parent li\'s class changes to "editing"', function() {
      expect(todoLis[2].className).toMatch(/editing/);
    });

    it('its parent li\'s "editing" subdiv becomes visible', function() {
      var editingDiv = todoLis[2].getElementsByClassName('editing-subdiv')[0];
      expect(editingDiv.style.display).toBe('');
    });

    it('its parent li\'s "!editing" subdiv is hidden', function() {
      var notEditing = todoLis[2].getElementsByClassName('!editing-subdiv')[0];
      expect(notEditing.style.display).toBe('none');
    });

    afterAll(function() {
      todoLis[2].getElementsByClassName('edit')[0].dispatchEvent(new Event('blur'));
    });
  });

  describe('when you edit a todo\'s title', function() {
    describe('if you hit enter', function() {
      beforeAll(function() {
        var completedLabel = todoLis[4].getElementsByTagName('label')[0];
        var activeLabel = todoLis[2].getElementsByTagName('label')[0];

        completedLabel.dispatchEvent(new MouseEvent('dblclick'));
        activeLabel.dispatchEvent(new MouseEvent('dblclick'));

        var completedInput = todoLis[4].getElementsByClassName('edit')[0];
        var activeInput = todoLis[2].getElementsByClassName('edit')[0];

        completedInput.value = 'completed';
        activeInput.value = 'active';

        var pressEnter = new KeyboardEvent('keypress', { which: 13 });
        completedInput.dispatchEvent(pressEnter);
        activeInput.dispatchEvent(pressEnter);
      });

      describe('on a completed todo', function() {
        it('the editing subdiv becomes hidden', function() {
          var editingSubDiv = todoLis[4].getElementsByClassName('editing-subdiv')[0];
          expect(editingSubDiv.style.display).toBe('none');
        });

        it('the changes are saved', function() {
          var label = todoLis[4].getElementsByTagName('label')[0];
          expect(label.textContent.trim()).toBe('completed');
        });

        it('the todo\'s completion status is maintained', function() {
          expect(todoLis[4].className).toMatch(/completed/);
        });
      });

      describe('on an active todo', function() {
        it('the editing subdiv becomes hidden', function() {
          var editingSubDiv = todoLis[2].getElementsByClassName('editing-subdiv')[0];
          expect(editingSubDiv.style.display).toBe('none');
        });

        it('the changes are saved', function() {
          var label = todoLis[2].getElementsByTagName('label')[0];
          expect(label.textContent.trim()).toBe('active');
        });

        it('the todo\'s completion status is maintained', function() {
          expect(todoLis[2].className).not.toMatch(/completed/);
        });
      });
    });

    describe('if you blur', function() {
      beforeAll(function() {
        var completedLabel = todoLis[3].getElementsByTagName('label')[0];
        var activeLabel = todoLis[1].getElementsByTagName('label')[0];

        completedLabel.dispatchEvent(new MouseEvent('dblclick'));
        activeLabel.dispatchEvent(new MouseEvent('dblclick'));

        var completedInput = todoLis[3].getElementsByClassName('edit')[0];
        var activeInput = todoLis[1].getElementsByClassName('edit')[0];

        completedInput.value = 'also completed';
        activeInput.value = 'also active';

        var blur = new Event('blur');
        completedInput.dispatchEvent(blur);
        activeInput.dispatchEvent(blur);
      });

      describe('on a completed todo', function() {
        it('the editing subdiv becomes hidden', function() {
          var editingSubDiv = todoLis[3].getElementsByClassName('editing-subdiv')[0];
          expect(editingSubDiv.style.display).toBe('none');
        });

        it('the changes are saved', function() {
          var label = todoLis[3].getElementsByTagName('label')[0];
          expect(label.textContent.trim()).toBe('also completed');
        });

        it('the todo\'s completion status is maintained', function() {
          expect(todoLis[3].className).toMatch(/completed/);
        });
      });

      describe('on an active todo', function() {
        it('the editing subdiv becomes hidden', function() {
          var editingSubDiv = todoLis[1].getElementsByClassName('editing-subdiv')[0];
          expect(editingSubDiv.style.display).toBe('none');
        });

        it('the changes are saved', function() {
          var label = todoLis[1].getElementsByTagName('label')[0];
          expect(label.textContent.trim()).toBe('also active');
        });

        it('the todo\'s completion status is maintained', function() {
          expect(todoLis[1].className).not.toMatch(/completed/);
        });
      });
    });

    describe('if you hit escape', function() {
      var firstTodoLabel;

      beforeAll(function() {
        var label = todoLis[0].getElementsByTagName('label')[0];
        firstTodoLabel = label.textContent.trim();

        label.dispatchEvent(new MouseEvent('dblclick'));

        var editInput = todoLis[0].getElementsByClassName('edit')[0];
        editInput.value = 'won\'t save';

        var escapeEvent = new KeyboardEvent('keypress', { keyCode: 27 });
        editInput.dispatchEvent(escapeEvent);
      });

      it('the editing subdiv becomes hidden', function() {
        var editingSubDiv = todoLis[0].getElementsByClassName('editing-subdiv')[0];
        expect(editingSubDiv.style.display).toBe('none');
      });

      it('the changes are not saved', function() {
        var label = todoLis[0].getElementsByTagName('label')[0];
        expect(label.textContent.trim()).toBe(firstTodoLabel);
      });
    });

    describe('if the input field is empty and you submit', function() {
      beforeAll(function() {
      });

      it('the todo will be deleted', function() {
        expect(todoLis.length).toBe(5);

        var label = todoLis[2].getElementsByTagName('label')[0];

        label.dispatchEvent(new MouseEvent('dblclick'));

        var editInput = todoLis[2].getElementsByClassName('edit')[0];
        editInput.value = '';

        var enterEvent = new KeyboardEvent('keypress', { which: 13 });
        editInput.dispatchEvent(enterEvent);

        expect(todoLis.length).toBe(4);
      });
    });
  });
});
