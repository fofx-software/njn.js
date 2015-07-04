describe('parseHTML()', function() {
  var parseHTML = __njn_controller_utility_functions__.parseHTML;

  describe('when given an html tag with no content', function() {
    it('returns the element', function() {
      expect(parseHTML('<a></a>')[0].tagName).toBe('A');
    });
  });

  describe('when given an html tag with an attribute with a value', function() {
    describe('when the value is double-quoted', function() {
      it('sets the new element\'s attribute', function() {
        var testDiv = parseHTML('<div name="test-div"></div>')[0];
        expect(testDiv.getAttribute('name')).toBe('test-div');
      });
    });

    describe('when the value is single-quoted', function() {
      it('sets the new elemen\'s attribute', function() {
        var testDiv = parseHTML("<div name='test-div'></div>")[0];
        expect(testDiv.getAttribute('name')).toBe('test-div');
      });
    });

    describe('when the value is not quoted', function() {
      it('sets the new elemen\'s attribute', function() {
        var testDiv = parseHTML("<div name=test-div></div>")[0];
        expect(testDiv.getAttribute('name')).toBe('test-div');
      });
    });
  });

  describe('when given an html tag with attribute without a value', function() {
    it('set the new element\'s attribute to an empty string', function() {
      var testP = parseHTML('<p empty-attr></p>')[0];
      expect(testP.getAttribute('empty-attr')).toBe('');
    });
  });

  describe('when given an html tag with a combination of attributes', function() {
    it('sets each attribute', function() {
      var testA = parseHTML('<a target="_blank" href></a>')[0];
      expect(testA.getAttribute('target')).toBe('_blank');
      expect(testA.getAttribute('href')).toBe('');
    });
  });

  describe('when given an html tag with textContent', function() {
    it('sets the textContent', function() {
      var testDiv = parseHTML('<div>hello world</div>')[0];
      expect(testDiv.textContent).toBe('hello world');
    });
  });

  describe('when given an html tag with textContent and attributes', function() {
    it('sets tham all', function() {
      var testA = parseHTML('<a target href="www.fofx.co">f(x) software</a>')[0];
      expect(testA.getAttribute('target')).toBe('');
      expect(testA.getAttribute('href')).toBe('www.fofx.co');
      expect(testA.textContent).toBe('f(x) software');
    });
  });

  describe('when given an empty element', function() {
    it('ignores textContent and closing tag', function() {
      var input = parseHTML('<input type="checkbox" checked>')[0];
      expect(input.getAttribute('type')).toBe('checkbox');
      expect(input.getAttribute('checked')).toBe('');
      expect(input.textContent).toBe('');
    });
  });

  describe('when given nested elements', function() {
    it('parses the elements', function() {
      var div = parseHTML('<div class="new-div">outer text 1<p>hello world</p><p>how <b>are</b> you?</p><input type="checkbox" checked>outer text 2</div>')[0];
      expect(div.childNodes[0].textContent).toBe('outer text 1');
      expect(div.children[0].textContent).toBe('hello world');
      expect(div.children[0].tagName).toBe('P');
      expect(div.children[1].textContent).toBe('how are you?');
      expect(div.children[1].children[0].tagName).toBe('B');
      expect(div.children[2].checked).toBe(true);
      expect(div.childNodes[4].textContent).toBe('outer text 2');
    });

    describe('when nested elements contain newlines', function() {
      it('continues reading across newlines', function() {
        var html = '<div>\n' +
                   '  outer text 1\n' +
                   '  <p>\n' +
                   '    inner text\n' +
                   '  </p>\n' +
                   '  <input>\n' +
                   '  outer text 2\n' +
                   '</div>';
        var div = parseHTML(html)[0];
        expect(div.childNodes[0].textContent.trim()).toBe('outer text 1');
        expect(div.childNodes[1].textContent.trim()).toBe('inner text');
        expect(div.childNodes[2].textContent.trim()).toBe('');
        expect(div.childNodes[3].tagName).toBe('INPUT');
        expect(div.childNodes[4].textContent.trim()).toBe('outer text 2');
      });
    });

    describe('when a nested element has the same tagName as the containing element', function() {
      it('correctly locates the proximate closing tags', function() {
        var div = parseHTML('<div><div><div></div><div></div></div><div></div></div>')[0];
        expect(div.children[0].tagName).toBe('DIV');
        expect(div.children[0].children[0].tagName).toBe('DIV');
        expect(div.children[0].children[1].tagName).toBe('DIV');
        expect(div.children[1].tagName).toBe('DIV');
      });
    });

    describe('when an outer element has a noparse attribute', function() {
      var html = '<pre><code noparse><div class="example-div"><div></div></div></code></pre>';
      var pre = parseHTML(html)[0];

      it('does not parse inner html', function() {
        expect(pre.children[0].textContent).toBe('<div class="example-div"><div></div></div>');
      });
    });
  });

  describe('when an html string contains a comment', function() {
    it('treats it as text', function() {
      var div = parseHTML('<div>hello sir <!-- comment --></div>')[0];
      expect(div.textContent).toBe('hello sir <!-- comment -->');
    });
  });
});
