import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/img/LOGO-32.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        ...props,
      })}
    >
      <div className={styles.container}>
        {/* <div className={styles.lang}>
         <SelectLang />
        </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>数据管理后台</span>
              </Link>
            </div>
            {/* <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div> */}
          </div>
          {/* {children} */}
        </div>
        {/* <DefaultFooter /> */}
        <div
          className="footer center"
          style={{
            marginTop: 48,
            marginBottom: 24,
          }}
        >
          Copyright©{new Date().getFullYear()}. 广州众咖信息科技服务有限公司 All Rights Reserved
        </div>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
