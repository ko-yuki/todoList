import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  /* routes: [
    { path: '/', component: '@/pages/index' },
  ], */
  fastRefresh: {},
  publicPath: './',
  history: {
    type: 'hash'
  },
  exportStatic: {
    htmlSuffix: true,
    dynamicRoot: true,
    supportWin: true,
  },
  favicon: './favicon.ico',
});
