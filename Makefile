.PHONY: ci

ci:
	pnpm install --frozen-lockfile
	pnpm knip
	pnpm check:duplicates
	pnpm lint
	pnpm format:check
	pnpm next typegen
	pnpm typecheck
	pnpm test:coverage
	pnpm build
