.PHONY: ci

ci:
	pnpm install --frozen-lockfile
	pnpm knip
	pnpm check:duplicates
	pnpm lint
	pnpm format:check
	pnpm --filter @otoge-box/web exec next typegen
	pnpm typecheck
	pnpm test
	pnpm test:coverage
	pnpm build
