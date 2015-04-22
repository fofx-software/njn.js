var exampleApp = {
  fullSize: function fullSize(filename) {
    this.filename = filename;
    this.src = '../fginder/photos/' + filename + '.jpg';
  },
  listItem: function() { }
}

exampleApp.fullSize.members(
  'black_white_street',
  'black_white_alley',
  'brick_warehouse',
  'graffiti_shed'
);

exampleApp.listItem.members('item 1', 'item b', 'item iii');
