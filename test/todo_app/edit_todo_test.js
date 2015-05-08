describe('editing a todo', function() {
  beforeAll(function() {
    this.todos = document.getElementById('todo-list').getElementsByTagName('li');
  });

  describe('when you double click on a todo title', function() {
    beforeAll(function() {
      var dblclick = new MouseEvent('dblclick');
      var label = this.todos[2].getElementsByTagName('label')[0]
      label.dispatchEvent(dblclick);
    });

    it('its parent li\'s class changes to "editing"', function() {
      expect(this.todos[2].className).toEqual('editing');
    });

    it('its parent li\'s "editing" subdiv becomes visible', function() {
      var editingDiv = this.todos[2].querySelector('div[fx-toggle-display=editing]');
      expect(editingDiv.style.display).toEqual('');
    });

    it('its parent li\'s "!editing" subdiv is hidden', function() {
      var notEditing = this.todos[2].querySelector('div[fx-toggle-display="!editing"]');
      expect(notEditing.style.display).toEqual('none');
    });

    afterAll(function() {
      this.todos[2].querySelector('div > input.edit').dispatchEvent(new Event('blur'));
    });
  });

  describe('when you begin to edit a todo\'s title', function() {
    beforeAll(function() {
      var dblclick = new MouseEvent('dblclick');
      var label = this.todos[4].getElementsByTagName('label')[0]
      label.dispatchEvent(dblclick);
      this.editInput = this.todos[4].querySelector('div > input.edit');
      this.editInput.value = "a";
    });

    describe('if you hit enter', function() {
      beforeAll(function() {
        this.editInput.dispatchEvent(new KeyboardEvent('keypress', { which: 13 }));
      });

      it('saves the changes', function() {
        
      });
    });
  });
});
