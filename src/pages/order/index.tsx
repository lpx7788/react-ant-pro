import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Select, Button, message, Tooltip, DatePicker, Table, Input, Row, Col } from 'antd';
import PaginationItem from '@/components/Pagination'
import AntdRadioGroup from '@/components/AntdRadioGroup';
import HandleButton from '@/components/HandleButton';
import env from '@/../config/env'
import apiM from '@/services/apiManager'
import { router } from 'umi';
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface OrderProps extends ConnectProps {
  loading: boolean;
  orderList: any;
  companyList: {
    buyer: Array<any>,
    seller: Array<any>
  }
}

interface OrderState {
  parameter: any
  groupArr: Array<object>
  tableListtitle: Array<object>
  priceTypeArr: Array<object>
  deliveryType: Array<object>
  totalPage: Number,
  exportDataUrl: string
}

class Order extends React.Component<OrderProps, OrderState> {
  state: OrderState = {
    groupArr: [
      { value: 'today', textName: '今天', key: 1 },
      { value: 'yesterday', textName: '昨天', key: 2 },
      { value: 'lastWeek', textName: '最近一周', key: 3 },
      { value: 'lastMonth', textName: '最近30天', key: 4 },
      { value: 'lastThreeMonth', textName: '最近90天', key: 5 },
      { value: 'all', textName: '累计', key: 6 },
    ],
    totalPage: 0, //总页数
    tableListtitle: [
      { title: '订单编号', dataIndex: 'customerOrderCode', align: 'center' },
      { title: '买家', dataIndex: 'buyCompanyName', align: 'center' },
      { title: '卖家', dataIndex: 'sellCompanyName', align: 'center' },
      { title: '点价人', width: 100, dataIndex: 'createUserName', align: 'center' },
      { title: '商品名称', dataIndex: 'categoryName', align: 'center' },
      { title: '合约', dataIndex: 'contractName', align: 'center' },
      { title: '基价', dataIndex: 'basePrice', align: 'center' },
      { title: '成交数量', dataIndex: 'dealQuantity', align: 'center' },
      { title: '下单数量', dataIndex: 'quantity', align: 'center' },
      { title: '订单状态', align: 'center', render: (record: any) => record.orderStatus === 2 || record.orderStatus === 5 ? '111' : record.orderStatusName },
      { title: '下单时间', dataIndex: 'createDate', align: 'center' },
      {
        title: '操作', render: (row: any) =>
        <HandleButton icon="eye" title="查看" handleClick={this.goToCompanyDetail.bind(this, row)}/>
        , align: 'center' 
      },
    ],
    priceTypeArr: [
      { value: '1', textName: '点价', key: 1 },
      { value: '3', textName: '延期点价', key: 3 },
      { value: '2', textName: '确定价', key: 2 },
    ],
    deliveryType: [
      { value: '1', textName: '现货商城', key: 1 },
      { value: '2', textName: '求购大厅', key: 2 },

    ],
    parameter: {
      buyUserCompanyCode: "",
      createDateEnd: null,
      createDateStart: null,
      dateKey: "today",
      dateNum: 0,
      deliveryType: "1",
      orderStatus: "",
      pageNum: 1,
      pageSize: 20,
      priceType: "1",
      queryKey: "",
      sellUserCompanyCode: ""
    },
    exportDataUrl: ''
  };

  UNSAFE_componentWillMount() {
    this.getPageDatas()
    this.getCompanyList()
  }

  componentDidMount() {
    let url = env[process.env.API_ENV ? process.env.API_ENV : 'dev'].apiHostName + apiM.orderList_exportData +
      "?queryKey=" +
      this.state.parameter.queryKey +
      "&deliveryType=" +
      this.state.parameter.deliveryType +
      "&priceType=" +
      this.state.parameter.priceType +
      "&orderStatus=" +
      this.state.parameter.orderStatus +
      "&dateKey=" +
      this.state.parameter.dateKey +
      "&createDateStart=" +
      this.state.parameter.createDateStart +
      "&createDateEnd=" +
      this.state.parameter.createDateEnd +
      "&dateNum=" +
      this.state.parameter.dateNum;
    this.setState({
      exportDataUrl: url
    })
  }
  //跳转详情页
  goToCompanyDetail(row: any) {
    router.push({ pathname: '/order/order-detail', state: { orderCode: row.orderCode } })
  }

