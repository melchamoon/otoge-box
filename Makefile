.PHONY: ci

ci:
	pnpm install --frozen-lockfile
	pnpm knip
	pnpm check:duplicates
	pnpm lint
	pnpm format:check
	pnpm typecheck
	pnpm test:coverage
	pnpm build
