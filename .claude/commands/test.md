# Test Command
Generate comprehensive tests following the test pyramid and 10x standards.

## Steps
1. Identify the unit of work (function, class, module)
2. Determine test strategy:
   - Unit tests for business logic (70%)
   - Integration tests for key flows with real dependencies (20%)
   - E2E tests for critical user journeys (10%)
3. Write tests using Arrange-Act-Assert pattern
4. Test behavior, not implementation
5. Cover:
   - Happy path
   - Edge cases (empty, null, boundary values)
   - Error cases (invalid input, failures, timeouts)
   - State changes and side effects

## Test Standards
- Descriptive names: "should [expected behavior] when [condition]"
- One concept per test
- Mock external dependencies, use real business logic
- Fast, independent, repeatable
- 100% coverage on critical paths, 80%+ overall
- No test interdependencies

## Output
```
## Tests for [component]

### Test Plan
- [ ] Test: should X when Y
- [ ] Test: should A when B fails
- [ ] Test: should handle edge case Z

### Implementation
[Generated test code]

### Coverage Report
- Lines: X%
- Branches: Y%
- Critical paths: [list]
```
