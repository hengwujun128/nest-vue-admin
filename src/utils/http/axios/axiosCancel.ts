import type { AxiosRequestConfig } from 'axios';

// 用于存储每个请求的标识和取消函数(global settings)
const pendingMap = new Map<string, AbortController>();

const getPendingUrl = (config: AxiosRequestConfig): string => {
  return [config.method, config.url].join('&');
};

export class AxiosCanceler {
  /**
   * 添加请求
   * @param config 请求配置
   */
  public addPending(config: AxiosRequestConfig): void {
    // 每次添加config 都先清除
    this.removePending(config);
    // 获取axios 配置中的请求 url 和请求方法,并作为key 添加到pendingMap 中
    const url = getPendingUrl(config);
    // abortController js API, 用于取消请求
    const controller = new AbortController();
    // 向 axios 中注入新的属性 single, 其实就是abortController 的 single 属性
    config.signal = config.signal || controller.signal;
    // 存储每个请求的标识
    if (!pendingMap.has(url)) {
      // 如果当前请求不在等待中，将其添加到等待中, 每个请求 api ,就配置一个 AbortController 实例
      pendingMap.set(url, controller);
    }
  }

  /**
   * 清除所有等待中的请求
   */
  public removeAllPending(): void {
    pendingMap.forEach((abortController) => {
      if (abortController) {
        abortController.abort();
      }
    });
    this.reset();
  }

  /**
   * 移除请求
   * @param config 请求配置
   */
  public removePending(config: AxiosRequestConfig): void {
    const url = getPendingUrl(config);
    if (pendingMap.has(url)) {
      // 如果当前请求在等待中，取消它并将其从等待中移除
      const abortController = pendingMap.get(url);
      if (abortController) {
        abortController.abort(url); // NOTE:  可以不用传参
      }
      pendingMap.delete(url);
    }
  }

  /**
   * 重置
   */
  public reset(): void {
    pendingMap.clear();
  }
}
