import { resolve } from 'node:path'

import dayjs from 'dayjs'
import { readPackageJSON } from 'pkg-types'
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite'

import { createPlugins } from '../plugins'
import { generateModifyVars } from '../utils/modifyVars'
import { commonConfig } from './common'

interface DefineOptions {
  overrides?: UserConfig
  options?: {
    //
  }
}

function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions

  return defineConfig(async ({ command, mode }) => {
    console.log({
      command,
      mode,
    })
    // load all environment variables
    const root = process.cwd()
    const isBuild = command === 'build'
    const { VITE_PUBLIC_PATH, VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_ENABLE_ANALYZE } = loadEnv(
      mode,
      root,
    )

    const defineData = await createDefineData(root)
    // plugins
    const plugins = await createPlugins({
      isBuild,
      root,
      enableAnalyze: VITE_ENABLE_ANALYZE === 'true',
      enableMock: VITE_USE_MOCK === 'true',
      compress: VITE_BUILD_COMPRESS, //  none | gzip | brotli
    })

    const pathResolve = (pathname: string) => resolve(root, '.', pathname)

    //公共配置
    const applicationConfig: UserConfig = {
      base: VITE_PUBLIC_PATH,
      resolve: {
        alias: [
          {
            find: 'vue-i18n',
            replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
          },
          // /@/xxxx => src/xxxx
          {
            find: /\/@\//,
            replacement: pathResolve('src') + '/',
          },
          // /#/xxxx => types/xxxx
          {
            find: /\/#\//,
            replacement: pathResolve('types') + '/',
          },
          // @/xxxx => src/xxxx
          {
            find: /@\//,
            replacement: pathResolve('src') + '/',
          },
          // #/xxxx => types/xxxx
          {
            find: /#\//,
            replacement: pathResolve('types') + '/',
          },
        ],
      },
      define: defineData,
      build: {
        target: 'es2015',
        cssTarget: 'chrome80',
        rollupOptions: {
          output: {
            // 入口文件名
            entryFileNames: 'assets/[name].js',
            manualChunks: {
              vue: ['vue', 'pinia', 'vue-router'],
              echarts: ['echarts'],
              antd: ['ant-design-vue', '@ant-design/icons-vue'],
            },

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // manualChunks: (id, { getModuleInfo, getModuleIds }) => {
            //   if (id.includes('node_modules')) {
            //     return 'vendor'
            //   }
            // },
          },
        },
      },
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: generateModifyVars(),
            javascriptEnabled: true,
          },
        },
      },
      plugins,
    }
    //第一次 merge, 每个环境公共配置和应用配置进行合并
    const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig)
    // console.log(mergedConfig)
    //第二次 merge, 使用自定义配置去覆盖第一次合并的配置
    return mergeConfig(mergedConfig, overrides)
  })
}

async function createDefineData(root: string) {
  try {
    // read package.json in root
    const pkgJson = await readPackageJSON(root)
    const { dependencies, devDependencies, name, version } = pkgJson

    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    }
  } catch (error) {
    return {}
  }
}

export { defineApplicationConfig }
