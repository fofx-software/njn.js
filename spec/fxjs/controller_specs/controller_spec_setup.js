fxjs.controller('processText', {
  ownText1: 'start text',
  ownText2: 'end text',
  ownTextInner: 'inner text',
  textString: 'this is the text',
  textFromFunction: function() {
    return this.textString + ' from a function';
  },
  testArguments: function(arg1) {
    return arg1;
  },
  embeddedIn: 'in the middle of',
  contains: 'has',
  interpolated: 'processed',
  testCurrElement: function() {
    return this.currElement.className;
  },
  'propertyWithQuestionMark?': function() {
    return true;
  },
  propertyWithBang: false,
  grandchildText: 'hi, grandpa!',
  withLeadingSpace: 'won\'t process',
  withTrailingSpace: 'won\'t process'
});

fxjs.controller('configureAttribute', {
  ownName: function() {
    return this.currElement.id;
  },
  testArguments: function(arg1) {
    return arg1;
  },
  useCurrElement: function() {
    if(this.currElement.className === 'hide-me') {
      return 'display: none;';
    }
  },
  overrideClass: function() {
    return 'new-class';
  },
  firstTwoClasses: 'first-class second-class',
  thirdClass: 'third-class',
  processText1: 'first text',
  position: 'middle',
  processInnerText: 'in the middle',
  processText2: 'end text'
});
