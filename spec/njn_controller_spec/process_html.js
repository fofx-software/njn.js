describe('processHTML()', function() {
  var controller = njn.controller();

  var resolveIn = {
    className: 'p-class',
    textContent: 'hello world',
    innerInterpolator: '{{textContent}}'
  };

  describe('when given an HTMLElement', function() {
    var p = document.createElement('p');
    p.className = '{{className}}';
    p.textContent = '{{textContent}}';
    it('returns the HTMLElement\'s processed outerHTML', function() {
      var processed = controller.processHTML(p, resolveIn);
      expect(processed).toBe('<p class="p-class">hello world</p>');
    });
  });

  describe('when given an html string', function() {
    it('works the same way', function() {
      var processed = controller.processHTML('<p class="{{className}}">{{textContent}}</p>', resolveIn);
      expect(processed).toBe('<p class="p-class">hello world</p>');
    });
  });

  describe('when given a string containing text outside of an element', function() {
    it('processes and returns all text and elements', function() {
      var processed = controller.processHTML('{{textContent}}<p>{{innerInterpolator}}</p>hello!', resolveIn);
      expect(processed).toBe('hello world<p>hello world</p>hello!');
    });
  });

  describe('when it contains an interpolator that returns an interpolator', function() {
    it('continues processing until all interpolators are resolved', function() {
      var processed = controller.processHTML('<p>{{innerInterpolator}}</p>', resolveIn);
      expect(processed).toBe('<p>hello world</p>');
    });
  });

  describe('when it contains an escaped interpolator', function() {
    it('does not process the interpolator, but strips extra braces', function() {
      var processed = controller.processHTML('<p>{{innerInterpolator}}{{falseInterpolator}}}</p>', resolveIn);
      expect(processed).toBe('<p>hello world{{falseInterpolator}}</p>');
    });
  });

  describe('when it contains html within double brackets', function() {
    it('does not append the html, and finally strips the brackets', function() {
      var processed = controller.processHTML('{{innerInterpolator}}[[<p></p>]]', resolveIn);
      expect(processed).toBe('hello world&lt;p&gt;&lt;/p&gt;');
    });
  });
});
