# Refactor Command
Refactor the specified code to meet 10x developer standards.

## Steps
1. Identify code smells in the target code:
   - God functions (>30 lines, multiple responsibilities)
   - Duplicate code / DRY violations
   - Deep nesting (>3 levels)
   - Long parameter lists (>3 params)
   - Feature envy (using other classes more than own)
   - Dead code / unused imports
2. Apply refactoring patterns:
   - Extract Method for long functions
   - Extract Class for God objects
   - Replace conditional with Strategy/Factory pattern
   - Introduce early returns to reduce nesting
   - Extract constants for magic numbers/strings
   - Apply composition over inheritance
3. Preserve all existing behavior — write tests first if none exist
4. Make small, atomic changes with clear intent
5. Verify tests pass after each refactoring step

## Rules
- NEVER change behavior during refactoring
- Keep functions under 30 lines
- Max 3 parameters per function (use objects for more)
- Early returns over nested conditionals
- One responsibility per function/class

## Output
Show before/after for each refactored section with explanation of WHY the change improves the code.
