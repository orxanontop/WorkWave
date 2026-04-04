# Explain Command
Explain how the specified code works in clear, concise terms.

## Steps
1. Read and understand the code fully
2. Explain at the appropriate level:
   - What problem does it solve?
   - How does the architecture work?
   - What are the key components and their responsibilities?
   - What are the data flows and state changes?
3. Identify design patterns in use
4. Highlight potential issues or improvements
5. Use diagrams (ASCII or mermaid) for complex flows

## Output Format
```
## Explanation: [component/file]

### Purpose
[What problem this solves]

### Architecture
[How it's structured and why]

### Key Components
- [Component]: [responsibility]

### Data Flow
[How data moves through the system]

### Design Patterns
- [Pattern]: [where and how it's used]

### Potential Improvements
- [Suggestion with reasoning]
```

## Rules
- Explain WHY, not just WHAT (code shows what)
- Keep it concise — focus on what matters
- Use concrete examples when helpful
- Flag any anti-patterns or code smells
