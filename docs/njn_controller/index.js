var codeBlock = function(codeName) { return '<pre njn-class="language-{{preLanguage}}"><code>{{' + codeName + '}}</code></pre>'; }
var subsections = '<div>' +
                    '<div njn-foreach="subsections">' +
                      '<h3><span class="section-number"></span>{{title}}</h3>' +
                      '{{content}}' +
                    '</div>' +
                  '</div>';
var escapeHTML = njn.Controller.escapeHTML;
var inlineHTML = function(code, preLanguage) { return '<code class="language-markup">' + escapeHTML(code) + '</code>'; }

njn.controller('body-controller', {
  sectionId: function(lookupChain, indices) {
    var hyphenize = function(str) {
      return str.replace(/:/g, '').replace(/\./g, ' ').replace(/<[^>]+>/g, '').replace(/'/g, '').toLowerCase().split(' ').join('-');
    }
    var chapter = this.chapters[indices.slice(-1)[0]];
    if(indices.length === 2) {
      var section = chapter.sections[indices[0]];
      return hyphenize(section.title);
    } else {
      return hyphenize(chapter.title);
    }
  },
  chapters: [
      {
        title: 'Quick Start',
        sections: [
            {
              title: 'Download the code',
              subsections: [
                {
                  title: '<a target="_blank" href="http://github.com/fofx-software/njn.js/blob/master/njn.js">njn.js</a>',
                  content: ''
                },
                {
                  title: '<a target="_blank" href="http://github.com/fofx-software/njn.js/blob/master/njn_controller.js">njn_controller.js</a>',
                  content: ''
                }
              ],
              sectionBody: subsections
            },
            {
              title: 'Put it in your HTML',
              preLanguage: 'markup',
              code: escapeHTML(
                '<head>\n' +
                '  <script src="njn.js"></script> <!-- run this first! -->\n' +
                '  <script src="njn_controller.js"></script>\n' +
                '</head>'
              ),
              sectionBody: codeBlock('code') + '<i>syntax highlighting courtesy of <a href="http://prismjs.com" target="_blank">Prism</a></i>'
            },
            {
              title: 'Put it to work',
              preLanguage: 'markup',
              code: escapeHTML(
                '<body>\n' +
                '  <div njn-controller="example-controller">\n' +
                '    {{exampleText}} <!-- will be processed as \'hello world\' -->\n' +
                '  </div>\n' +
                '  <script>\n' +
                '    njn.controller(\'example-controller\', {\n' +
                '      exampleText: \'hello world\'\n' +
                '    });\n' +
                '  </script>\n' +
                '</body>'
              ),
              sectionBody: codeBlock('code')
            }
        ]
      },
      {
        title: 'Usage',
        content: codeBlock('code'),
        sectionBody: subsections,
        sections: [
            {
              title: 'Initialize the njn.controller',
              preLanguage: 'javascript',
              subsections: [
                  {
                    title: 'Initialize an instance of njn.Controller:',
                    code: 'njn.controller();',
                  },
                  {
                    title: 'The first argument gives the new njn.controller a name so you can reference it in your HTML:',
                    code: 'njn.controller(\'example-controller\');',
                  },
                  {
                    title: 'The second argument provides the njn.controller\'s <b>viewInterface</b>:',
                    code:
                      'njn.controller(\'example-controller\', {\n' +
                      '  exampleText: \'hello world\'\n' +
                      '});',
                  },
                  {
                    title: 'It\'s also possible to pass only a <b>viewInterface</b>:',
                    code:
                      'njn.controller({\n' +
                      '  exampleText: \'hello world\'\n' +
                      '});'
                  }
              ],
              sectionBody: subsections + '<i>Note: while all the above constructions are valid, the only one that will permit you to do anything ' +
                                         'in typical usage is construction 1.3, with a name + a <b>viewInterface</b>.  You need a name so you have a way ' +
                                         'to <a href="#reference-the-njn-controller">reference the njn.controller in your HTML</a>, and you need ' +
                                         'a <b>viewInterface</b> or else there\'s nothing to interact with.</i>'
            },
            {
              title: 'Reference the njn.controller',
              subsections: [
                  {
                    title: 'Reference the njn.controller by its name in an ' + inlineHTML('njn-controller') + ' HTML attribute:',
                    preLanguage: 'markup',
                    code: escapeHTML('<div njn-controller="example-controller"></div>')
                  }
              ],
            },
            {
              title: 'Access the njn.controller\'s <b>viewInterface</b>',
              preLanguage: 'markup',
              subsections: [
                  {
                    title: 'The properties of the njn.controller\'s <b>viewInterface</b> can be accessed directly from within any element with the ' +
                           inlineHTML('njn-controller') + ' attribute (or its children):',
                    code: escapeHTML(
                      '<div njn-controller="example-controller">\n' +
                      '  {{exampleText}}\n' +
                      '</div>\n' +
                      '<script>\n' +
                      '  njn.controller(\'example-controller\', { exampleText: \'hello world!\' });\n' +
                      '</script>'
                    )
                  },
                  {
                    title: 'If the accessed property is a function, it is called on the <b>viewInterface</b>, in simple cases without any arguments:',
                    code: escapeHTML(
                      '<div njn-controller="example-controller">\n' +
                      '  {{getText}} <!--processes to "my text"-->\n' +
                      '</div>\n' +
                      '<script>\n' +
                      '  njn.controller(\'example-controller\', {\n' +
                      '    myText: \'my text\',\n' +
                      '    getText: function() {\n' +
                      '      if(!arguments.length) return this.myText;\n' +
                      '    }\n' +
                      '  });\n' +
                      '</script>'
                    )
                  }
              ]
            },
            {
              title: 'Resolving property references',
              preLanguage: 'markup',
              sectionBody: 'A <b>property reference</b> is denoted in the HTML by curly braces: <b>' + escapeHTML('{{propertyReference}}') + '</b>.  When ' +
                           'one is found, it is <b>resolved</b> by searching through an array of objects called the <b>lookupChain</b>, and the first object ' +
                           'that has the property is the one that is used to retrieve the value.  Initially, the <b>lookupChain</b> only contains the <b>viewInterface</b>, ' +
                           'so the <b>viewInterface</b> is the only object that is checked for the property reference.  However, there are two ways of adding objects ' +
                           'to the <b>lookupChain</b>:' + subsections,
              subsections: [
                  {
                    title: inlineHTML('njn-context', 'markup') + ' HTML attribute:',
                    content: codeBlock('code1') + '{{explanation1}}' + codeBlock('code2') + '{{explanation2}}',
                    code1: escapeHTML(
                      '<div njn-controller="controller-with-subobject">\n' +
                      '  <p njn-context="subobject">{{myText}}</p>\n' +
                      '</div>\n' +
                      '<script>\n' +
                      '  njn.controller(\'controller-with-subobject\', {\n' +
                      '    subobject: { myText: \'subobject text\' }\n' +
                      '  });\n' +
                      '</script>'
                    ),
                    explanation1: '<p>In the segment above, the ' + inlineHTML('<p>') + ' element\'s ' + inlineHTML('njn-context') + ' attribute references the <b>subobject</b> property of the <b>viewInterface</b>.  This <b>subobject</b> property resolves to an object with a <b>myText</b> property. The ' + inlineHTML('njn-context') + ' attribute causes the <b>subobject</b> to be added to the <b>lookupChain</b> <i>only within the ' + inlineHTML('<p>') + ' element</i> (and its children).  As long as we\'re inside the ' + inlineHTML('<p>') + ' element, the <b>subobject</b> will be checked for any property references in addition to the <b>viewInterface</b>.  In fact, the <b>subobject</b> will be checked <i>before</i> the <b>viewInterface</b>.</p><p>Below is another example to illustrate how the <b>subobject</b> is added to and removed from <b>lookupChain</b> inside and outside of the ' + inlineHTML('<p>') + ' element:</p>',
                    code2: escapeHTML(
                      '<div njn-controller="controller-with-subobject">\n' +
                      '  {{myText}} <!--will resolve to "viewInterface text" because we\'re not inside the <p>-->\n' +
                      '  <p njn-context="subobject">\n' +
                      '    {{myText}} <!--will resolve to "subobject text" because we\'re inside the <p>-->\n' +
                      '    <span>{{myText}}</span> <!--we\'re still inside the <p>, so this will resolve to "subobject text"-->\n' +
                      '  </p>\n' +
                      '  {{myText}} <!--we\'re outside the <p>, so this will resolve to "viewInterface text"-->\n' +
                      '</div>\n' +
                      '<script>\n' +
                      '  njn.controller(\'controller-with-subobject\', {\n' +
                      '    myText: \'viewInterface text\',\n' +
                      '    subobject: { myText: \'subobject text\' }\n' +
                      '  });\n' +
                      '</script>'
                    ),
                    explanation2: '<p>As you can see, the value of <b>' + escapeHTML('{{myText}}') + '</b> depends on where you are in the HTML.  This is because the <b>lookupChain</b> contains the <b>subobject</b> <i>inside</i> the ' + inlineHTML('<p>') + ' element, but not outside it.  The other important thing to note is that, when the <b>subobject</b> is added to the <b>lookupChain</b>, it is added <i>before</i> the <b>viewInterface</b>.  Thus, when both the <b>subobject</b> and the <b>viewInterface</b> have a property with the same name, the <b>subobject</b>\'s property is used.'
                  }
              ]
            }
        ]
      }
  ]
});
