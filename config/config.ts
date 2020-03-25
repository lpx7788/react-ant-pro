import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings';
import slash from 'slash2';
import webpackPlugin from './plugin.config';
import env from './env';
const { pwa, primaryColor } = defaultSettings;
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: false,
        default: 'en-US',
        // default: 'zh_CN',
        baseNavigator: true,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  routes: [
    {
      path: '/user',
      component: './user/login',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          // Routes: ['src/pages/Authorized'],
          // authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/home',
            },
            {
              path: '/home',
              name: '平台主页',
              icon: 'home',
              component: './home',
            },
            {
              path: '/company',
              name: ' 企业管理',
              icon: 'windows',
              routes: [
                {
                  path: '/company/companyJoin',
                  name: '入驻申请',
                  component: './company/companyJoin',
                },
                {
                  path: '/company/companyList',
                  name: '企业列表',
                  component: './company/companyList',
                },
                {
                  path: '/company/companyList/companyDetail',
                  name: '企业资料',
                  component: './company/companyDetail',
                  hideInMenu: 'true',
                },
                {
                  path: '/company/companyEdit',
                  name: '编辑公司',
                  component: './company/companyEdit',
                  hideInMenu: 'true',
                },
                {
                  path: '/company/companyAdd',
                  name: '添加企业',
                  component: './company/companyAdd',
                  hideInMenu: 'true',
                },
                {
                  path: '/company/companyUsers',
                  name: '用户列表',
                  component: './company/companyUsers',
                },
                {
                  path: '/company/companyUserDetail',
                  name: '用户详情',
                  component: './company/companyUserDetail',
                  hideInMenu: 'true',
                },
              ],
            },
            {
              path: '/order',
              name: '订单管理',
              icon: 'form',
              component: './order',
            },
            {
              path: '/order/order-detail',
              name: '订单详情',
              icon: 'form',
              component: './order/order-detail',
              hideInMenu: 'true',
            },
            {
              path: '/carousel',
              name: '轮播管理',
              icon: 'form',
              component: './carousel',
            },
            {
              path: '/feedback',
              name: '意见反馈',
              icon: 'smile',
              component: './feedback',
            },
            {
              path: '/information',
              name: '资讯管理',
              icon: 'control',
              routes: [
                {
                  path: '/information/all-information',
                  name: '全部资讯',
                  component: './information/all-information',
                },
                {
                  path: '/information/release-information',
                  name: '发布资讯',
                  component: './information/release-information',
                },
              ],
            },
            {
              path: '/hedging',
              name: '套保管理',
              icon: 'project',
              routes: [
                {
                  path: '/hedging/hedge-account',
                  name: '套保账户',
                  component: './hedging/hedge-account',
                },
                {
                  path: '/hedging/front-address-management',
                  name: '前置地址管理',
                  component: './hedging/front-address-management',
                },
              ],
            },
            {
              path: '/integral',
              name: '积分管理',
              icon: 'red-envelope',
              routes: [
                {
                  path: '/integral/integralOrder',
                  name: '积分订单',
                  icon: 'account-book',
                  component: './integral/integralOrder',
                },
                {
                  path: '/integral/exchangeSet',
                  name: '兑换设置',
                  icon: 'transaction',
                  component: './integral/exchangeSet',
                },
                {
                  path: '/integral/integral-guidePrice',
                  name: '指导价设置',
                  icon: 'property-safety',
                  component: './integral/integral-guidePrice',
                },
                {
                  path: '/integral/integral-detailList',
                  name: '积分明细',
                  icon: 'pay-circle',
                  component: './integral/integral-detailList',
                },
                {
                  path: '/integral/integral-add',
                  name: '积分添加',
                  icon: 'plus-circle',
                  component: './integral/integral-add',
                },
                {
                  path: '/integral/integral-summarize',
                  name: '积分汇总',
                  icon: 'money-collect',
                  component: './integral/integral-summarize',
                },
              ],
            },
            {
              path: '/authenticate',
              name: '认证管理',
              icon: 'windows',
              routes: [
                {
                  path: '/authenticate/user',
                  name: '用户管理',
                  component: './authenticate/user',
                },
                {
                  path: '/authenticate/role',
                  name: '角色管理',
                  component: './authenticate/role',
                },
                {
                  path: '/authenticate/menu',
                  name: '菜单管理',
                  component: './authenticate/menu',
                },
                {
                  path: '/authenticate/application',
                  name: '应用管理',
                  component: './authenticate/application',
                },
                {
                  path: '/authenticate/token',
                  name: 'token管理',
                  component: './authenticate/token',
                },
                {
                  path: '/authenticate/my',
                  name: '我的信息',
                  component: './authenticate/my',
                },
                {
                  component: './exception/403',
                },
                {
                  component: './exception/404',
                },
              ],
            },
            {
              path: '/start-page',
              name: '启动页广告管理',
              icon: 'form',
              component: './start-page',
            },
            {
              path: '/start-page/advertisement-add/index',
              name: '启动页广告详情',
              component: './start-page/advertisement-add/index',
              hideInMenu: 'true',
            },
            {
              path: '/monitor',
              name: '系统监控',
              icon: 'windows',
              routes: [
                {
                  path: '/monitor/users',
                  name: '在线用户',
                  component: './monitor/users',
                },
                {
                  path: '/monitor/log',
                  name: '系统日志',
                  component: './monitor/log',
                },
                {
                  path: '/monitor/redis',
                  name: 'Redis监控',
                  component: './monitor/redis',
                },
                {
                  path: '/monitor/trace',
                  name: '请求追踪',
                  component: './monitor/trace',
                },
                {
                  path: '/monitor/message',
                  name: '系统信息',
                  icon: 'windows',
                  routes: [
                    {
                      path: '/monitor/message/jvm',
                      name: 'JVM信息',
                      component: './monitor/message/jvm',
                    },
                    {
                      path: '/monitor/message/tomcat',
                      name: 'Tomcat信息',
                      component: './monitor/message/tomcat',
                    },
                    {
                      path: '/monitor/message/server',
                      name: '服务器信息',
                      component: './monitor/message/server',
                    }  
                  ]
                },
                 
                {
                  component: './exception/403',
                },
                {
                  component: './exception/404',
                },
              ],
            },
            {
              path: '/task',
              name: '任务调度',
              icon: 'windows',
              routes: [
                {
                  path: '/task/timed-task',
                  name: '定时任务',
                  component: './task/timed-task',
                },               
                {
                  path: '/task/operation-log',
                  name: '调度日志',
                  component: './task/operation-log',
                },               
                {
                  component: './exception/403',
                },
                {
                  component: './exception/404',
                },
              ],
            },
            {
              path: '/netResource',
              name: '网络资源',
              icon: 'windows',
              routes: [
                {
                  path: '/netResource/netResource-festivals',
                  name: '节假日查询',
                  component: './netResource/netResource-festivals',
                },               
                {
                  path: '/netResource/netResource-contractMonth',
                  name: '期货公司合约月',
                  component: './netResource/netResource-contractMonth',
                }, 
                {
                  path: '/netResource/netResource-contractActiveTime',
                  name: '合约活跃时间段',
                  component: './netResource/netResource-contractActiveTime',
                },               
                {
                  path: '/netResource/netResource-referencePrice',
                  name: '现货参考网价',
                  component: './netResource/netResource-referencePrice',
                }, 
                {
                  path: '/netResource/netResource-timeSharingplan',
                  name: '合约分时图',
                  component: './netResource/netResource-timeSharingplan',
                },
                {
                  component: './exception/403',
                },
                {
                  component: './exception/404',
                },
              ],
            },
            {
              component: './exception/403',
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          component: './exception/403',
        },
        {
          component: './exception/404',
        },
      ],
    },
    {
      component: './exception/403',
    },
    {
      component: './exception/404',
    },
  ],
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '',
    'process.env.API_ENV': process.env.API_ENV || 'dev',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/agencyUrl': {
      target: process.env.API_ENV ? env[process.env.API_ENV].apiHostName : '',
      changeOrigin: true,
      pathRewrite: {
        '^/agencyUrl': '',
      },
      headers: {
        credentials: 'include',
      },
    },
    '/agencyUrl_aio': {
      target: process.env.API_ENV ? env[process.env.API_ENV].aioHostName : '',
      changeOrigin: true,
      pathRewrite: {
        '^/agencyUrl_aio': '',
      },
    },
    '/agencyUrl_dms': {
      target: process.env.API_ENV ? env[process.env.API_ENV].dmsHostName : '',
      changeOrigin: true,
      pathRewrite: {
        '^/agencyUrl_dms': '',
      },
    },
  },
} as IConfig;