  // 获取页面信息
  getPageDatas(pageNum?: number, pageSize?: number) {
    let parameter = this.state.parameter;
    parameter['pageNum'] = pageNum ? pageNum : 1;
    parameter['pageSize'] = pageSize ? pageSize : 1;
    this.setState({
      parameter: parameter
    })
    this.getDatas(parameter);

  }
  getDatas(payload: any) {
    let dateKey = payload.dateKey
    let dateNum;
    if (payload.dateKey === "lastWeek") {
      dateKey = "dateNum";
      dateNum = 7
    }
    else if (payload.dateKey === "lastMonth") {
      dateKey = "dateNum";
      dateNum = 30
    }
    else if (payload.dateKey === "lastThreeMonth") {
      dateKey = "dateNum";
      dateNum = 90
    }
    else if (payload.dateKey === "all") {
      dateKey = "";
      dateNum = 90
    }
    else {
      dateNum = 0;
    }
    let datas = {
      buyUserCompanyCode: payload.buyUserCompanyCode,
      createDateEnd: payload.createDateEnd,
      createDateStart: payload.createDateStart,
      dateKey: dateKey,
      dateNum: dateNum,
      deliveryType: payload.deliveryType,
      orderStatus: payload.orderStatus,
      pageNum: payload.pageNum,
      pageSize: payload.pageSize,
      priceType: payload.priceType,
      queryKey: payload.queryKey,
      sellUserCompanyCode: payload.sellUserCompanyCode,
 
    }
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'order/fetchOrderListDatas',
        payload: datas
      })
    }
  }

  getCompanyList() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'order/fetchCompanyList',
        payload: { type: 1 }
      })
    }
  }

  //修改日期
  handleTImeChange = (e: String) => {
    let parameter = this.state.parameter
    parameter['dateKey'] = e
    parameter['createDateStart'] = ''
    parameter['createDateEnd'] = ''
    this.setState({
      parameter: parameter
    });
    this.getPageDatas();
  };

  //获取时间戳
  handleRangePicker(date: object, dateStrings: [string, string]) {
    let parameter = this.state.parameter
    parameter['dateKey'] = ''
    parameter['createDateStart'] = new Date(dateStrings[0]).getTime()
    parameter['createDateEnd'] = new Date(dateStrings[1]).getTime()
    this.handleParameter(parameter)
  }


  // setState参数值
  handleParameter(parameter: any) {
    this.setState({
      parameter: parameter,
    });
    this.getPageDatas();
  }

  // 刷新
  handleRefresh() {
    let parameter = this.state.parameter
    parameter['dateKey'] = 'today'
    parameter['createDateStart'] = ''
    parameter['createDateEnd'] = ''
    this.handleParameter(parameter)
  }
  
  //搜索
  handleSearch(val: string) {
    this.handleparmas(val, 'dateKey')
  }

  //分页
  onPageChange = (e: Number) => {
    this.handleparmas(e, 'dateKey')
  };

  // handleOrderStatus = (value: any) => {
  //   this.handleparmas(value, 'orderStatus')
  // };

  handleparmas(value: any, dataName: string) {
    let parameter = this.state.parameter;
    parameter[dataName] = value;
    this.setState({
      parameter: parameter,
    });
    this.getPageDatas();
  }

  //修改订单来源
  handleType = (e: string, type: string) => {
    console.log(e,type)
    this.handleparmas(e, type)
  };

  //导出数据
  exportData() {
    message.loading('数据导出中')
  }

  child: any = {}
  onRef = (ref: any) => {
    this.child = ref
  }
  render() {
    return (
      <div className={styles.homePageContent}>
        <header className="pageHeader">
          <Row >
            <Col className="gutter-row " span={4}>
              <span>订单来源：</span>
              <Select
                showSearch
                style={{ width:'50%'  }}
                defaultValue="现货商城"
                placeholder="请选择订单来源"
                onChange={(e: any) => { this.handleType(e, "deliveryType") }}
                optionFilterProp="children">
                {
                  this.state.deliveryType ?
                    this.state.deliveryType.map((item: any) => (
                      <Option key={item.key} value={item.value}>{item.textName}</Option>
                    )) : ''
                }
              </Select>
            </Col>
            <Col span={4}>
            <span>作价方式：</span>
              <Select
                showSearch
                style={{ width:'50%' }}
                placeholder="请选择作价方式"
                defaultValue="点价"
                onChange={(e: any) => { this.handleType(e, "priceType") }}
                optionFilterProp="children">
                {
                  this.state.priceTypeArr ?
                    this.state.priceTypeArr.map((item: any) => (
                      <Option key={item.key} value={item.value}>{item.textName}</Option>
                    )) : ''
                }
              </Select>
            </Col>
            <Col span={4}>
              <span>订单状态：</span>
              <Select
                showSearch
                onChange={(e: any) => { this.handleType(e, "orderStatus") }}
                style={{ width:'50%'  }}
                placeholder="请选择订单状态"
                defaultValue="全部"
                optionFilterProp="children">
                <Option value="">全部</Option>
                <Option value="1">待确认</Option>
                <Option value="4" className={`${this.state.parameter.priceType === '1' ? 'inline-block' : 'hidden'}`}  >已挂单</Option>
                <Option value={this.state.parameter.priceType === '2' ? '2' : '5'}>待生成合同</Option>
                <Option value="6">已生成合同</Option>
                <Option value="3">已取消</Option>
              </Select>
            </Col>
            <Col span={4}>
              <span >买家公司：</span>
              <Select
                showSearch
                style={{ width:'50%'  }}
                placeholder="请选择买家公司"
                onChange={(e: any) => { this.handleType(e, "buyUserCompanyCode") }}
                optionFilterProp="children">
                {
                  this.props.companyList.buyer ?
                  this.props.companyList.buyer.map(item => (
                      <Option key={item.companyCode} value={item.companyCode}>  <Tooltip placement="right" title={item.companyName}>{item.companyName} </Tooltip></Option>
                  )) : ''
                }
              </Select>
            </Col>
            <Col span={4} >
              <span >卖家公司：</span>
              <Select
                showSearch
                style={{ width:'50%'  }}
                placeholder="请选择卖家公司"
                onChange={(e: any) => { this.handleType(e, "sellUserCompanyCode") }}
                optionFilterProp="children">
                {
                  this.props.companyList.seller ?
                    this.props.companyList.seller.map(item => (
                      <Option key={item.companyCode} value={item.companyCode}><Tooltip placement="right" title={item.companyName}>{item.companyName}</Tooltip></Option>
                  )) : ''
                }
              </Select>
            </Col>
          </Row>
          <Row >
            <Col className="gutter-row" >
              <span className={`mR20 mT20`}>  <AntdRadioGroup value={this.state.parameter.dateKey} groupArr={this.state.groupArr} change={this.handleTImeChange} /></span>
              <RangePicker className={`mR20 mT20`} onChange={this.handleRangePicker.bind(this)} placeholder={['开始日期', '结束日期']} />
              <Search className={`mR20 mT20 ${styles.search}`} placeholder="请输入用户/手机号码" onSearch={value => this.handleSearch(value)} enterButton />
              <Button icon="cloud-download" className={`mR20 mT20`} type="primary" href={this.state.exportDataUrl} onClick={this.exportData.bind(this)} >导出</Button>
              <Button icon="sync" className={`mR20 mT20`} type="primary" onClick={this.handleRefresh.bind(this)}>刷新</Button>
            </Col>
          </Row>
        </header>
        <div className={`mT20 ${styles.pageContent}`}>
          <Table<any>
            loading={this.props.loading}
            size="middle"
            pagination={false}
            rowKey={record => record.index}
            bordered
            columns={this.state.tableListtitle}
            dataSource={this.props.orderList.list ? this.props.orderList.list : []} />
          <section className={`m20 ${styles.paginationBtn}}`}>
            <PaginationItem ref={this.onRef} total={this.props.orderList.total} changePage={this.getPageDatas.bind(this)} />
          </section>
        </div>
      </div>
    );
  }
}

export default connect(({ order, loading }: ConnectState) => ({
  orderList: order.orderList,
  companyList: order.companyList,
  loading: loading.models.order,
}))(Order);