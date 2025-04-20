const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const { resolve } = require('path');
const pkg = require('./package.json');

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  // ビルド時に環境変数を定義
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(pkg.version)
  },
  build: {
    rollupOptions: {
      input: {
        // JSファイルを直接エントリーポイントにする
        popup: resolve(__dirname, 'src', 'index.jsx'), 
        options: resolve(__dirname, 'src', 'options.jsx'),
      },
      output: {
        // Chrome 拡張機能ではインラインスクリプトが制限されるため、
        // エントリーポイントごとにファイルを分ける
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name]-chunk-[hash].js`,
        // CSSファイル名の固定設定を削除し、Viteのデフォルト動作に戻す
        assetFileNames: `assets/[name].[ext]`,
      }
    },
    outDir: 'dist', // ビルド結果の出力先ディレクトリ
    emptyOutDir: true, // ビルド時に出力先ディレクトリを空にする
    // assetsDir: '.', // アセットの出力先を dist 直下に変更 (必要に応じて)
    // manifest: true, // manifest.json を生成 (必要に応じて)
  },
  // public ディレクトリの設定はビルド時にinputで指定するため不要になる場合がある
  // publicDir: 'public',
}); 