---
name: tests
description: >-
  Use when the user asks about testing, writing tests, running tests,
  test coverage, Jest setup, or anything related to unit tests for this backend.
  Also trigger when the user mentions `*.test.ts`, `tests/`, `jest`, `coverage`,
  or mocks/fixtures.
---

# Testing

This backend uses **Jest** with **ts-jest** for unit tests.

## Commands

- `npm run test` — run all tests once
- `npm run test:watch` — run tests in watch mode
- `npm run test:coverage` — run tests with coverage report

## Configuration

- `jest.config.ts` — Jest config (preset: ts-jest, environment: node)
- `tsconfig.test.json` — extends `tsconfig.json`, includes `src/` and `tests/`
  so test files compile without polluting the `dist/` build.

## Directory layout

```
tests/
├── unit/          # unit tests (mirrors src/ structure)
│   └── domain/
│   └── application/
│   └── infrastructure/
│   └── presentation/
└── mocks/         # shared mocks, stubs, and test factories
```

## Conventions

1. **Test file naming**: `*.test.ts`
2. **Co-location rule**: place test files inside `tests/unit/` mirroring the
   `src/` path of the file under test.
   - Example: `src/domain/orders/entities/Order.ts` →
     `tests/unit/domain/orders/entities/Order.test.ts`
3. **Path aliases**: `@/*` maps to `src/*` in tests just like in source code.
4. **Coverage**: collected from `src/**/*.ts`, excluding `src/**/index.ts` and
   generated Prisma code.
5. **No integration / E2E tests yet** — current setup is unit-test only.

## Writing unit tests

- Mock external dependencies (repositories, DB client, HTTP clients).
- Keep tests deterministic — no real network calls or DB writes.
- Prefer factory functions in `tests/mocks/` for reusable entity builders.

## Dependencies

- `jest`
- `ts-jest`
- `@types/jest`
