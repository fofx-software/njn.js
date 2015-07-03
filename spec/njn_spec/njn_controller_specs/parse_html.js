describe('parseHTML()', function() {
  var parseHTML = __njn_controller_utility_functions__.parseHTML;

  describe('when given an html tag with no content', function() {
    it('returns the element', function() {
      expect(parseHTML('<a></a>').tagName).toBe('A');
    });
  });

  describe('when given an html tag with an attribute with a value', function() {
    describe('when the value is double-quoted', function() {
      it('sets the new element\'s attribute', function() {
        var testDiv = parseHTML('<div name="test-div"></div>');
        expect(testDiv.getAttribute('name')).toBe('test-div');
      });
    });

    describe('when the value is single-quoted', function() {
      it('sets the new elemen\'s attribute', function() {
        var testDiv = parseHTML("<div name='test-div'></div>");
        expect(testDiv.getAttribute('name')).toBe('test-div');
      });
    });

    describe('when the value is not quoted', function() {
      it('sets the new elemen\'s attribute', function() {
        var testDiv = parseHTML("<div name=test-div></div>");
        expect(testDiv.getAttribute('name')).toBe('test-div');
      });
    });
  });

  describe('when given an html tag with attribute without a value', function() {
    it('set the new element\'s attribute to an empty string', function() {
      var testP = parseHTML('<p empty-attr></p>');
      expect(testP.getAttribute('empty-attr')).toBe('');
    });
  });

  describe('when given an html tag with a combination of attributes', function() {
    it('sets each attribute', function() {
      var testA = parseHTML('<a target="_blank" href></a>');
      expect(testA.getAttribute('target')).toBe('_blank');
      expect(testA.getAttribute('href')).toBe('');
    });
  });

  describe('when given an html tag with textContent', function() {
    it('sets the textContent', function() {
      var testDiv = parseHTML('<div>hello world</div>');
      expect(testDiv.textContent).toBe('hello world');
    });
  });

  describe('when given an html tag with textContent and attributes', function() {
    it('sets tham all', function() {
      var testA = parseHTML('<a target href="www.fofx.co">f(x) software</a>');
      expect(testA.getAttribute('target')).toBe('');
      expect(testA.getAttribute('href')).toBe('www.fofx.co');
      expect(testA.textContent).toBe('f(x) software');
    });
  });

  describe('when given an empty element', function() {
    it('ignores textContent and closing tag', function() {
      var input = parseHTML('<input type="checkbox" checked>');
      expect(input.getAttribute('type')).toBe('checkbox');
      expect(input.getAttribute('checked')).toBe('');
      expect(input.textContent).toBe('');
    });
  });
});
