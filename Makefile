.PHONY: ci

ci:
	pnpm install --frozen-lockfile
	pnpm lint
	pnpm typecheck
	pnpm test
	pnpm build
