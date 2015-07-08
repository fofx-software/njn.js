var codeBlock = '<pre njn-class="language-{{preLanguage}}"><code>{{code}}</code></pre>';
var subsections = '<div>' +
                    '<div njn-foreach="subsections">' +
                      '<h3><a class="section-number" href=""></a>{{title}}</h3>' +
                      '{{content}}' +
                    '</div>' +
                  '</div>';
var scrollLink = '<a href="javascript:void(0)" njn-on="click:scrollTo">';

njn.controller('body-controller', {
  scrollTo: function(e, lookupChain, indices) {
    var element = document.getElementsByClassName('chapter')[indices.slice(-1)[0]];
    if(indices.length === 2) {
      element = element.getElementsByClassName('section-wrapper')[indices[0]];
    }
    window.scrollTo(0, element.offsetTop - 5);
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
              code: njn.Controller.escapeHTML(
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
              code: njn.Controller.escapeHTML(
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
        sections: [
            {
              title: 'Initialize the njn.controller',
              viewInterfaceCode: '<code class="language-javascript">viewInterface</code>',
              preLanguage: 'javascript',
              content: codeBlock,
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
                    title: 'The second argument provides the njn.controller\'s {{viewInterfaceCode}}:',
                    code:
                      'njn.controller(\'example-controller\', {\n' +
                      '  exampleText: \'hello world\'\n' +
                      '});',
                  },
                  {
                    title: 'It\'s also possible to pass only a {{viewInterfaceCode}}:',
                    code:
                      'njn.controller({\n' +
                      '  exampleText: \'hello world\'\n' +
                      '});'
                  }
              ],
              sectionBody: subsections + '<i>Note: while all the above constructions are valid, the only one that will permit you to do anything ' +
                                         'in a typical HTML document is construction 1.3, with a name + a viewInterface.  You need a name so you ' +
                                         'have a way to ' + scrollLink + 'reference the njn.controller in your HTML</a>, and you need a viewInterface ' +
                                         'or else there\'s not much to interact with.</i>'
            },
            {
              title: 'Reference the njn.controller',
              sections: [
                  {
                    sectionBody: subsections,
                    sections: [
                      
                    ],
                    sectionBody: 'Reference the njn.controller by its name in an <code class="language-markup">njn-controller</code> HTML attribute: {{code}}'
                    //<div fx-controller="example-controller"&gt;&lt;/div&gt;
                  }
              ]
            }
        ]
      }
  ]
});
