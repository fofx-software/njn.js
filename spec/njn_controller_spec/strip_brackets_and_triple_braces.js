describe('stripBracketsAndTripleBraces()', function() {
  var strip = __njn_controller_utilities__.stripBracketsAndTripleBraces;

  it('removes all double brackets', function() {
    var stripped = strip('h[[ello]] [[world]]');
    expect(stripped).toBe('hello world');
  });

  it('changes all triple brackets to double brackets', function() {
    var stripped = strip('h[[[ello]]] [[[world]]]');
    expect(stripped).toBe('h[[ello]] [[world]]'); 
  });

  it('changes all triple braces to double braces', function() {
    var stripped = strip('h{{{ello}}} {{{world}}}');
    expect(stripped).toBe('h{{ello}} {{world}}');
  });
});
