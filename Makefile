.PHONY: ci

ci:
	pnpm install --frozen-lockfile
	pnpm knip
	pnpm lint
	pnpm typecheck
	pnpm test
	pnpm build
