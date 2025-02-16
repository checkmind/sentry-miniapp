declare const wx: any;
declare const my: any;
declare const tt: any;

/**
 * 小程序平台 SDK 接口
 */
interface SDK {
  request: Function;
  getSystemInfoSync: Function;
  onError?: Function;
  onPageNotFound?: Function;
  onMemoryWarning?: Function;
}

/**
 * 获取跨平台的 SDK
 */
const getSDK = () => {
  let sdk: SDK = {
    // tslint:disable-next-line: no-empty
    request: () => { },
    // tslint:disable-next-line: no-empty
    getSystemInfoSync: () => { }
  };

  if (typeof wx === 'object') {  // 微信平台
    // tslint:disable-next-line: no-unsafe-any
    sdk = wx;
  } else if (typeof my === 'object') {  // 支付宝平台
    // tslint:disable-next-line: no-unsafe-any
    sdk = my;
  } else if (typeof tt === 'object') {  // 字节跳动平台
    // tslint:disable-next-line: no-unsafe-any
    sdk = tt;
  } else {
    throw new Error('sentry-miniapp 暂不支持此平台');
  }

  return sdk;
}

export {
  getSDK
};