# 音ゲーぼっくす (otoge-box)

音ゲーの譜面情報検索ツールと、そのデータ取得・公開 batch を管理する pnpm monorepo です。

## 構成

- `apps/web`: Next.js App Router の検索 UI
- `apps/fetch`: Node.js batch。既存の game task 名と実行順を維持しています
- `apps/fetch/data` と `apps/fetch/dist`: 固定 snapshot に含まれる tracked input
- `apps/fetch/snapshot-manifest.json`: 取り込み元 commit と対象 path

## セットアップ

- Node.js 22 以上
- pnpm 11

```sh
pnpm install
cp .env.example .env
pnpm dev
```

開発時に大きなデータ mirror を使う場合は、`apps/web/public/local-data` へ symlink
を作成します。構成は `data.json`、`gallery.yaml`、`img/` を含む配信 layout と同じです。

```sh
ln -s /path/to/local-data apps/web/public/local-data
```

mirror が全 visible game 分そろっていれば、Next.js は自動的に local data を使います。
`LOCAL_DATA_BASE_URL` で明示的に切り替えることもできます。

## データ公開

`apps/fetch` は Supabase PostgreSQL の game 別 schema を使い、schema 作成と migration を
取得処理の前段で実行します。

```sh
pnpm --filter @otoge-box/fetch db:prepare
pnpm --filter @otoge-box/fetch run:game -- maimai
```

生成物は game ごとの変更不能な release prefix に検証後 upload され、最後に
`<game-code>/current.json` がその release を指します。`current.json` は JSON、gallery、
image の一貫した release 境界です。大幅な件数減少を許可する場合だけ、manual workflow で
`ALLOW_LARGE_DECREASE=true` を明示します。

data 公開用の `R2_DATA_*` と PostgreSQL backup 用の `R2_BACKUP_*` credential は分けて設定
してください。web 側は `NEXT_PUBLIC_DATA_BASE_URL` の各 game の current manifest を共通
resolver で解決します。

## 検証

```sh
make ci
```

個別に実行する場合:

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

GitHub Actions は品質検査、web 検査、fetch の PostgreSQL smoke test、fetch の prepare / game
matrix / aggregate、backup を責務ごとに分けます。

### 開発中の service worker

本番ビルドで生成される `apps/web/public/sw.js` は `next dev` でも配信されるため、`pnpm start` などで一度登録した service worker が開発中も本番ビルドのチャンクを返し続け、ページが「データを読み込んでいます…」のまま止まることがあります。開発時は `/sw.js` を `apps/web/src/app/dev-sw-kill/route.ts` へ rewrite し、キャッシュを全削除して自身を unregister する service worker を返しています（リロード 1 回で解消します）。

本番ビルドでは Serwist が service worker を生成します。`public/local-data` が外部ディレクトリを指す symlink の場合、Turbopack の制約によりビルド時だけ一時的に外して、未設定の `LOCAL_DATA_BASE_URL` でリモートデータへ切り替えてください。

## 由来とライセンス

本プロジェクトは [zetaraku/arcade-songs](https://github.com/zetaraku/arcade-songs) を
Next.js へ移植した派生プロジェクトです。オリジナルの MIT License を `LICENSE` に保持
しています。fetch snapshot の由来と commit は `apps/fetch/snapshot-manifest.json` を参照
してください。
