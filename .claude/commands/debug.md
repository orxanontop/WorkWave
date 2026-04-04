# Debug Command
Systematically debug the reported issue using 10x methodology.

## Debugging Process
1. **Reproduce** — Understand the exact conditions that trigger the issue
2. **Isolate** — Use binary search to narrow down the problem area
3. **Investigate** — Check:
   - Error messages and stack traces
   - Recent changes (git blame, git log)
   - Logs and monitoring data
   - Related issues or known bugs
4. **Hypothesize** — Form a theory about the root cause
5. **Test** — Validate the hypothesis with targeted checks
6. **Fix** — Implement the minimal fix that addresses the root cause
7. **Verify** — Confirm the fix works and doesn't break anything else
8. **Prevent** — Add tests or guards to prevent regression

## Rules
- Use debugger, not just console.log
- Check recent changes first (git log, git blame)
- Rubber duck explain the issue
- Fix root cause, not symptoms
- Add regression tests for every bug fixed

## Output Format
```
## Debug: [issue description]

### Reproduction
- Steps: [how to reproduce]
- Expected: [what should happen]
- Actual: [what happens]

### Root Cause
[Explanation of why this happens]

### Fix
[Code changes with explanation]

### Verification
- [ ] Issue no longer reproducible
- [ ] Existing tests pass
- [ ] New regression test added

### Prevention
[What was added to prevent this class of bug]
```
