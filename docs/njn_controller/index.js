var codeBlock = function(code) { return '<pre njn-class="language-{{preLanguage}}"><code noparse>' + code + '</code></pre>' };

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
              preLanguage: 'markup',
              sectionBody: codeBlock(
                '<head>\n' +
                '  <script src="njn.js"></script>\n' +
                '  <script src="njn_controller.js"></script>\n' +
                '</head>'
              )
            }
        ]
      }
  ]
});//, function() { Prism.highlightAll(); });
