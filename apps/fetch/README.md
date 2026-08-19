# @otoge-box/fetch

Node.js batch jobs for fetching arcade song data, updating PostgreSQL, generating JSON,
and publishing immutable releases to Cloudflare R2.

## Setup

```sh
pnpm install
cp .env.example .env
pnpm --filter @otoge-box/fetch db:prepare
```

`DATABASE_URL` must be a Supabase Supavisor session-mode connection string. Each game uses
its own PostgreSQL schema and its own migration metadata table in that schema.

## Tasks

The existing `<game>:<task>` names remain available. The normal `<game>:all` order is the
same as the imported snapshot; a failed child task stops the game with a non-zero status.

```sh
pnpm --filter @otoge-box/fetch run:game -- maimai
pnpm --filter @otoge-box/fetch maimai:fetch-songs
pnpm --filter @otoge-box/fetch aggregate
```

Before any DB mutation, fetched collections are checked for empty results. Replacement tables
are updated inside one transaction, so a failed insert keeps the previous table contents.

## Release contract

`R2_DATA_*` credentials are used only for public data releases. A release is uploaded under a
new prefix and validated before `<game-code>/current.json` is written last. Existing releases
are never overwritten or deleted by the normal publisher. `R2_BACKUP_*` is a separate private
bucket credential used by `db:backup:all` for PostgreSQL custom-format schema backups.

The supported fetch game list is `config/games.json`; `mahjong` is intentionally absent because
the snapshot has no corresponding scraper.
