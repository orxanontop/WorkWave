# Optimize Command
Profile and optimize the specified code for performance.

## Steps
1. Identify performance bottlenecks:
   - Algorithmic complexity (O(n²) or worse in hot paths)
   - N+1 queries or API calls
   - Unnecessary object creation in loops
   - Missing or inefficient caching
   - Blocking operations that could be async
   - Memory leaks (uncleared listeners, growing caches)
2. Profile before optimizing — measure, don't guess
3. Apply optimizations:
   - Better algorithms/data structures (Map vs Object, Set vs Array)
   - Batch operations
   - Lazy loading for non-critical data
   - Cache with proper invalidation
   - Stream large datasets
   - Debounce/throttle frequent operations
4. Measure improvement after each change
5. Keep code readable — optimize only what matters

## Rules
- Profile first, never guess bottlenecks
- O(n) or better for hot paths
- Cache aggressively with proper invalidation
- Batch over N+1
- Don't sacrifice readability for micro-optimizations

## Output
```
## Optimization: [component]

### Before
- Bottleneck: [description]
- Complexity: O(X)
- Time: [measurement if available]

### Changes Made
1. [Change]: [why and expected impact]
2. [Change]: [why and expected impact]

### After
- New complexity: O(Y)
- Expected improvement: [X% or description]

### Trade-offs
[Any readability/memory trade-offs made]
```
