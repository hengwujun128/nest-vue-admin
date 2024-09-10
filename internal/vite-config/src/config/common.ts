import { presetTypography, presetUno } from 'unocss'
import UnoCSS from 'unocss/vite'
import { type UserConfig } from 'vite'

const commonConfig: (mode: string) => UserConfig = (mode) => ({
  server: {
    host: true,
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    // drop: ['console', 'debugger'],
  },
  build: {
    reportCompressedSize: false, // 压缩输出大型文件可能很慢,禁用此功能,提高构建性能
    chunkSizeWarningLimit: 1500, //（以 kB 为单位）
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
