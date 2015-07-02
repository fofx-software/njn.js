describe('resolveFromLookupChain()', function() {
  var viewInterface = {
    a: 1,
    getVal: function() { return this.a; },
    checkArgs: function() { return [].join.call(arguments,''); },
    currEl: function() { return this.currElement; }
  };

  var resolveFromLookupChain = __njn_controller_utility_functions__.resolveFromLookupChain;

  describe('the non-viewInterface members of the lookupChain', function() {
    describe('if a member of the lookupChain has the property', function() {
      describe('if the value of the property is not a function', function() {
        it('returns the value', function() {
          var resolved = resolveFromLookupChain('a', [viewInterface, {}]);
          expect(resolved).toBe(1);
        });
      });

      describe('if the value of the property is a function', function() {
        it('calls the function on the member', function() {
          var resolved = resolveFromLookupChain('getVal', [viewInterface, {}]);
          expect(resolved).toBe(1);
        });

        it('calls the function with no arguments', function() {
          var resolved = resolveFromLookupChain('checkArgs', [viewInterface, {}]);
          expect(resolved).toBe('');
        });

        describe('if currElement is provided', function() {
          it('is not accessible within the function', function() {
            var resolved = resolveFromLookupChain('currEl', [viewInterface, {}], null, 'fakeEl');
            expect(resolved).toBeUndefined();
          });
        });

        describe('if eventArg is provided', function() {
          it('is not passed to the function', function() {
            var resolved = resolveFromLookupChain('checkArgs', [viewInterface, {}], null, null, 'fakeEvent');
            expect(resolved).toBe('');
          });
        });
      });
    });
  });

  describe('if no member of the lookupChain has the property', function() {
    it('returns undefined', function() {
      var lookupChain = [{ a: 1 }, { b: 2 }];
      var resolved = resolveFromLookupChain('c', lookupChain);
      expect(resolved).toBeUndefined();
    });
  });

  describe('when the viewInterface (last member of the lookupChain', function() {
    describe('if the viewInterface has the property', function() {
      describe('if the value of the property is not a function', function() {
        it('returns the value', function() {
          expect(resolveFromLookupChain('a', [viewInterface])).toBe(1);
        });
      });

      describe('if the value of the property is a function', function() {
        it('calls the function on the viewInterface', function() {
          expect(resolveFromLookupChain('getVal', [viewInterface])).toBe(1);
        });

        describe('if currElement is provided', function() {
          it('sets viewInterface.currElement to currElement before calling the function', function() {
            expect(resolveFromLookupChain('currEl', [viewInterface], null, 'fakeEl')).toBe('fakeEl');
          });

          it('deletes viewInterface.currElement after calling the function', function() {
            resolveFromLookupChain('currEl', [viewInterface], null, 'fakeEl');
            expect('currElement' in viewInterface).toBe(false);
          });
        });

        describe('if other members of lookupChain are provided', function() {
          it('applies the other members to the function', function() {
            var resolved = resolveFromLookupChain('checkArgs', ['a', 'b', 'c', viewInterface]);
            expect(resolved).toBe('abc');
          });

          it('searches the other members for the property before the viewInterface', function() {
            var resolved = resolveFromLookupChain('a', [{ a: 2 }, viewInterface]);
            expect(resolved).toBe(2);
          });
        });

        describe('if indices array is provided', function() {
          it('applies the indices array to the function', function() {
            var resolved = resolveFromLookupChain('checkArgs', [viewInterface], [1, 2, 3]);
            expect(resolved).toBe('123');
          });
        });

        describe('if lookupChain and indices array are both provided', function() {
          it('applies the lookupChain and then the indices array', function() {
            var resolved = resolveFromLookupChain('checkArgs', ['a', 'b', 'c', viewInterface], [1, 2, 3]);
            expect(resolved).toBe('abc123');
          });
        });

        describe('if eventArg is provided', function() {
          it('is passed as the first argument to the function', function() {
            var resolved = resolveFromLookupChain('checkArgs', [1,2,viewInterface], [0,1], null, 'fakeEvent');
            expect(resolved).toBe('fakeEvent1201');
          });
        });
      });
    });
  });
});
