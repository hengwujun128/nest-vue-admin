/**
 * Package file volume analysis
 */
import visualizer from 'rollup-plugin-visualizer'
import { type PluginOption } from 'vite'

export function configVisualizerConfig() {
  return visualizer({
    // 生成文件地址
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true, // 是否自动打开浏览器进行预览
    gzipSize: true, // 开启gzip
    brotliSize: true, // 开启 brotli
  }) as PluginOption
}
