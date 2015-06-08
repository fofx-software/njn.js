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

fxjs.controller('toggleClasses', {
  trueClass: true,
  falseClass: false,
  noArgs: function(arg1) { return arg1; },
  getTrue: function() { return this.trueClass; },
  useCurrElem: function() {
    return this.currElement.getAttribute('name') === 'use-curr-elem';
  },
  getObject: {},
  class1: 'first-class',
  class2: 'second-class',
  getName: 'bob',
  myText: 'hi!'
});

fxjs.controller('toggleDisplay', {
  trueProperty: true,
  truthyProperty: 'string',
  falseProperty: false,
  falseyProperty: undefined,
  callThis: function() { return this.falseProperty; },
  noArgs: function(arg1) { return arg1; },
  useCurrElement: function() {
    return this.currElement.id !== 'use-curr-element';
  },
  myName: 'bob',
  myText: function() { return this.myName; }
});

fxjs.controller('addEventListeners', {
  boolProp: false,
  argProp: {},
  count: 0,
  handleClick: function() { this.boolProp = !this.boolProp; },
  noArgs: function(arg1) { this.argProp = arg1; },
  setCurrElement: function() { this.argProp = this.currElement.id; },
  increment: function() { this.count++; }
});

fxjs.controller('checkCheckbox', {
  trueProp: true,
  truthyProp: {},
  funcProp: function() { return this.trueProp; },
  funcArgs: function(arg1) { return arg1; },
  falseProp: false,
  falseyProp: undefined
});

var objet = function(num) {
  return {
    num: num,
    getInnerName: function(arg1) { return this.num + ' ' + arg1; },
    filterMe: function() { return this.num; },
    sortMe: function() { return 5 - this.num; }
  };
}

var array = [
  {
    name: 'ron',
    objects: [objet(0)]
  },
  {
    name: 'joe',
    objects: [objet(0), objet(1)]
  },
  {
    name: 'bob',
    objects: [objet(0), objet(1), objet(2)]
  }
];

var arrayOfCollections = array.map(function(obj) {
  return {
    name: obj.name,
    objects: fxjs.collection().concatMembers(obj.objects)
  };
});

fxjs.controller('forEach', {
  arrayProp: array,
  collectionProp: fxjs.collection().concatMembers(arrayOfCollections),
  getOuterText: function(outerMember, outerIndex, arg3) {
    return this.currElement.getAttribute('name') + outerMember.name + outerIndex + arg3;
  },
  getInnerText: function(innerMember, outerMember, innerIndex, outerIndex, arg5) {
    return this.currElement.className + innerMember.num + outerMember.name + innerIndex + outerIndex + arg5;
  },
  count: 0,
  getCount: function() { return ++this.count; },
  pluralOnly: { filter: function(obj) { return obj.objects.count() > 1; } },
  filterPluralOnly: function(obj) { return obj.objects.count() > 1; },
  greaterThan0: { filter: function(obj) { return obj.num > 0; } },
  reverseNum: function(obj) { return 5 - obj.num; },
  filterArray: function(obj) { return obj.objects.length > 1; },
  nonFuncFilter: 3,
  sortArray: function(a, b) {
    if(5 - a.num > 5 - b.num) return 1;
    if(5 - a.num < 5 - b.num) return -1;
    return 0;
  }
});

fxjs.controller('context', {
  object1: { name: 'george', object2: { name2: 'john' } },
  getName: function(obj1, obj2, arg3) {
    return obj1.name2 + obj2.name + arg3;
  },
  array1: ['a', 'b', 'c'],
  array2: [ 1, 2 ],
  testArgs: function(obj2, arr2mem, obj1, arr1mem, arr2ind, arr1ind, arg7) {
    return obj2.name2 + arr2mem + obj1.name + arr1mem + arr2ind + arr1ind + arg7;
  }
});
