var Chapter = function() {
  
}

var chapters = [{ }];

var leftPanel = njn.controller({
  chapterLinks: njn.Controller.mapHTML(chapters, chapterLinks),
  chapter
});

var chapterLinks =
  '<div njn-foreach="chapters">' +
    '<h2><a njn-href="#{{sectionId}}">{{title}}</a></h2>' +
    '<div njn-foreach="sections" class="navlink">' +
      '<a class="link-to-subsection" njn-href="#{{sectionId}}">{{title}}</a>' +
    '</div>' +
  '</div>';

leftPanel.loadTemplate(document.getElementById('left-panel'));

var chapterDivs =
  '<div njn-foreach="chapters" class="chapter" njn-id="{{sectionId}}">' +
    '<h1 class="section-break">{{title}}</h1>' +
    '<div class="section-wrapper" njn-id="{{sectionId}}" njn-foreach="sections">' +
      '<div>' +
        '<a class="section-number" njn-href="#{{sectionId}}"><h2></h2></a>' +
        '<h2 class="section-title">{{title}}:</h2>' +
      '</div>' +
      '<div class="section-body">' +
        '{{sectionBody}}' +
      '</div>' +
    '</div>' +
  '</div>';
