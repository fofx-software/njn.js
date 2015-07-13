var chapter2Section2 = {
  title: 'Reference the njn.controller',
  subsections: [
      {
        title: 'Reference the njn.controller by its name in an ' + inlineHTML('njn-controller') + ' HTML attribute:',
        preLanguage: 'markup',
        code: '[[<div njn-controller="example-controller"></div>]]'
      }
  ],
};

// section 2 end //
// section 3 begin //

var chapter2Section3 = {
  title: 'Access the njn.controller\'s viewInterface',
  preLanguage: 'markup',
  subsections: [
      {
        title: 'The properties of the njn.controller\'s <b>viewInterface</b> can be accessed directly from within the element with the ' + inlineHTML('njn-controller') + ' attribute (or its children):',
        code: '[[' +
          '<div njn-controller="example-controller">\n' +
          '  {{exampleText}} <!--will resolve to "hello world"-->\n' +
          '</div>\n' +
          '<script>\n' +
          '  njn.controller(\'example-controller\', { exampleText: \'hello world!\' });\n' +
          '</script>' +
        ']]'
      },
      {
        title: 'If the accessed property is a function, it is called on the <b>viewInterface</b>, in simple cases without any arguments:',
        code: '[[' +
          '<div njn-controller="example-controller">\n' +
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
        ']]'
      }
  ]
};

// section 3 end //

var chapter2 = {
  title: 'Basic Usage',
  content: codeBlock('code'),
  sectionBody: subsections,
  sections: [
    chapter2Section1,
    chapter2Section2,
    chapter2Section3
  ]
};

// chapter 2 end //
// chapter 3 begin //
// section 1 begin //

var chapter3Section1 = {
  title: 'Overview',
  preLanguage: 'markup',
  sectionBody: '<p>A <b>property reference</b> is denoted in the HTML by curly braces: <b>[[{{propertyReference}}]]</b>.  When one is found, it is <b>resolved</b> by searching through an array of objects called the <b>lookupChain</b>, and the first object that has the referenced property is the one that is used to retrieve the value.  A qualified <b>owner</b> of a property can have the property either as an <b>ownProperty</b> or as a property in its prototype chain &mdash; njn.Controller does not distinguish.</p><p>Initially, the <b>lookupChain</b> only contains the <b>viewInterface</b>, so the <b>viewInterface</b> is the only object that is checked for the property reference. Below we will see how objects other than the <b>viewInterface</b> can be added to the <b>lookupChain</b> when you need them.</p><p>A <b>property reference</b> can refer to any data type, but when it refers to a function, the function is automatically called. In simple cases, as described <a href="#access-the-njn-controllers-viewinterface">above</a>, the function is called on its owner with no arguments. Below we will examine situations in which functions may be passed arguments.</p>'
};

/*
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
};
*/

// section 4 end //

var chapter3 = {
  title: 'Property References and the lookupChain',
  content: codeBlock('code'),
  sectionBody: subsections,
  sections: [
    chapter3Section1
  ]
};

// chapter 3 end //

njn.controller('body-controller', {
  sectionId: function(lookupChain, indices) {
    var hyphenize = function(str) {
      return str.replace(/:/g, '').replace(/\./g, ' ').replace(/<[^>]+>/g, '').replace(/'/g, '').toLowerCase().split(' ').join('-');
    }
    var chapter = this.chapters[indices.slice(-1)[0]];
    var section = chapter.sections[indices.slice(-2)[0]];
    if(indices.length === 2) {
      return hyphenize(section.title);
    }
    if(indices.length === 3) {
      var subsection = section.subsections[indices[0]];
      return hyphenize(subsection.title);
    }
    return hyphenize(chapter.title);
  },
  chapters: [
    chapter1,
    chapter2,
    chapter3
  ]
});
