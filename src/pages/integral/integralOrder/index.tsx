import React from 'react';
import styles from './index.less';
import { Table, Button, Tooltip, Modal, Input, message } from 'antd';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import moment from 'moment';
import 'moment/locale/zh-cn';
import AntdRadioGroup from '@/components/AntdRadioGroup';
import apiM from '@/services/apiManager';
import env from '@/../config/env';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HandleButton from '@/components/HandleButton'

const { confirm } = Modal;
const { TextArea } = Input;
const { Search } = Input;

interface Props extends ConnectProps {
  loading: boolean;
  integralOrders: any;
}

interface States {
  tableListTitle: Array<any>;
  refuseRemark: string;
  visible: boolean;
  integralOrderRow: object;
  searchKey: any;
  groupArr: Array<any>;
  orderStatus: string;
  logisticsCompany: string;
  logisticsCode: string;
  logisticsRemark: string;
  exportDataUrl: string;
}

class IntegralOrders extends React.Component<Props> {
  state: States = {
    //table标题
    tableListTitle: [
      {
        title: '提交时间',
        // dataIndex: 'createDate',
        width: '120px',
        key: 'createDate',
        render: (row: any) => moment(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
        fixed: 'left',
        align: 'center',
      },
      {
        title: '积分订单号',
        key: 'integralOrderCode',
        dataIndex: 'integralOrderCode',
        width: '100px',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '提交用户手机号',
        key: 'submitterPhone',
        dataIndex: 'submitterPhone',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '支出积分数',
        key: 'spendingIntegral',
        dataIndex: 'spendingIntegral',
        align: 'center',
      },
      { title: '兑换商品编号', key: 'commodityCode', dataIndex: 'commodityCode', align: 'center' },
      {
        title: '兑换商品',
        key: 'commodityName',
        // ellipsis: true,
        render: (row: any) => {
          return (
            <Tooltip placement="topLeft" title={row.commodityName}>
              <p className="ellipsis">{row.commodityName}</p>
            </Tooltip>
          );
        },
        align: 'center',
      },
      { title: '兑换物品数量', key: 'cashingNum', dataIndex: 'cashingNum', align: 'center' },
      {
        title: '订单状态',
        key: 'orderStatus',
        render: (row: any) => {
          return (
            <div>
              {row.orderStatus === 1
                ? '待确认'
                : row.orderStatus === 2
                ? '待发货'
                : row.orderStatus === 3
                ? '已发货'
                : row.orderStatus === 4
                ? '已拒绝'
                : ''}
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '收货地址',
        key: 'address',
        // ellipsis: true,
        render: (row: any) => {
          return (
            <div>
              <Tooltip
                placement="topLeft"
                title={`${row.province} ${row.city} ${row.area} ${row.address}`}
              >
                <p className="ellipsis">{`${row.province}${row.city}${row.area}${row.address}`}</p>
              </Tooltip>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '收货人及手机号',
        key: 'consigneeName',
        render: (row: any) => {
          return (
            <div>
              <div>{row.consigneeName}</div>
              <div>{row.consigneePhone}</div>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '其他信息',
        key: 'remark',
        ellipsis: true,
        render: (row: any) => {
          return (
            <div>
              <div className={row.orderStatus === 3 ? '' : 'hidden'}>
                <p>{row.logisticsCompany}</p>
                <p>{row.logisticsCode}</p>
              </div>
              <p className={row.orderStatus === 3 ? 'hidden' : ''}>{row.remark}</p>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '最后操作时间',
        key: 'lastupdateDate',
        // dataIndex: 'lastupdateDate',
        render: (row: any) => moment(row.lastupdateDate).format('YYYY-MM-DD HH:mm:ss'),
        align: 'center',
      },
      { title: '操作人', key: 'lastupdateName', dataIndex: 'lastupdateName', align: 'center' },
      {
        title: '操作',
        key: 'handle',
        width: 100,
        fixed: 'right',
        render: (row: any) => (
          <div className="handle_btn">
            <div className={row.orderStatus === 1 ? '' : 'hidden'}>
              <HandleButton icon="check" title="确认" handleClick={this.confirmOrder.bind(this, row, '1')} />
              <HandleButton icon="close" title="拒绝" handleClick={this.confirmOrder.bind(this, row, '2')} />
            </div>
            <div className={row.orderStatus === 2 ? '' : 'hidden'}>
              <HandleButton icon="car" title="发货" handleClick={this.deliverGoods.bind(this, row)} />
            </div>
          </div>
        ),
        align: 'center',
      },
    ],
    refuseRemark: '',
    visible: false,
    integralOrderRow: {},
    searchKey: '',
    groupArr: [
      { value: '', textName: '全部', key: 1 },
      { value: '1', textName: '待确认', key: 2 },
      { value: '2', textName: '待发货', key: 3 },
      { value: '3', textName: '已发货', key: 4 },
      { value: '4', textName: '已拒绝', key: 5 },
    ],
    orderStatus: '',
    logisticsCompany: '',
    logisticsCode: '',
    logisticsRemark: '',
    exportDataUrl: '',
  };

  componentWillMount() {
    this.queryIntegralOrderList();
    this.setState({
      exportDataUrl:
        env[process.env.API_ENV ? process.env.API_ENV : 'dev'].apiHostName +
        apiM.integralorder_export,
    });
  }

  confirmOrder(row: any, type: string) {
    //审核订单
    const { dispatch } = this.props;
    let self = this;
    if (type === '1') {
      confirm({
        title: '温馨提示',
        content: '是否确认该兑换订单的积分来源无误？确认后可进行发货操作。',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return new Promise((resolve, reject) => {
            if (dispatch) {
              dispatch({
                type: 'integral/updateIntegralOrder',
                payload: {
                  id: row.id,
                  orderStatus: '1',
                },
                callback: (res: any) => {
                  if (res.errorCode === '0000') {
                    resolve();
                    self.queryIntegralOrderList();
                  } else {
                    reject();
                  }
                },
              });
            }
          });
        },
      });
    } else {
      this.setState({
        visible: true,
        integralOrderRow: row,
      });
    }
  }
  refuseRemarkChange(event: any) {
    this.setState({
      refuseRemark: event.target.value,
    });
  }
  handleIntegralOrder() {
    if (this.state.integralOrderRow.orderStatus === 1) {
      this.refuseIntegralOrder();
    } else {
      this.doDeliverGoods();
    }
  }
  refuseIntegralOrder() {
    if (this.state.refuseRemark === '') {
      message.warning('请填写拒绝原因');
      return;
    }
    let self = this;
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'integral/refuseIntegralOrder',
        payload: {
          id: this.state.integralOrderRow.id,
          remark: this.state.refuseRemark,
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            this.setState({
              visible: false,
            });
            self.queryIntegralOrderList();
          }
        },
      });
    }
  }
  doDeliverGoods() {
    if (this.state.logisticsCompany === '' || this.state.logisticsCode === '') {
      message.warning('请填写完整物流信息');
      return;
    }
    let self = this;
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'integral/updateIntegralOrder',
        payload: {
          id: this.state.integralOrderRow.id,
          orderStatus: '2',
          logisticsCode: this.state.logisticsCode,
          logisticsCompany: this.state.logisticsCompany,
          remark: this.state.logisticsRemark,
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            this.setState({
              visible: false,
            });
            self.queryIntegralOrderList();
          }
        },
      });
    }
  }
  deliverGoods(row: any) {
    this.setState({
      visible: true,
      integralOrderRow: row,
    });
  }
  queryIntegralOrderList(pageNum?: number, pageSize?: number) {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'integral/queryIntegralOrderList',
        payload: {
          condition: this.state.searchKey,
          orderStatus: this.state.orderStatus,
          pageNum: pageNum ? pageNum : 1,
          pageSize: pageSize ? pageSize : 20,
        },
      });
    }
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  search(val: any) {
    this.queryIntegralOrderList();
  }
  searchChange(e: any) {
    this.setState({
      searchKey: e.target.value,
    });
  }
  tabsChange(idx: any) {
    let self = this;
    this.setState(
      {
        orderStatus: idx,
      },
      function() {
        self.queryIntegralOrderList();
      },
    );
  }
  getLogisticsCompany(e: any) {
    this.setState({
      logisticsCompany: e.target.value,
    });
  }
  getLogisticsCode(e: any) {
    this.setState({
      logisticsCode: e.target.value,
    });
  }
  getLogisticsRemark(e: any) {
    this.setState({
      logisticsRemark: e.target.value,
    });
  }
  exportIntegralOrder() {
    message.loading('数据导出中');
  }

  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.integralOrders}>
          <div className="flex flex-between">
            <Search
              placeholder="输入积分订单号、手机号、商品编号搜索"
              onSearch={this.search.bind(this)}
              onChange={this.searchChange.bind(this)}
              style={{ width: 400 }}
            />
            <Button
              type="primary"
              href={this.state.exportDataUrl}
              onClick={this.exportIntegralOrder.bind(this)}
            >
              导出
            </Button>
          </div>
          <p></p>
          <AntdRadioGroup
            value={this.state.orderStatus}
            groupArr={this.state.groupArr}
            change={this.tabsChange.bind(this)}
          />
          <p></p>
          <Table
            loading={this.props.loading}
            size="middle"
            rowKey={row => row.id}
            bordered
            columns={this.state.tableListTitle}
            dataSource={
              this.props.integralOrders.returnObject && this.props.integralOrders.returnObject.list
            }
            pagination={false}
            scroll={{ x: 1600 }}
          />
          <Modal
            title="温馨提示"
            visible={this.state.visible}
            onOk={this.handleIntegralOrder.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            confirmLoading={this.props.loading}
          >
            <div className={this.state.integralOrderRow.orderStatus === 2 ? '' : 'hidden'}>
              <div>
                <label style={{ display: 'inline-block', width: '80px' }} htmlFor="logisticsCompany">
                  物流公司：
                </label>
                <Input
                  id="logisticsCompany"
                  style={{ width: '300px' }}
                  onChange={this.getLogisticsCompany.bind(this)}
                ></Input>
              </div>
              <p></p>
              <div>
                <label style={{ display: 'inline-block', width: '80px' }} htmlFor="logisticsCode">
                  物流单号：
                </label>
                <Input
                  id="logisticsCompany"
                  style={{ width: '300px' }}
                  onChange={this.getLogisticsCode.bind(this)}
                ></Input>
              </div>
              <p></p>
              <div>
                <label style={{ display: 'inline-block', width: '80px' }} htmlFor="remark">
                  备注：
                </label>
                <Input
                  id="logisticsCompany"
                  style={{ width: '300px' }}
                  onChange={this.getLogisticsRemark.bind(this)}
                ></Input>
              </div>
            </div>
            <p></p>
            <div className={this.state.integralOrderRow.orderStatus === 2 ? 'hidden' : ''}>
              <p>是否拒绝该兑换订单？</p>
              <TextArea rows={2} onChange={this.refuseRemarkChange.bind(this)} />
            </div>
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ loading, integral }: ConnectState) => ({
  loading: loading.models.integral,
  integralOrders: integral.integralOrders,
}))(IntegralOrders);
