njn.controller('acceptance-controller', {
  ownID: 'acceptance-controller',
  firstText: 'first node',
  subObj: { firstText: 'my text' },
  subArr: [3,2,1],
  ascending: function(a, b) { return a - b; },
  arrArr: [
    { subArr: [1,2] },
    { subArr: [1,2] }
  ],
  getID: function(subEl, subArr, arrEl, arrArr, subInd, arrInd) {
    return subInd.toString() + arrInd;
  }
});
