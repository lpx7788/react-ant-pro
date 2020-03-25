const configs = {
  // 测试环境
  test: {
    apiHostName: 'http://192.168.0.130:9900', //运营后台接口地址
    aioHostName: 'http://192.168.0.230:8080', //商城后台接口地址
    dmsHostName: 'http://192.168.0.130:9900',
  },
  // 开发环境
  dev: {
    apiHostName: 'http://192.168.0.230:9091',
    aioHostName: 'http://192.168.0.230:8080',
    dmsHostName: 'http://192.168.0.130:9900',
  },
  // 正式
  prod: {
    apiHostName: 'https://adminapi.manytrader.net',
    aioHostName: 'https://aio.manytrader.net',
  },
};


export default configs;