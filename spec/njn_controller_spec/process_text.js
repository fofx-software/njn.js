describe('processText()', function() {
  var processText = __njn_controller_utilities__.processText;

  describe('when given a string without interpolators', function() {
    it('returns the string', function() {
      expect(processText('hello world')).toBe('hello world');
    });
  });

  describe('when given a string with interpolators', function() {
    it('returns the result of replacing each interpolator with the result of resolving its property reference in the given object', function() {
      var processed = processText('my name is {{name}} and I am a {{career}}', [{ name: 'Joe', career: 'programmer' }]);
      expect(processed).toBe('my name is Joe and I am a programmer');
    });

    describe('when any of the interpolators resolves to a function', function() {
      it('replaces the interpolator with the result of calling the function on the given object', function() {
        var processed = processText('I am {{age}} years old', [{ birthyear: 1983, age: function() { return 2015 - this.birthyear; } }]);
        expect(processed).toBe('I am 32 years old');
      });
    });

    describe('when any of the interpolators begins with a bang', function() {
      it('replaces the interpolator with the negation of its resolution', function() {
        var processed = processText('it is {{!bool}}', [{ bool: true }]);
        expect(processed).toBe('it is false');
      });
    });

    describe('when any of the interpolators returns an HTMLElement', function() {
      it('replaces the interpolator with the element\'s outerHTML', function() {
        var b = document.createElement('b');
        b.textContent = 'hello world';
        var processed = processText('{{b}}, I say', [{ b: b }]);
        expect(processed).toBe('<b>hello world</b>, I say');
      });
    });
  });

  describe('when given a string with html inside double brackets', function() {
    it('escapes the html', function() {
      var processed = processText('[[<div></div>]]');
      expect(processed).toBe('[[&lt;div&gt;&lt;/div&gt;]]');
    });
  });
});
