/**
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * https://github.com/anncwb/vite-plugin-compression
 */
import type { PluginOption } from 'vite'
import compressPlugin from 'vite-plugin-compression'

export function configCompressPlugin({
  compress,
  deleteOriginFile = false,
}: {
  compress: string
  deleteOriginFile?: boolean
}): PluginOption[] {
  const compressList = compress.split(',')

  const plugins: PluginOption[] = []

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        algorithm: 'gzip',
        threshold: 10240, // 超过 10kb 的才压缩
        verbose: true, // 通过verbose禁止在控制台输出压缩结果
        ext: '.gz',
        deleteOriginFile, // 是否删除源文件
      }),
    )
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      }),
    )
  }
  return plugins
}
