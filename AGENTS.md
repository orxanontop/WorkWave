# 10x Developer Standards & Best Practices

## Core Philosophy
- Write code for humans first, machines second
- Every line of code is a liability — less is more
- Ship fast, iterate faster, measure everything
- Automate everything that can be automated

## Code Quality Standards

### Clean Code Principles
- Functions should do ONE thing and do it well (max 20-30 lines)
- Meaningful variable/function names that reveal intent
- No magic numbers — extract to named constants
- Early returns over nested conditionals
- DRY but not at the cost of readability
- Comments explain WHY, not WHAT (code shows what)

### Architecture Patterns
- Favor composition over inheritance
- Dependency injection for testability
- SOLID principles in all new code
- Keep modules loosely coupled, highly cohesive
- Use established patterns (Factory, Strategy, Observer, etc.)
- Separate concerns: UI, Business Logic, Data Access

### Error Handling
- Never swallow errors silently
- Use specific error types, not generic exceptions
- Fail fast, fail loud, fail with context
- Graceful degradation over crashes
- Log with enough context to debug production issues
- Validate at boundaries, trust internally

## Performance Standards

### Optimization Rules
- Profile before optimizing — never guess bottlenecks
- O(n) or better for hot paths
- Lazy load everything non-critical
- Cache aggressively with proper invalidation
- Batch operations over N+1 queries/calls
- Use appropriate data structures (Map vs Object, Set vs Array)

### Memory Management
- Avoid unnecessary object creation in loops
- Clean up event listeners, timers, subscriptions
- Use WeakMap/WeakRef for caches when appropriate
- Stream large datasets instead of loading all at once
- Monitor memory leaks in long-running processes

## Testing Standards

### Test Pyramid
- 70% unit tests (fast, isolated, deterministic)
- 20% integration tests (real dependencies, key flows)
- 10% E2E tests (critical user journeys only)

### Testing Rules
- Test behavior, not implementation
- One assertion per test (conceptually)
- Descriptive test names: "should X when Y"
- Arrange-Act-Assert pattern
- Mock external dependencies, use real logic
- Tests should be fast, independent, repeatable
- 100% coverage on critical paths, 80%+ overall

## Git & Version Control

### Commit Standards
- Conventional commits: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore, perf
- Atomic commits — one logical change per commit
- Commit messages explain WHY, not WHAT
- Never commit broken code, even temporarily
- Use `.gitignore` properly — no secrets, no builds

### Branch Strategy
- Feature branches from main
- Short-lived branches (merge within days, not weeks)
- Rebase before merging to keep history clean
- Squash merge for clean main history

## Security Standards

### Non-Negotiables
- Never commit secrets, keys, or credentials
- Validate and sanitize ALL user input
- Use parameterized queries — no string concatenation for SQL
- HTTPS everywhere, no mixed content
- Rate limit public endpoints
- Principle of least privilege for all access
- Keep dependencies updated, audit regularly

### Data Handling
- Encrypt sensitive data at rest and in transit
- Hash passwords with bcrypt/argon2, never plain text
- Log without logging sensitive data
- GDPR/compliance aware — minimize data collection

## Developer Productivity

### Workflow Optimization
- Automate repetitive tasks (scripts, aliases, tools)
- Use IDE shortcuts — mouse is slow
- Set up hot reload for instant feedback
- Use snippets/templates for boilerplate
- Master your debugger over console.log
- Keyboard-driven workflows

### Code Review Checklist
- Does it solve the right problem?
- Is it simple enough?
- Are edge cases handled?
- Are tests included and passing?
- Is it performant?
- Is it secure?
- Is it documented where needed?
- Would I be comfortable maintaining this?

## Documentation Standards

### Code Documentation
- JSDoc/docstrings for public APIs
- README with setup, usage, and contribution guide
- Architecture Decision Records (ADRs) for major choices
- Inline comments for complex logic only
- Keep docs updated with code changes

### Project Documentation
- Clear project structure explanation
- Environment setup instructions
- Deployment process
- Common troubleshooting guide
- API documentation (OpenAPI/Swagger if applicable)

## Debugging Methodology

### Systematic Debugging
1. Reproduce consistently
2. Isolate the problem (binary search approach)
3. Check logs and error messages carefully
4. Form hypothesis, test it
5. Use debugger, not just print statements
6. Rubber duck explain the issue
7. Check recent changes (git blame, git log)
8. Search for known issues

## Continuous Improvement

### Learning Habits
- Read code more than you write it
- Study well-known open source projects
- Learn one new tool/pattern per week
- Write about what you learn
- Pair program when possible
- Code review others' code actively

### Metrics That Matter
- Lead time (idea → production)
- Deployment frequency
- Mean time to recovery (MTTR)
- Change failure rate
- Code review turnaround time
- Bug escape rate

## Anti-Patterns to Avoid

### Code Smells
- God objects / God functions
- Feature envy (method uses other class more than own)
- Long parameter lists (>3 params)
- Duplicate code
- Dead code / unused imports
- Over-engineering (YAGNI)
- Premature optimization

### Process Smells
- Manual deployments
- No code review
- Testing in production only
- No monitoring/alerting
- Knowledge silos (one person knows X)
- Technical debt without tracking

## When in Doubt
1. Keep it simple
2. Make it work, make it right, make it fast (in that order)
3. Ask: "What's the simplest thing that could work?"
4. Delete code before adding code
5. If it hurts, do it more often (pain-driven development)
6. Measure, don't guess
