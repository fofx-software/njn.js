var codeBlock = '<pre njn-class="language-{{preLanguage}}"><code>{{code}}</code></pre>';
var subsections = '<div>' +
                    '<div njn-foreach="subsections">' +
                      '<h3><a class="section-number" href=""></a>{{title}}</h3>' +
                      '{{content}}' +
                    '</div>' +
                  '</div>';
var inlineCode = function(code, preLanguage) { return '<code class="language-' + (preLanguage || 'javascript') + '">' + code + '</code>'; }
var escapeHTML = njn.Controller.escapeHTML;

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
              sectionBody: codeBlock + '<i>syntax highlighting courtesy of <a href="http://prismjs.com" target="_blank">Prism</a></i>'
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
              sectionBody: codeBlock
            }
        ]
      },
      {
        title: 'Usage',
        content: codeBlock,
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
                    title: 'The second argument provides the njn.controller\'s ' + inlineCode('viewInterface') + ':',
                    code:
                      'njn.controller(\'example-controller\', {\n' +
                      '  exampleText: \'hello world\'\n' +
                      '});',
                  },
                  {
                    title: 'It\'s also possible to pass only a ' + inlineCode('viewInterface') + ':',
                    code:
                      'njn.controller({\n' +
                      '  exampleText: \'hello world\'\n' +
                      '});'
                  }
              ],
              sectionBody: subsections + '<i>Note: while all the above constructions are valid, the only one that will permit you to do anything ' +
                                         'in typical usage is construction 1.3, with a name + a viewInterface.  You need a name so you have a way ' +
                                         'to <a href="#reference-the-njn-controller">reference the njn.controller in your HTML</a>, and you need ' +
                                         'a viewInterface or else there\'s not much to interact with.</i>'
            },
            {
              title: 'Reference the njn.controller',
              subsections: [
                  {
                    title: 'Reference the njn.controller by its name in an ' + inlineCode('njn-controller', 'markup') + ' HTML attribute: ',
                    preLanguage: 'markup',
                    code: escapeHTML('<div njn-controller="example-controller"></div>')
                  }
              ],
            },
            {
              title: 'Access the njn.controller\'s viewInterface',
              subsections: [
                  {
                    title: 'The properties of the njn.controller\'s viewInterface can be accessed directly from within any element with the ' +
                           'njn-controller attribute (or its children): ',
                    preLanguage: 'markup'
                  }
              ]
            }
        ]
      }
  ]
});