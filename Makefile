.PHONY: ci

ci:
	pnpm install --frozen-lockfile
	pnpm knip
	pnpm lint
	pnpm format:check
	pnpm typecheck
	pnpm test:coverage
	pnpm build
