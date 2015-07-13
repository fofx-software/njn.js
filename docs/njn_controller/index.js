var Chapter = function(title, sections) {
  this.title = title;
  this.sections = sections;
}

Chapter.prototype.id = function() {
  return this.title.replace(/:|<[^>]+|'>/g, '').replace(/\./g, ' ').toLowerCase().split(' ').join('-');
}

var Section = function(title, subsections, sectionBody) {
  this.title = title;
  (this.subsections = subsections).forEach(function(subsection, i) {
    subsection.id = this.id() + '-subsection' + (i + 1);
  }, this);
  this.sectionBody = sectionBody || 
    '<div data-njnrepeat="++subsections">' +
      '<h3 class="subsection-title">' +
        '<a class="subsection-number" href="#{{+++id}}" id="{{+++id}}"></a>' +
        ' {{+++title}}' +
      '</h3>' +
      '<div class="subsection-body">{{+++content}}</div>' +
    '</div>';
}

Section.prototype = new Chapter;

var SubSection = function(title, content) {
  this.title = title;
  this.content = content || '';
}

/****/
/****/

var chapter1Section1 = new Section('Download the code', [
  new SubSection('<a target="_blank" href="http://github.com/fofx-software/njn.js/blob/master/njn.js">njn.js</a>'),
  new SubSection('<a target="_blank" href="http://github.com/fofx-software/njn.js/blob/master/njn_controller.js">njn_controller.js</a>')
]);

var chapter1Section2 = new Section('Put it in your HTML', [],
  '<pre class="language-markup"><code>[[' +
    '<head>\n' +
    '  <script src="njn.js"></script> <!-- run this first! -->\n' +
    '  <script src="njn_controller.js"></script>\n' +
    '</head>' +
  ']]</code></pre>' +
  '<i>syntax highlighting courtesy of <a href="http://prismjs.com" target="_blank">Prism</a></i>'
);

var chapter1Section3 = new Section('Put it to work', [],
  '<pre class="language-markup"><code>[[' +
    '<body>\n' +
    '  <div id="example-controller">\n' +
    '    {{exampleText}}} <!-- will resolve to "hello world" -->\n' +
    '  </div>\n' +
    '  <script>\n' +
    '    njn.controller(\'example-controller\', {\n' +
    '      exampleText: \'hello world\'\n' +
    '    });\n' +
    '  </script>\n' +
    '</body>' +
  ']]</code></pre>'
);

var chapter1 = new Chapter('Quick Start', [chapter1Section1, chapter1Section2, chapter1Section3]);

var chapter2Section1 = new Section('Initialize the njn.controller', [
  new SubSection(
    'Initialize an instance of njn.Controller:',
    '<pre class="language-javascript"><code>njn.controller();</code></pre>'
  ),
  new SubSection(
    'The first argument gives the njn.controller a name so you can bind it to an element in your HTML:',
    '<pre class="language-javascript"><code>njn.controller(\'example-controller\');</code></pre>'
  ),
  new SubSection(
    'The second argument provides the njn.controller\'s viewInterface:',
    '<pre class="language-javascript"><code>njn.controller(\'example-controller\', {\n' +
    '  exampleText: \'hello world\'\n' +
    '});</pre></code>'
  ),
  new SubSection(
    'It\'s also possible to pass only a viewInterface:',
    '<pre class="language-javascript"><code>njn.controller({\n' +
    '  exampleText: \'hello world\'\n' +
    '});</code></pre>'
  )
]);

var chapter2Section2 = new Section('Bind the njn.controller to an element', [
  new SubSection(
    'If the njn.controller was given a name and an element exists whose id is the same, that element is automatically processed:',
    '<pre class="language-markup"><code>' +
      '[[<div id="example-controller"></div>\n<script>njn.controller(\'example-controller\');</script>]]' +
    '</code></pre>'
  ),
  new SubSection(
    'Otherwise, you can bind an element to it explicitly with loadTemplate():',
    '<pre class="language-markup"><code>[[' +
      '<div id="example-controller"></div>\n' +
      '<script>\n' +
      '  njn.controller().loadTemplate(document.getElementById(\'example-controller\'));\n' +
      '</script>' +
    ']]</code></pre>'
  )
]);

var chapter2Section3 = new Section('Access the njn.controller\'s viewInterface', [
  new SubSection(
    'The properties of the njn.controller\'s viewInterface can be accessed directly from within the bound element (or its children):',
    '<pre class="language-markup"><code>[[' +
      '<div id="example-controller">\n' +
      '  {{exampleText}} <!--will resolve to "hello world"-->\n' +
      '</div>\n' +
      '<script>\n' +
      '  njn.controller(\'example-controller\', {\n' +
      '    exampleText: \'hello world!\'\n' +
      '  });\n' +
      '</script>' +
    ']]</code></pre>'
  ),
  new SubSection(
    'If the accessed property is a function, it is called on the viewInterface without any arguments:',
    '<pre class="language-markup"><code>[[' +
      '<div id="example-controller">\n' +
      '  {{getText}} <!--will resolve to "my text"-->\n' +
      '</div>\n' +
      '<script>\n' +
      '  njn.controller(\'example-controller\', {\n' +
      '    myText: \'my text\',\n' +
      '    getText: function() {\n' +
      '      if(!arguments.length) return this.myText;\n' +
      '    }\n' +
      '  });\n' +
      '</script>' +
    ']]</code></pre>'
  )
]);

var chapter2Section4 = new Section('Using Interpolators', [
  new SubSection(
    'Basic usage:',
    '<pre class="language-markup"><code>[[' +
      '<div id="example-controller">\n' +
      '  <p class={{className}}>{{textContent}}</p>\n' +
      '</div>\n' +
      '<script>\n' +
      '  njn.controller(\'example-controller\', {\n' +
      '    className: "example-class",\n' +
      '    textContent: "hello world"\n' +
      '  });\n' +
      '</script>' +
    ']]</code></pre>' +
    'Interpolators appear between double braces &mdash; <b>{{propertyReferenceHere}}}</b> &mdash; and they correspond to property names wthin a viewInterface or other applicable object (more on that <a href="">below</a>). They can be used in element attributes or in elements\' textContent, as shown above.'
  )
]);

var chapter2 = new Chapter('Basic Usage', [chapter2Section1, chapter2Section2, chapter2Section3, chapter2Section4]);

var chapters = [chapter1, chapter2];

/****/
/****/

njn.controller('left-panel', {
  chapters: chapters
});

njn.controller('main-body', {
  chapters: chapters
});
