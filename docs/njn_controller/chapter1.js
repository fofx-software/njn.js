var chapter1 = {
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
};
