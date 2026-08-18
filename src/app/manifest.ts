import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest { return { name: '音ゲーぼっくす', short_name: '音ゲーぼっくす', description: '音ゲーの譜面情報検索ツール。', start_url: '/', display: 'standalone', background_color: '#424242', theme_color: '#424242', lang: 'en', icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }] }; }
