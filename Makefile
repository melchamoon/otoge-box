.PHONY: ci

ci:
	pnpm install --frozen-lockfile
	pnpm audit --audit-level=high
	pnpm knip
	pnpm lint
	pnpm format:check
	pnpm typecheck
	pnpm test:coverage
	pnpm build
