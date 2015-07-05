var codeBlock = '<pre njn-class="language-{{preLanguage}}"><code noparse>{{code}}</code></pre>';

njn.controller('body-controller', {
  chapters: [
      {
        title: 'Quick Start',
        sections: [
            {
              title: 'Download the code:',
              subsections: [
                {
                  title: '<a target="_blank" href="http://github.com/fofx-software/njn.js/blob/master/njn.js">njn.js</a>'
                },
                {
                  title: '<a target="_blank" href="http://github.com/fofx-software/njn.js/blob/master/njn_controller.js">njn_controller.js</a>'
                }
              ],
              sectionBody:
                '<div>' +
                  '<div njn-foreach="subsections">' +
                    '<h3><a class="section-number" href=""></a>{{title}}</h3>' +
                  '</div>' +
                '</div>'
            },
            {
              title: 'Put it in your HTML:',
              preLanguage: 'markup',
              code: 
                '<head>\n' +
                '  <script src="njn.js"></script> <!-- run this first! -->\n' +
                '  <script src="njn_controller.js"></script>\n' +
                '</head>',
              sectionBody: '<div>' + codeBlock + '<i>syntax highlighting courtesy of <a href="http://prismjs.com" target="_blank">Prism</a></i></div>'
            },
            {
              title: 'Put it to work:',
              preLanguage: 'markup',
              code:
                '<body>\n' +
                '  <div njn-controller="example-controller>\n' +
                '    {{exampleText}} <!-- will be processed as \'hello world\' -->\n' +
                '  </div>\n' +
                '  <script>\n' +
                '    njn.controller(\'example-controller\', {\n' +
                '      exampleText: \'hello world\'\n' +
                '    });\n' +
                '  </script>\n' +
                '</body>',
              sectionBody: codeBlock
            }
        ]
      },
      {
        title: 'Usage',
        sections: [
            {
              title: 'Initialize the njn.controller:',
              subsections: [
                  {
                    text: 'Initialize an instance of njn.Controller:',
                    preLanguage: 'javascript',
                    code: 'njn.controller();'
                  },
                  {
                    text: 'The first argument gives the new njn.controller a name so you can reference it in your HTML:',
                    preLanguage: 'javascript',
                    code: 'njn.controller(\'example-controller\');'
                  },
                  {
                    text: function() {
                      return njn.controller({
                        inlineCode: '<code class="language-javascript">viewInterface</code>'
                      }).process('The second argument provides the njn.controller\'s {{inlineCode}}:');
                    },
                  }
              ],
              sectionBody:
                '<div>' +
                  '<div njn-foreach="subsections">' +
                    '{{text}}' + codeBlock +
                  '</div>' +
                '</div>'

//                
//          <!----><pre class="language-javascript"><code>
//          <!---->fofx.controller('example-controller', {
//          <!---->  exampleText: 'hello world'
//          <!---->});
//          <!----></code></pre>
            }
        ]
      }
  ]
});
