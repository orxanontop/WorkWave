# Document Command
Generate or update documentation following 10x standards.

## Documentation Types
1. **Code Documentation**
   - JSDoc/docstrings for public APIs
   - Inline comments for complex logic only (explain WHY, not WHAT)
   - Type definitions and interfaces

2. **Project Documentation**
   - README with setup, usage, and contribution guide
   - Architecture Decision Records (ADRs) for major choices
   - API documentation (OpenAPI/Swagger format)

3. **Process Documentation**
   - Environment setup instructions
   - Deployment process
   - Common troubleshooting guide

## Steps
1. Identify what needs documentation
2. Follow the documentation standards:
   - Keep it concise and up-to-date
   - Include code examples
   - Explain decisions, not just facts
   - Use consistent formatting
3. Update docs alongside code changes
4. Remove outdated documentation

## Output
Generate documentation in the appropriate format:
- JSDoc for functions/classes
- Markdown for README/docs
- YAML/JSON for API specs
- ADR template for architecture decisions

## Rules
- Docs explain WHY, code shows WHAT
- Keep docs synchronized with code
- No documentation for obvious code
- Examples over descriptions when possible
