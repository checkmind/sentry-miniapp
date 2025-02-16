import * as Sentry from "./vendor/sentry-minapp.wx.min";

// console.log(Sentry);
// 初始化 Sentry
Sentry.init({
  dsn: "https://47703e01ba4344b8b252c15e8fd980fd@sentry.io/1528228"
});

App({
  globalData: {
    userInfo: null
  },
  async onLaunch() {
    // 展示本地存储能力
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // console.log(res.userInfo);
              const {
                nickName,
                country,
                province,
                city,
                avatarUrl
              } = res.userInfo;

              Sentry.setUser({
                id: nickName
              });
              Sentry.setTag("country", country);
              Sentry.setExtra("province", province);
              Sentry.setExtras({
                city,
                avatarUrl
              });
              // Sentry.captureException(
              //   new Error("Good good stydy, day day up!")
              // );
              // Sentry.captureMessage("Hello, sentry-miniapp!");

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });

    // 测试 异常是否可以上报
    // throw new Error("this is a test error.");
    // throw new Error("lalalalalala");
    // myUndefinedFunction();

    // 测试 async 函数中异常是否可以被 onError 捕获 
    const ret = await new Promise((resolve) => {
      setTimeout(() => {
        resolve('this is await ret.');
      }, 2000);
    });
    console.log(ret);
    // myrUndefinedFunctionInAsyncFunction();

    // 一种可以在 async 函数中进行主动上报异常的方式
    // try {
    //   myrUndefinedFunctionInAsyncFunction();
    // } catch (e) {
    //   Sentry.captureException(e)
    // }

    // 测试 WX API 调用失败是否会上报
    wx.getStorage({
      success(res) {
        console.log(res);
      },
      // fail(error) {
      //   console.log('API 调用失败: ', error);
      // }
    })
  },
  onShow() {
    // 测试 Promise 中异常是否可以上报
    new Promise((resovle, reject) => {
      inPromiseFn();
      resovle();
    })
    // .then((res) => {
    //   console.log(res);
    // }, (err) => {
    //   console.log(err);
    //   Sentry.captureException(err)
    // });
  },
  // 不需要显示调用 Sentry.captureException(error)
  onError(error) {
    console.warn(error);
    // Sentry.captureException(error);
  },
  // onPageNotFound(res) {
  //   console.warn(res);
  // }
});
