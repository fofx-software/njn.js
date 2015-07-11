describe('interpolatorRE', function() {
  var interpolatorRE = __njn_controller_utilities__.interpolatorRE;

  it('matches when a string contains an interpolator', function() {
    expect('hello {{name}}'.search(interpolatorRE)).toBeGreaterThan(-1);
  });

  it('matches when an interpolator begins with an exclamation mark', function() {
    expect('{{!bool}}'.search(interpolatorRE)).toBeGreaterThan(-1);
  });

  it('matches when an interpolator ends with a question mark', function() {
    expect('{{bool?}}'.search(interpolatorRE)).toBeGreaterThan(-1);
  });

  it('does not match when a non-word character is in the interpolator', function() {
    expect('{{blah blah}}'.search(interpolatorRE)).toBe(-1);
  });

  it('does not match when a third closing brace is provided', function() {
    expect('{{blah}}}'.search(interpolatorRE)).toBe(-1);
  });

  it('also does not match when a third opening brace is provided (but the third opening brace does not contribute to non-matching)', function() {
    expect('{{{blah}}}'.search(interpolatorRE)).toBe(-1);
  });
});

describe('escapeHTMLRE', function() {
  var escapeHTMLRE = __njn_controller_utilities__.escapeHTMLRE;

  it('matches when any characters are between double brackets', function() {
    expect('hello [[blah]] world'.search(escapeHTMLRE)).toBeGreaterThan(-1);
  });

  it('matches when newlines are between double brackets', function() {
    expect('hello [[blah\n]] world'.search(escapeHTMLRE)).toBeGreaterThan(-1);
  });
});
