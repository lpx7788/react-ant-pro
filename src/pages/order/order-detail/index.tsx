import React from 'react';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Tag, Table,Row,Col } from 'antd';
import styles from './style.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

// 主体部分
interface OrderDetailProps extends ConnectProps {
  orderDetail: any,
  location: any
}

interface OrderDetailState {
  priceMsgTit: Array<any>
  productMsgTit: Array<any>
  orderAmountTit: Array<any>
  otherTit: Array<any>
}

class OrderDetail extends React.Component<OrderDetailProps, OrderDetailState> {
  state: OrderDetailState = {
    priceMsgTit: [
      { title: '合约', dataIndex: 'contractName', align: 'center', key: "1" },
      { title: '基价', dataIndex: 'taxesPrice', align: 'center', key: "2" },
      { title: '成交(吨)', dataIndex: 'dealQuantity', align: 'center', key: "3" },
      { title: '下单(吨)', dataIndex: 'quantity', align: 'center', key: "4" },
      { title: '点价人', dataIndex: 'buyUserName', align: 'center', key: "5" },
    ],
    productMsgTit: [
      { title: '商品名称', align: 'center', key: "1", render: (row: any) => row.categoryName + ' | ' + row.brand + ' | ' + row.spec },
      { title: '品牌', dataIndex: 'brand', align: 'center', key: "2" },
      { title: '规格', dataIndex: 'spec', align: 'center', key: "3" },
      { title: '其他', dataIndex: 'other', align: 'center', key: "4" },
      { title: '仓库简称', dataIndex: 'wareHouse', align: 'center', key: "5" },
      { title: '升贴水', dataIndex: 'floatingPrice', align: 'center', key: "6" },
    ],
    orderAmountTit: [
      { title: '作价方式', align: 'center', key: "1", render: (row: any) => row.priceTypeName + '(' + row.contractName + '+' + row.floatingPrice + ')' },
      { title: '含税单价 ', align: 'center', key: "2", render: (row: any) => row.taxesPrice + '元/吨' },
      { title: '成交数', dataIndex: 'quantity', align: 'center', key: "3" },
      { title: '订单总金额(元)', dataIndex: 'totalPrice', align: 'center', key: "4" },
    ],
    otherTit: [
      { title: '交货方式', align: 'center', key: "1", render: (row: any) => row.categoryName + ' | ' + row.brand + ' | ' + row.spec },
      { title: '开票日期', dataIndex: 'invoicedateType', align: 'center', key: "2" },
      { title: '结算方式', dataIndex: 'settleAccountsType', align: 'center', key: "3" },
    ],
  }
  
  componentWillMount() {
    this.getDetail()
  }

  getDetail() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'order/fetchOrderDetail',
        payload: { orderCode: this.props.location.state.orderCode }
      })
    }
  }

  // 主题部分
  render() {
    console.log(this.props.orderDetail);
    return (
      <PageHeaderWrapper>
        <div className={styles.orderPage}>
          <div className='head'>
            <h3><span>订单状态：</span> <Tag color="#2db7f5">{this.props.orderDetail.orderStatusName}</Tag></h3>
            <h3><span>订单编号：</span> {this.props.orderDetail.customerOrderCode}</h3>
          </div>
          <div className='table'>
            <div className="price">
              <h3 className="mT20">点价信息：</h3>
              <Table<any>
                size="middle"
                pagination={false}
                rowKey={'1'}
                bordered
                columns={this.state.priceMsgTit}
                dataSource={this.props.orderDetail ? [this.props.orderDetail] : []}
              />
            </div>
            <div className="product">
              <h3 className="mT20">商品信息：</h3>
              <Table<any>
                size="middle"
                pagination={false}
                rowKey={'2'}
                bordered
                columns={this.state.productMsgTit}
                dataSource={this.props.orderDetail ? [this.props.orderDetail] : []}
              />
            </div>
            <div className="amount">
              <h3 className="mT20">商品信息：</h3>
              <Table<any>
                size="middle"
                pagination={false}
                rowKey={'3'}
                bordered
                columns={this.state.orderAmountTit}
                dataSource={this.props.orderDetail ? [this.props.orderDetail] : []}
              />
            </div>
          </div>
         <div className='transactionDtail'>
          <h3 className="mT20">买卖双方：</h3>
            <Row>
              <Col span={12} >
                <div className={styles.buyer}> 
                  <div className={`border ${styles.bL}`}>
                    <h3>买家信息</h3>
                    <p>公司名称：{this.props.orderDetail.buyCompanyName}</p>
                    <p>求购用户：{this.props.orderDetail.buyUserName}</p>
                    <p>联系电话：{this.props.orderDetail.buyUserPhone}</p>
                  </div>
                </div>
              </Col>
              <Col span={12} >
                <div className={styles.seller}>
                <div className={`border ${styles.bL}`}>
                    <h3>卖家信息</h3>
                    <p>公司名称：{this.props.orderDetail.sellCompanyName}</p>
                    <p>点价用户：{this.props.orderDetail.sellUserName}</p>
                    <p>联系电话：{this.props.orderDetail.sellUserPhone}</p>
                 </div>
                </div>  
              </Col>
            </Row>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ order, loading }: ConnectState) => ({
  orderDetail: order.orderDetail,
  loading: loading.models.order,
}))(OrderDetail);