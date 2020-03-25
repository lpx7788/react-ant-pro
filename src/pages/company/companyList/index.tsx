import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Table, Button, Input, message,Tooltip } from 'antd';
import AntdRadioGroup from '@/components/AntdRadioGroup';
import PaginationItem from '@/components/Pagination';
import HandleButton from '@/components/HandleButton';
import { router } from 'umi';
import apiM from '@/services/apiManager'
import env from '@/../config/env'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
const { Search } = Input;

interface CompanyProps extends ConnectProps {
  loading: boolean;
  companyJoinData: any;
}

interface CompanyState {
  parameter: any
  tableListTitle: any
  totalPage: number
  tableListLoading: boolean
  dataList: Array<Object>
  groupArr: Array<Object>
  exportDataUrl: string
}

class CompanyJoin extends React.Component<CompanyProps, CompanyState> {
  state: CompanyState = {
    totalPage: 0, //总页数
    parameter: {
      companyStatus: '',
      // pageNum: 1,
      // pageSize: 20,
      queryKey: '',
    },
    // table数据
    dataList: [],
    //table标题
    tableListTitle: [
      { title: '编号', dataIndex: 'id', align: 'center' },
      { title: '公司', dataIndex: 'companyName', align: 'center' },
      { title: '公司简称', dataIndex: 'companyShortName', align: 'center' },
      { title: '超级管理员', dataIndex: 'superUserName', align: 'center' },
      { title: '手机号码', dataIndex: 'superUserPhone', align: 'center' },
      { title: '审核状态', dataIndex: 'companyStatusName', align: 'center' },
      { title: '入驻时间', dataIndex: 'createDate', align: 'center' },
      { title: '审核人/添加人', dataIndex: 'verifyUserName', align: 'center' },
      {
        title: '操作',
        width: 100,
        render: (row: any) => (
          <HandleButton icon="eye" title="查看" handleClick={this.goToCompanyDetail.bind(this, row)}/>
        ),
        align: 'center',
      },
    ],
    tableListLoading: false,
    groupArr: [
      { value: '', textName: '全部', key: 1 },
      { value: '1', textName: '待审核', key: 2 },
      { value: '2', textName: '已通过', key: 3 },
      { value: '3', textName: '已拒绝', key: 4 },
    ],
    exportDataUrl: '',
  };

  UNSAFE_componentWillMount() {
    this.getPageDatas()
    this.setState({
      exportDataUrl: env[process.env.API_ENV ? process.env.API_ENV : 'dev'].apiHostName + apiM.companys_exportData + '?userCompanyStatus=0'
    })
  }

  tabsChange(key: any) { //切换tabs
    this.child.reset()
    let parameter = this.state.parameter
    parameter.companyStatus = key
    this.setState({
      parameter: parameter,
      exportDataUrl: env[process.env.API_ENV ? process.env.API_ENV : 'dev'].apiHostName + apiM.companys_exportData + '?userCompanyStatus=' + key
    })
    this.getPageDatas()
  }
  getPageDatas(pageNum?: number, pageSize?: number) {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'company/companyJoinQuery',
        payload: {
          companyStatus: this.state.parameter.companyStatus,
          pageNum: pageNum ? pageNum : 1,
          pageSize: pageSize ? pageSize : 20,
          queryKey: this.state.parameter.queryKey,
        }
      })
    }
  }
  goToCompanyDetail(row: any) { //跳转企业详情
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeCompanyDetailTab',
        payload: {
          tab: '1'
        }
      })
    }
    router.push({ pathname: '/company/companyList/companyDetail', state: { companyCode: row.companyCode } })
  }
  addCompany() { //添加企业
    router.push({ pathname: '/company/companyList/companyAdd' })
  }
  //setState参数值
  handleParameter(value: any, dataName: any) {
    let parameter = this.state.parameter;
    if (typeof (value))
      parameter[dataName] = value;
    this.setState({
      parameter: parameter,
    });
    this.getPageDatas();
  }
  exportData() { //导出数据
    message.loading('数据导出中')
  }
  //搜索
  handleSearch(val: string) {
    this.handleParameter(val, 'queryKey');
  }

  child: any = {}
  onRef = (ref: any) => { //父组件给子组件传入一个onRef方法过去。接受子组件反馈的参数ref,把接受到的值赋予给，this.child这时就可以调用子组件的一个方法叫reset()方法。
    this.child = ref
  }

  render() {
    return (
      <PageHeaderWrapper>
      <div className={styles.companyList}>
        <header>
          <div className="fl">
            <AntdRadioGroup value={this.state.parameter.companyStatus} groupArr={this.state.groupArr} change={this.tabsChange.bind(this)} />
          </div>
          <div className={`fl ${styles.search}`}>
            <Search placeholder="请输入企业名称/简称" onSearch={(value: any) => this.handleSearch(value)} enterButton />
          </div>
          <div className="fl">
            <Button type="primary" icon="plus" onClick={this.addCompany.bind(this)}>添加企业</Button>
          </div>
          <div className="fl">
            <Button type="primary" icon="cloud-download" href={this.state.exportDataUrl} onClick={this.exportData.bind(this)}>导出</Button>
          </div>
        </header>
        <Table
          className="mT20"
          loading={this.props.loading}
          size="middle"
          rowKey={row => row.id}
          bordered
          columns={this.state.tableListTitle}
          dataSource={this.props.companyJoinData.list}
          pagination={false}
        />
        <PaginationItem ref={this.onRef} total={this.props.companyJoinData.total} changePage={this.getPageDatas.bind(this)} />

      </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ company, loading }: ConnectState) => ({
  companyJoinData: company.companyJoinData,
  loading: loading.models.company,
}))(CompanyJoin);
