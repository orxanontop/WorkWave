# Code Review Command
Review the specified file(s) or current changes against 10x developer standards.

## Steps
1. Analyze the code for:
   - Clean code principles (single responsibility, meaningful names, no magic numbers)
   - Architecture quality (SOLID, composition over inheritance, loose coupling)
   - Error handling (no silent failures, proper error types, fail fast)
   - Performance concerns (N+1 queries, unnecessary allocations, algorithmic complexity)
   - Security issues (input validation, SQL injection, secrets exposure)
   - Test coverage and quality
2. Provide specific, actionable feedback with line references
3. Rate each area: 🔴 Critical, 🟡 Improvement, 🟢 Good
4. Suggest concrete improvements with code examples
5. Prioritize fixes by impact

## Output Format
```
## Code Review: [file/component]

### 🔴 Critical Issues
- [Issue] at line X: [description] → [fix]

### 🟡 Improvements
- [Suggestion] at line X: [description] → [better approach]

### 🟢 What's Good
- [Positive observation]

### Summary
[Overall assessment + priority action items]
```
