import '@testing-library/jest-dom';
import { cleanup, prisma } from '../fixtures';

// ---------------------------------------------------------------------------
// Global test setup — runs once before all tests in a file
// ---------------------------------------------------------------------------

beforeAll(async () => {
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = 'test-secret-for-integration-tests';
  }
});

afterAll(async () => {
  // Cleanup any seeded data after each test file
  try {
    await cleanup();
  } catch (e) {
    // Ignore cleanup errors in test isolation
  }
  await prisma.$disconnect();
});
