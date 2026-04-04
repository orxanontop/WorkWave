# Security Audit Command
Audit the specified code for security vulnerabilities following 10x standards.

## Security Checklist

### Input Validation
- [ ] All user input validated and sanitized
- [ ] No SQL injection (parameterized queries only)
- [ ] No XSS (output encoding/escaping)
- [ ] No command injection (no shell execution with user input)
- [ ] File upload validation (type, size, path traversal)

### Authentication & Authorization
- [ ] Passwords hashed with bcrypt/argon2 (never plain text)
- [ ] Session management secure (HttpOnly, Secure, SameSite cookies)
- [ ] Principle of least privilege enforced
- [ ] No hardcoded credentials or API keys
- [ ] Rate limiting on auth endpoints

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced, no mixed content
- [ ] No sensitive data in logs
- [ ] Proper CORS configuration
- [ ] CSRF protection on state-changing operations

### Dependencies
- [ ] No known vulnerabilities (npm audit, etc.)
- [ ] Dependencies pinned to specific versions
- [ ] No unnecessary dependencies
- [ ] Regular dependency updates scheduled

### Common Vulnerabilities
- [ ] No eval() or equivalent
- [ ] No prototype pollution
- [ ] No insecure deserialization
- [ ] Proper error handling (no stack traces to users)
- [ ] Safe redirect URLs

## Steps
1. Scan the code against the full checklist
2. Rate findings: 🔴 Critical, 🟡 Warning, 🟢 Safe
3. Provide specific fixes with code examples
4. Prioritize by severity and exploitability

## Output Format
```
## Security Audit: [component/file]

### 🔴 Critical (Fix Immediately)
- [Vulnerability]: [location] → [fix]

### 🟡 Warnings (Fix Soon)
- [Issue]: [location] → [recommendation]

### 🟢 Secure
- [What's done well]

### Summary
[Overall security posture + priority actions]
```
