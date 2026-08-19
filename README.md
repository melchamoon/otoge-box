# 音ゲーぼっくす (otoge-box)

音ゲーの譜面情報検索ツールです。Next.js App Router、React、TypeScript、Tailwind CSS で動作します。

## 由来

本プロジェクトは [zetaraku/arcade-songs](https://github.com/zetaraku/arcade-songs)
(MIT License, Copyright (c) Raku Zeta) を Next.js へ移植した派生プロジェクトです。
オリジナルの LICENSE を `LICENSE` に保持しています。譜面データはオリジナルと同じ配信元を参照しています。

## セットアップ

- Node.js 22 以上
- pnpm 11

```sh
pnpm install
cp .env.example .env
pnpm dev
```

## Local development data

While developing, the songs data is read from the local copy under `public/local-data/`
instead of the remote data source, so that no request is made to the CDN.

That directory is git-ignored and has to be filled in once. It mirrors the layout of
the remote data source, whose URL is listed per game in `src/data/sites.json`:

```
public/local-data/<gameCode>/data.json
public/local-data/<gameCode>/gallery.yaml       # only some games have one
public/local-data/<gameCode>/img/cover/<imageName>
public/local-data/<gameCode>/img/cover-m/<imageName>
public/local-data/<gameCode>/img/<iconUrl>      # type / difficulty icons, locked.png
```

- `<imageName>` is listed in `data.json` for every song and sheet. Note that the
  `any` game refers to the images of the other games by a relative path, so it has
  no images of its own.
- The remote data source is used instead whenever `data.json` is missing for any
  of the games, so the site still works before the copy is made.
- `LOCAL_DATA_BASE_URL` in `.env` overrides all of the above.

For the large local data set, create a symlink rather than copying it:

```sh
ln -s /path/to/local-data public/local-data
```

## 環境変数

公開環境の URL と報告先は `NEXT_PUBLIC_*` 変数で設定します。

## 開発・検証

CI と同じ検証をローカルで実行する場合:

```sh
make ci
```

```sh
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

### 開発中の service worker

本番ビルドで生成される `public/sw.js` は `next dev` でも配信されるため、`pnpm start` などで一度登録した service worker が開発中も本番ビルドのチャンクを返し続け、ページが「データを読み込んでいます…」のまま止まることがあります。開発時は `/sw.js` を `src/app/dev-sw-kill/route.ts` へ rewrite し、キャッシュを全削除して自身を unregister する service worker を返しています（リロード 1 回で解消します）。

本番ビルドでは Serwist が service worker を生成します。`public/local-data` が外部ディレクトリを指す symlink の場合、Turbopack の制約によりビルド時だけ一時的に外して、未設定の `LOCAL_DATA_BASE_URL` でリモートデータへ切り替えてください。

## データソース

譜面データの取得元は [arcade-songs-fetch](https://github.com/zetaraku/arcade-songs-fetch) です。

## ライセンス

Copyright © 2022 Raku Zeta.

Licensed under the MIT License. See [LICENSE](./LICENSE).
