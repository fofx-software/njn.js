var codeBlock = '<pre njn-class="language-{{preLanguage}}">{{code}}</pre>';

njn.controller('body-controller', {
  chapters: [
      {
        title: 'Quick Start:',
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
              sectionBody: ''
            },
            {
              title: 'Put it in your HTML:',
              subsections: [],
              code: '<code>' + (
                     '<head>\n' +
                     '  <script src="njn.js"></script> <!--run njn.js first!-->\n' +
                     '  <script src="njn_controller.js"></script>\n' +
                     '</head>'
                    ).replace(/</g, '&lt;').replace(/>/g, '&gt;') +
                    '</code>',
              preLanguage: 'markup',
              sectionBody: codeBlock
            }
        ]
      }
  ]
});//, function() { Prism.highlightAll(); });
