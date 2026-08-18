import fs from 'fs';
import path from 'path';
import type { NuxtConfig } from '@nuxt/types';
import locales from './locales';
import sites from './data/sites.json';
import { Data } from './types';

declare module '@nuxt/types/config/runtime' {
  interface NuxtRuntimeConfig {
    siteTitle?: string;
    siteUrl?: string;
    siteReportUrl?: string;
    sourceCodeUrl?: string;
    siteDescriptionEn?: string;
    siteDescriptionJp?: string;
    localDataBaseUrl?: string;
  }
}

const LOCAL_DATA_DIR = 'static/local-data';

function getLocalDataPath(gameCode: string) {
  return path.resolve(__dirname, LOCAL_DATA_DIR, gameCode, 'data.json');
}

/**
 * Where the songs data is loaded from.
 *
 * `LOCAL_DATA_BASE_URL` takes precedence; set it to an empty string to force the
 * remote data source. Otherwise the local data copy under `static/local-data/` is
 * used automatically while developing, as long as every game is present there.
 */
const localDataBaseUrl = (() => {
  if (process.env.LOCAL_DATA_BASE_URL !== undefined) {
    return process.env.LOCAL_DATA_BASE_URL || undefined;
  }

  const isLocalDataReady = sites.every((site) => fs.existsSync(getLocalDataPath(site.gameCode)));

  return process.env.NODE_ENV === 'development' && isLocalDataReady ? '/local-data' : undefined;
})();

// The local data copy is read from the file system here, since a site-absolute
// path cannot be fetched while building.
async function loadSiteData(site: (typeof sites)[number]) {
  const localDataPath = getLocalDataPath(site.gameCode);

  if (localDataBaseUrl !== undefined && fs.existsSync(localDataPath)) {
    return JSON.parse(fs.readFileSync(localDataPath, 'utf8')) as Data;
  }

  const response = await fetch(`${site.dataSourceUrl}/data.json`);
  const data = await response.json() as Data;

  return data;
}

const nuxtConfig: NuxtConfig = {
  generate: {
    fallback: '404.html',
  },

  router: {
    trailingSlash: true,
  },

  publicRuntimeConfig: {
    siteTitle: process.env.SITE_TITLE,
    siteUrl: process.env.SITE_URL,
    siteReportUrl: process.env.SITE_REPORT_URL,
    sourceCodeUrl: process.env.SOURCE_CODE_URL,
    siteDescriptionEn: process.env.SITE_DESCRIPTION_EN,
    siteDescriptionJp: process.env.SITE_DESCRIPTION_JP,
    localDataBaseUrl,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // Self-hosted copies of the assets that @nuxtjs/vuetify loads from a CDN by
    // default (see `defaultAssets` in the Vuetify configuration below).
    '@fontsource/roboto/100.css',
    '@fontsource/roboto/300.css',
    '@fontsource/roboto/400.css',
    '@fontsource/roboto/500.css',
    '@fontsource/roboto/700.css',
    '@fontsource/roboto/900.css',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/styles/global.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/i18n-vuetify.client.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://composition-api.nuxtjs.org/
    '@nuxtjs/composition-api/module',
    // https://pinia.vuejs.org/ssr/nuxt.html
    '@pinia/nuxt',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://i18n.nuxtjs.org/
    '@nuxtjs/i18n',
    // https://sitemap.nuxtjs.org/
    '@nuxtjs/sitemap',
  ],

  i18n: {
    baseUrl: process.env.SITE_URL,
    langDir: '~/locales/',
    locales,
    defaultLocale: 'en',
    strategy: 'no_prefix',
    lazy: true,
    vueI18n: {
      fallbackLocale: 'en',
    },
  },

  sitemap: {
    hostname: process.env.SITE_URL,
    path: '/sitemap.xml',
    sitemaps: sites.filter((site) => !site.isHidden).map((site) => ({
      path: `/sitemap-${site.gameCode}.xml`,
      async routes() {
        const data = await loadSiteData(site);

        return [
          `/${site.gameCode}/`,
          `/${site.gameCode}/timeline/`,
          `/${site.gameCode}/gallery/`,
          `/${site.gameCode}/songs/`,
          `/${site.gameCode}/about/`,
          ...data.songs.map((song) => `/${site.gameCode}/song/?id=${encodeURIComponent(song.songId!)}`),
        ];
      },
    })),
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/styles/variables.scss'],
    optionsPath: '~/vuetify.options.ts',
    treeShake: true,
    // The Roboto font and the MDI icon font are bundled through `css` above
    // instead of being loaded from Google Fonts / jsDelivr.
    defaultAssets: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vuetify/src/locale',
      'vue-echarts',
      'echarts',
      'zrender',
      'yaml',
    ],
    extend(config) {
      config.module?.rules.push({
        test: /\.ya?ml$/,
        type: 'javascript/auto',
        use: 'yaml-loader',
      });
    },
  },
};

export default nuxtConfig;
