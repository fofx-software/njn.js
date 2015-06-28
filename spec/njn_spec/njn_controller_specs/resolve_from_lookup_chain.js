describe('resolveFromLookupChain()', function() {
  var controller = njn.controller();
  var obj = {
    a: 1,
    getVal: function() { return this.a; },
    checkArgs: function() { return [].join.call(arguments,''); },
    currEl: function() { return this.currElement; }
  }
  var resolveFromLookupChain = __njn_controller_utility_functions__.resolveFromLookupChain;

  describe('when given no lookupChain or viewInterface', function() {
    it('returns undefined', function() {
      var resolved = resolveFromLookupChain(controller, 'foo');
      expect(resolved).toBeUndefined();
    });
  });

  describe('when given a lookupChain but no viewInterface', function() {
    describe('if a member of the lookupChain has the property', function() {
      describe('if the value of the property is not a function', function() {
        it('returns the value', function() {
          var resolved = resolveFromLookupChain(controller, 'a', [obj]);
          expect(resolved).toBe(1);
        });
      });

      describe('if the value of the property is a function', function() {
        it('calls the function on the member', function() {
          var resolved = resolveFromLookupChain(controller, 'getVal', [obj]);
          expect(resolved).toBe(1);
        });

        it('calls the function with no arguments', function() {
          var resolved = resolveFromLookupChain(controller, 'checkArgs', [obj]);
          expect(resolved).toBe('');
        });

        describe('if currElement is provided', function() {
          it('is not accessible within the function', function() {
            var resolved = resolveFromLookupChain(controller, 'currEl', [obj], null, 'fakeEl');
            expect(resolved).toBeUndefined();
          });
        });

        describe('if eventArg is provided', function() {
          it('is not passed to the function', function() {
            var resolved = resolveFromLookupChain(controller, 'checkArgs', [obj], null, null, 'fakeEvent');
            expect(resolved).toBe('');
          });
        });
      });
    });

    describe('if no member of the lookupChain has the property', function() {
      it('returns undefined', function() {
        var lookupChain = [{ a: 1 }, { b: 2 }];
        var resolved = resolveFromLookupChain(controller, 'c', lookupChain);
        expect(resolved).toBeUndefined();
      });
    });
  });

  describe('when the controller has a viewInterface', function() {
    var controller = njn.controller(obj);

    describe('if the viewInterface has the property', function() {
      describe('if the value of the property is not a function', function() {
        it('returns the value', function() {
          var resolved = resolveFromLookupChain(controller, 'a');
          expect(resolved).toBe(1);
        });
      });

      describe('if the value of the property is a function', function() {
        it('calls the function on the viewInterface', function() {
          var resolved = resolveFromLookupChain(controller, 'getVal');
          expect(resolved).toBe(1);
        });

        describe('if currElement is provided', function() {
          it('sets viewInterface.currElement to currElement before calling the function', function() {
            var resolved = resolveFromLookupChain(controller, 'currEl', null, null, 'fakeEl');
            expect(resolved).toBe('fakeEl');
          });

          it('deletes viewInterface.currElement after calling the function', function() {
            var resolved = resolveFromLookupChain(controller, 'currEl', null, null, 'fakeEl');
            expect('currElement' in controller.viewInterface).toBe(false);
          });
        });

        describe('if lookupChain is provided', function() {
          it('applies the lookupChain to the function', function() {
            var resolved = resolveFromLookupChain(controller, 'checkArgs', ['a', 'b', 'c']);
            expect(resolved).toBe('abc');
          });

          it('searches the lookupChain for the property before the viewInterface', function() {
            var resolved = resolveFromLookupChain(controller, 'a', [{ a: 2 }]);
            expect(resolved).toBe(2);
          });
        });

        describe('if indices array is provided', function() {
          it('applies the indices array to the function', function() {
            var resolved = resolveFromLookupChain(controller, 'checkArgs', null, [1, 2, 3]);
            expect(resolved).toBe('123');
          });
        });

        describe('if lookupChain and indices array are both provided', function() {
          it('applied the lookupChain and then the indices array', function() {
            var resolved = resolveFromLookupChain(controller, 'checkArgs', ['a', 'b', 'c'], [1, 2, 3]);
            expect(resolved).toBe('abc123');
          });
        });

        describe('if eventArg is provided', function() {
          it('is passed as the first argument to the function', function() {
            var resolved = resolveFromLookupChain(controller, 'checkArgs', [1,2], [0,1], null, 'fakeEvent');
            expect(resolved).toBe('fakeEvent1201');
          });
        });
      });
    });
  });
});
