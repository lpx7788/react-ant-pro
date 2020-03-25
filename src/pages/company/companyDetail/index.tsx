import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Tabs } from 'antd';
import CompanyDetail from './components/Detail'; //基本信息模块
import Customers from './components/Customers'; //客户模块
import Suppliers from './components/Suppliers'; //供应商模块
import Staffs from './components/Staffs'; //员工模块
import Integral from './components/Integral'; //积分模块
import Hedging from './components/Hedging'; //套保模块
import { PageHeaderWrapper } from '@ant-design/pro-layout';
const { TabPane } = Tabs;

interface Props extends ConnectProps {
  location: any;
  companyDetailTab: string;
}

interface State {
  companyCode: string;
  companyData: object;
  customerData: Array<any>;
  supplierData: Array<any>;
  staffsData: Array<any>;
  integralData: Array<any>;
}

class UserDetail extends React.Component<Props> {
  state: State = {
    companyCode: '',
    companyData: {},
    customerData: [],
    supplierData: [],
    staffsData: [],
    integralData: [],
  };

  UNSAFE_componentWillMount() {
    this.tabsChange(this.props.companyDetailTab);
  }

  queryCompanyDetail() {
    //获取用户信息
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'company/companyDetailQuery',
        payload: {
          companyCode: this.props.location.state.companyCode,
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            this.setState({
              companyData: res.returnObject,
            });
          }
        },
      });
    }
  }
  queryCustomers(pageNum?: number, pageSize?: number) {
    //获取客户
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'company/queryCustomers',
        payload: {
          companyCode: this.props.location.state.companyCode,
          pageNum: pageNum ? pageNum : 1,
          pageSize: pageSize ? pageSize : 20,
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            this.setState({
              customerData: res.returnObject,
            });
          }
        },
      });
    }
  }
  querySuppliers(pageNum?: number, pageSize?: number) {
    //获取用户信息
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'company/querySuppliers',
        payload: {
          companyCode: this.props.location.state.companyCode,
          pageNum: pageNum ? pageNum : 1,
          pageSize: pageSize ? pageSize : 20,
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            this.setState({
              supplierData: res.returnObject,
            });
          }
        },
      });
    }
  }
  queryStaffs(pageNum?: number, pageSize?: number) {
    //获取员工
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'company/queryCompanyStaffs',
        payload: {
          companyCode: this.props.location.state.companyCode,
          // pageNum: pageNum ? pageNum : 1,
          // pageSize: pageSize ? pageSize : 20,
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            this.setState({
              staffsData: res.returnObject,
            });
          }
        },
      });
    }
  }
  queryIntegrals(pageNum?: number, pageSize?: number) {
    //获取积分列表
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'integral/queryIntegralList',
        payload: {
          companyCode: this.props.location.state.companyCode,
          // pageNum: pageNum ? pageNum : 1,
          // pageSize: pageSize ? pageSize : 20,
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            this.setState({
              integralData: res.returnObject,
            });
          }
        },
      });
    }
  }
  tabsChange(key: any) {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeCompanyDetailTab',
        payload: {
          tab: key,
        },
      });
    }
    let self = this;
    switch (key) {
      case '1':
        self.queryCompanyDetail();
        break;
      case '2':
        self.queryCustomers();
        break;
      case '3':
        self.querySuppliers();
        break;
      case '4':
        self.queryStaffs();
        break;
      case '6':
        self.queryIntegrals();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <PageHeaderWrapper>
      <div className={styles.companyDetail}>
        <Tabs
          activeKey={this.props.companyDetailTab}
          onChange={this.tabsChange.bind(this)}
          type="card"
        >
          <TabPane tab="基本信息" key="1">
            <CompanyDetail companyData={this.state.companyData} />
          </TabPane>
          <TabPane tab="客户" key="2">
            <Customers
              tableData={this.state.customerData}
              onChange={this.queryCustomers.bind(this)}
            />
          </TabPane>
          <TabPane tab="供应商" key="3">
            <Suppliers
              tableData={this.state.supplierData}
              onChange={this.querySuppliers.bind(this)}
            />
          </TabPane>
          <TabPane tab="员工" key="4">
            <Staffs tableData={this.state.staffsData} />
          </TabPane>
          <TabPane tab="套保账户" key="5">
            <Hedging />
          </TabPane>
          <TabPane tab="积分设置" key="6">
            <Integral
              tableData={this.state.integralData}
              companyCode={this.props.location.state.companyCode}
              queryIntegrals={this.queryIntegrals.bind(this)}
            />
          </TabPane>
        </Tabs>
      </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global }: ConnectState) => ({
  companyDetailTab: global.companyDetailTab,
}))(UserDetail);
