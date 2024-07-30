import { presetTypography, presetUno } from 'unocss'
import UnoCSS from 'unocss/vite'
import { type UserConfig } from 'vite'

const commonConfig: (mode: string) => UserConfig = (mode) => ({
  server: {
    host: true,
  },
  // 生产环境会 drop 掉 console 和 debugger
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // TODO: Prevent memory overflow
      maxParallelFileOps: 3,
    },
  },
  plugins: [
    UnoCSS({
      presets: [presetUno(), presetTypography()],
    }),
  ],
})

export { commonConfig }
