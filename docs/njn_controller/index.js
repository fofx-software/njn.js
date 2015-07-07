var codeBlock = '<pre njn-class="language-{{preLanguage}}"><code>{{code}}</code></pre>';
var subsections = '<div>' +
                    '<div njn-foreach="subsections">' +
                      '<h3><a class="section-number" href=""></a>{{title}}</h3>' +
                      '{{content}}'
                    '</div>' +
                  '</div>';

njn.controller('body-controller', {
  chapters: [
      {
        title: 'Quick Start',
        sections: [
            {
              title: 'Download the code:',
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
              title: 'Put it in your HTML:',
              preLanguage: 'markup',
              code: njn.Controller.escapeHTML(
                '<head>\n' +
                '  <script src="njn.js"></script> <!-- run this first! -->\n' +
                '  <script src="njn_controller.js"></script>\n' +
                '</head>'
              ),
              sectionBody: '<div>' + codeBlock + '<i>syntax highlighting courtesy of <a href="http://prismjs.com" target="_blank">Prism</a></i></div>'
            },
            {
              title: 'Put it to work:',
              preLanguage: 'markup',
              code: njn.Controller.escapeHTML(
                '<body>\n' +
                '  <div njn-controller="example-controller>\n' +
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
              title: 'Initialize the njn.controller:',
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
              sectionBody: subsections
            }
        ]
      },
      {
        title: 'Reference the njn.controller',
        sections: [
            {
              njnControllerAttr: '<code class="language-markup">njn-controller</code>',
              sectionBody: subsections,
              sections: [
                
              ],
              sectionBody: 'Reference the njn.controller by its name in an {{njnControllerAttr}} HTML attribute: {{code}}'
              //<div fx-controller="example-controller"&gt;&lt;/div&gt;
            }
        ]
      }
  ]
});
