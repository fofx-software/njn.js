describe('editing a todo', function() {
  beforeAll(function() {
    this.todos = document.getElementsByClassName('todo-li');
  });

  describe('when you double click on a todo title', function() {
    beforeAll(function() {
      var dblclick = new MouseEvent('dblclick');
      var label = this.todos[2].getElementsByTagName('label')[0];
      label.dispatchEvent(dblclick);
    });

    it('its parent li\'s class changes to "editing"', function() {
      expect(this.todos[2].className).toMatch(/editing/);
    });

    it('its parent li\'s "editing" subdiv becomes visible', function() {
      var editingDiv = this.todos[2].getElementsByClassName('editing-subdiv')[0];
      expect(editingDiv.style.display).toBe('');
    });

    it('its parent li\'s "!editing" subdiv is hidden', function() {
      var notEditing = this.todos[2].getElementsByClassName('!editing-subdiv')[0];
      expect(notEditing.style.display).toBe('none');
    });

    afterAll(function() {
      this.todos[2].getElementsByClassName('edit')[0].dispatchEvent(new Event('blur'));
    });
  });

  describe('when you edit a todo\'s title', function() {
    describe('if you hit enter', function() {
      beforeAll(function() {
        var completedLabel = this.todos[4].getElementsByTagName('label')[0];
        var activeLabel = this.todos[2].getElementsByTagName('label')[0];

        completedLabel.dispatchEvent(new MouseEvent('dblclick'));
        activeLabel.dispatchEvent(new MouseEvent('dblclick'));

        var completedInput = this.todos[4].getElementsByClassName('edit')[0];
        var activeInput = this.todos[2].getElementsByClassName('edit')[0];

        completedInput.value = 'completed';
        activeInput.value = 'active';

        var blur = new KeyboardEvent('keypress', { which: 13 });
        completedInput.dispatchEvent(blur);
        activeInput.dispatchEvent(blur);
      });

      describe('on a completed todo', function() {
        it('the editing subdiv becomes hidden', function() {
          var editingSubDiv = this.todos[4].getElementsByClassName('editing-subdiv')[0];
          expect(editingSubDiv.style.display).toBe('none');
        });

        it('the changes are saved', function() {
          var label = this.todos[4].getElementsByTagName('label')[0];
          expect(label.textContent.trim()).toBe('completed');
        });

        it('the todo\'s completion status is maintained', function() {
          expect(this.todos[4].className).toMatch(/completed/);
        });
      });

      describe('on an active todo', function() {
        it('the editing subdiv becomes hidden', function() {
          var editingSubDiv = this.todos[2].getElementsByClassName('editing-subdiv')[0];
          expect(editingSubDiv.style.display).toBe('none');
        });

        it('the changes are saved', function() {
          var label = this.todos[2].getElementsByTagName('label')[0];
          expect(label.textContent.trim()).toBe('active');
        });

        it('the todo\'s completion status is maintained', function() {
          expect(this.todos[2].className).not.toMatch(/completed/);
        });
      });
    });

    describe('if you blur', function() {
      beforeAll(function() {
        var completedLabel = this.todos[3].getElementsByTagName('label')[0];
        var activeLabel = this.todos[1].getElementsByTagName('label')[0];

        completedLabel.dispatchEvent(new MouseEvent('dblclick'));
        activeLabel.dispatchEvent(new MouseEvent('dblclick'));

        var completedInput = this.todos[3].getElementsByClassName('edit')[0];
        var activeInput = this.todos[1].getElementsByClassName('edit')[0];

        completedInput.value = 'also completed';
        activeInput.value = 'also active';

        var blur = new Event('blur');
        completedInput.dispatchEvent(blur);
        activeInput.dispatchEvent(blur);
      });

      describe('on a completed todo', function() {
        it('the editing subdiv becomes hidden', function() {
          var editingSubDiv = this.todos[3].getElementsByClassName('editing-subdiv')[0];
          expect(editingSubDiv.style.display).toBe('none');
        });

        it('the changes are saved', function() {
          var label = this.todos[3].getElementsByTagName('label')[0];
          expect(label.textContent.trim()).toBe('also completed');
        });

        it('the todo\'s completion status is maintained', function() {
          expect(this.todos[3].className).toMatch(/completed/);
        });
      });

      describe('on an active todo', function() {
        it('the editing subdiv becomes hidden', function() {
          var editingSubDiv = this.todos[1].getElementsByClassName('editing-subdiv')[0];
          expect(editingSubDiv.style.display).toBe('none');
        });

        it('the changes are saved', function() {
          var label = this.todos[1].getElementsByTagName('label')[0];
          expect(label.textContent.trim()).toBe('also active');
        });

        it('the todo\'s completion status is maintained', function() {
          expect(this.todos[1].className).not.toMatch(/completed/);
        });
      });
    });

    describe('if you hit escape', function() {
      beforeAll(function() {
        var label = this.todos[0].getElementsByTagName('label')[0];

        label.dispatchEvent(new MouseEvent('dblclick'));

        var editInput = this.todos[0].getElementsByClassName('edit')[0];
        editInput.value = 'won\'t save';

        var escapeEvent = new KeyboardEvent('keypress', { keyCode: 27 });
        editInput.dispatchEvent(escapeEvent);
      });

      it('the editing subdiv becomes hidden', function() {
        var editingSubDiv = this.todos[0].getElementsByClassName('editing-subdiv')[0];
        expect(editingSubDiv.style.display).toBe('none');
      });

      it('the changes are not saved', function() {
        var label = this.todos[0].getElementsByTagName('label')[0];
        expect(label.textContent.trim()).toBe('Profit!');
      });
    });

    describe('if the input field is empty and you submit', function() {
      beforeAll(function() {
        var label = this.todos[2].getElementsByTagName('label')[0];

        label.dispatchEvent(new MouseEvent('dblclick'));

        var editInput = this.todos[2].getElementsByClassName('edit')[0];
        editInput.value = '';

        var enterEvent = new KeyboardEvent('keypress', { which: 13 });
        editInput.dispatchEvent(enterEvent);
      });

      it('the todo will be deleted', function() {
        expect(this.todos.length).toBe(4);
      });
    });
  });
});
