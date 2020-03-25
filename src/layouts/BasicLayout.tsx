import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
import logo from '../assets/img/LOGO-32.png';
import Footer from './Footer';
import { SettingDrawer } from '@ant-design/pro-layout';
// import Authorized from '@/utils/Authorized';
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  dispatch: Dispatch;
  menuData: any;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const footerRender: BasicLayoutProps['footerRender'] = () => <Footer/>;

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings } = props;
  useEffect(() => {
    if (dispatch) {
      if (localStorage.getItem('token')) {
        dispatch({
          type: 'login/getMenuDatas',
        });
      }
    }
  }, []);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const routeList: any = [];
  const getRouteLists = function getRouteList(arr: any) {
    arr.forEach((item: any) => {
      if (item.subMenus) {
        if (item.subMenus[0].hideInMenu) {
          routeList.push(item.path);
        } else {
          getRouteList(item.subMenus);
        }
      } else {
        // if (item.hideInMenu) return;
        routeList.push(item.path);
      }
    });
    return routeList;
  };

  const configroute: any = [];
  const getconfigrouteLists = function configrouteList(arr: any) {
    arr.forEach((item: any) => {
      if (item.children) {
        if (item.children[0].hideInMenu) {
          configroute.push(item.path);
        } else {
          configrouteList(item.children);
        }
      } else {
        // if (item.hideInMenu) return;
        configroute.push(item.path);
      }
    }); 
    return configroute;
  }; // 处理动态菜单

  const menuRouteDatas: any = (menuLists: MenuDataItem[]): MenuDataItem[] => {
    let { menuData } = props;
    menuData = [
      {
        path: '/home',
        name: '首页平台',
        icon: 'home',
        component: './home',
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
        hideInMenu: 'true',
      },
      {
        path: '/carousel',
        name: '轮播管理',
        icon: 'form',
        component: './carousel',
      },
      {
        path: '/company',
        name: '企业管理',
        icon: 'windows',
        subMenus: [
          {
            path: '/company/companyJoin',
            name: '入驻申请',
          },
          {
            path: '/company/companyList',
            name: '企业列表',
          },
          {
            path: '/company/companyList/companyDetail',
            name: '企业资料',
            hideInMenu: 'true',
          },
          {
            path: '/company/companyEdit',
            name: '编辑公司',
            hideInMenu: 'true',
          },
          {
            path: '/company/companyAdd',
            name: '添加企业',
            hideInMenu: 'true',
          },
          {
            path: '/company/companyUsers',
            name: '用户列表',
          },
          {
            path: '/company/companyUserDetail',
            name: '用户详情',
            hideInMenu: 'true',
          },
        ],
      },
      {
        createTime: 1510937819000,
        updateTime: 1544713369000,
        parentId: -1,
        id: 2,
        name: '认证管理',
        path: '/authenticate',
        icon: 'windows',
        css: 'layui-icon-set',
        url: 'javascript:;',
        sort: 1,
        type: 1,
        hidden: false,
        pathMethod: null,
        subMenus: [
          {
            id: 21,
            createTime: 1510937819000,
            updateTime: 1537356374000,
            parentId: 2,
            name: '用户管理',
            css: 'layui-icon-friends',
            url: '#!user',
            path: '/authenticate/user',
            sort: 2,
            type: 1,
            hidden: false,
            pathMethod: null,
            roleId: null,
            menuIds: null,
            subMenus: [
              {
                id: 99,
                createTime: 1510937819000,
                updateTime: 1537356374000,
                parentId: 2,
                name: '按钮1',
                css: 'layui-icon-friends',
                url: '#!user',
                path: '/authenticate/1',
                sort: 2,
                type: 1,
                hideInMenu: true,
                pathMethod: null,
                subMenus: null,
                roleId: null,
                menuIds: null,
              },
              {
                id: 96,
                createTime: 1510937819000,
                updateTime: 1537356374000,
                parentId: 2,
                name: '按钮2',
                css: 'layui-icon-friends',
                url: '#!user',
                path: '/authenticate/2',
                sort: 2,
                type: 1,
                hideInMenu: true,
                pathMethod: null,
                subMenus: null,
                roleId: null,
                menuIds: null,
              },
            ],
          },
          {
            id: 22,
            createTime: 1510937819000,
            updateTime: 1547480080000,
            parentId: 2,
            name: '角色管理',
            css: 'layui-icon-user',
            url: '#!role',
            path: '/authenticate/role',
            sort: 3,
            type: 1,
            hidden: false,
            pathMethod: null,
            subMenus: null,
            roleId: null,
            menuIds: null,
          },
          {
            id: 23,
            createTime: 1510937819000,
            updateTime: 1535941427000,
            parentId: 2,
            name: '菜单管理',
            css: 'layui-icon-menu-fill',
            url: '#!menus',
            path: '/authenticate/menu',
            sort: 4,
            type: 1,
            hidden: false,
            pathMethod: null,
            subMenus: null,
            roleId: null,
            menuIds: null,
          },
          {
            id: 24,
            createTime: 1510937819000,
            updateTime: 1535941427000,
            parentId: 2,
            name: '应用管理',
            css: 'layui-icon-menu-fill',
            url: '#!menus',
            path: '/authenticate/application',
            sort: 4,
            type: 1,
            hidden: false,
            pathMethod: null,
            subMenus: null,
            roleId: null,
            menuIds: null,
          },
          {
            id: 24,
            createTime: 1510937819000,
            updateTime: 1535941427000,
            parentId: 2,
            name: 'token管理',
            css: 'layui-icon-menu-fill',
            url: '#!menus',
            path: '/authenticate/token',
            sort: 4,
            type: 1,
            hidden: false,
            pathMethod: null,
            subMenus: null,
            roleId: null,
            menuIds: null,
          },
        ],
        roleId: null,
        menuIds: null,
      },
      {
        path: '/integral',
        name: '积分管理',
        icon: 'red-envelope',
        subMenus: [
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
          path: '/hedging',
          name: '套保管理',
          icon: 'project',
          subMenus: [
            {
              path: '/hedging/hedge-account',
              name: '套保账户',
            },
            {
              path: '/hedging/front-address-management',
              name: '前置地址管理',
            },
          ],
      },
      {
        path: '/information',
        name: '资讯管理',
        icon: 'control',
        subMenus: [
          {
            path: '/information/all-information',
            name: '全部资讯',
          },
          {
            path: '/information/release-information',
            name: '发布资讯',
          },
        ],
      },
      {
        path: '/start-page',
        name: '启动页广告管理',
        icon: 'form',
      },
      {
        path: '/start-page/advertisement-add/index',
        name: '启动页广告详情',
        hideInMenu: 'true',
      },
      {
        path: '/monitor',
        name: '系统监控',
        icon: 'windows',
        subMenus: [
          {
            path: '/monitor/users',
            name: '在线用户',
          },
          {
            path: '/monitor/log',
            name: '系统日志',
          },
          {
            path: '/monitor/redis',
            name: 'Redis监控',
          },
          {
            path: '/monitor/trace',
            name: '请求追踪',
          },
          {
            path: '/monitor/message',
            name: '系统信息',
            subMenus: [
              {
                path: '/monitor/message/jvm',
                name: 'JVM信息',
                component: './monitor/message/jvm',
              },
              {
                path: '/monitor/message/tomcat',
                name: 'Tomcat信息',
              },
              {
                path: '/monitor/message/server',
                name: '服务器信息',
              }  
            ]
          },
        ],
      },
      {
        path: '/task',
        name: '任务调度',
        icon: 'windows',
        subMenus: [
          {
            path: '/task/timed-task',
            name: '定时任务',
          },               
          {
            path: '/task/operation-log',
            name: '调度日志',
          },               
        ],
      },
      {
        path: '/netResource',
        name: '网络资源',
        icon: 'windows',
        subMenus: [
          {
            path: '/netResource/netResource-festivals',
            name: '节假日查询',
          },               
          {
            path: '/netResource/netResource-contractMonth',
            name: '期货公司合约月',
          }, 
          {
            path: '/netResource/netResource-contractActiveTime',
            name: '合约活跃时间段',
          },               
          {
            path: '/netResource/netResource-referencePrice',
            name: '现货参考网价',
          }, 
          {
            path: '/netResource/netResource-timeSharingplan',
            name: '合约分时图',
          },
        ],
      },
    ];
    const configRouteArrList = menuData.length != 0 ? getconfigrouteLists(menuLists) : '';
    const routeArrList = menuData.length != 0 ? getRouteLists(menuData) : [];
    const { pathname } = location;
 
    if (
      pathname != '/exception/404' &&
      pathname != '/exception/403' &&
      routeArrList.includes(pathname) === false
    ) {
      // 页面不存在
      if (configRouteArrList.includes(pathname) === false) {
        router.push({
          pathname: '/exception/404',
        });
      } // 无权限访问页面

      if (configRouteArrList.includes(pathname) === true) {
        router.push({
          pathname: '/exception/403',
        });
      }
    }

    const menuList = JSON.stringify(menuData).replace(/subMenus/g, 'children');
    return JSON.parse(menuList) ? JSON.parse(menuList) : [];
  };

  // const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  //   menuList.map(item => {
  //     const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
  //     return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  //   });

  return (
  <>
      <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) { 
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/home',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuRouteDatas}
      // menuDataRender={menuDataRender}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}>
      {children}
    </ProLayout>
    <SettingDrawer
        settings={settings}
        onSettingChange={config =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
  </>
  );
};

export default connect(({ global, settings, login }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  menuData: login.menuData,
}))(BasicLayout);
