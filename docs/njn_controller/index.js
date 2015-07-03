fofx.controller('body-controller', {
  sections: [
    {
      title: 'Download the code:',
      subsections: [
        {
          subtitle: '<a target="_blank" href="http://github.com/fofx-software/fofx/blob/master/fofx.js">fofx.js</a>'
        },
        {
          subtitle: fofx.createElement('a', {
            target: "_blank",
            href: "http://github.com/fofx-software/fofx/blob/master/fx_controller.js",
            textContent: 'fx_controller.js' 
          })
        }
      ]
    }
  ]
});
