# Testing

This project uses Vitest for unit tests.

## Run all tests (watch)

```bash
npm run test
```

## Run once (CI)

```bash
npm run test:run
```

## Notes

- UI tests use jsdom and mock all Convex database hooks in `src/test/setup.ts`.
- Convex function tests live under `convex/` and use an in-memory db mock.
