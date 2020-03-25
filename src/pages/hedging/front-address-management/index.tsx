import React from 'react';

import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import styles from './style.less';
import { Select, Button, Input, Modal, Radio, Form, Table, message, } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HandleButton from '@/components/HandleButton'
const { confirm } = Modal;
const { Option } = Select;

interface HedgingAdressFormProps extends FormComponentProps {
}
interface HedgingAdressProps extends ConnectProps {
  preAddressList: any,
  loading: boolean | undefined,
  form: any,
  deleteCallBackCode: string,
  saveNewPreAddressCode: string,
  futuresCompanyList: Array<any>
}

interface HedgingAdressState {
  parameter: {
    pageNum: Number
    pageSize: Number
  }
  newPreAdressVisible: boolean | undefined
  tableListtitle: Array<object>
  selectObject:any
}

class HedgingAdress extends React.Component<HedgingAdressProps, HedgingAdressState> {
  state: HedgingAdressState = {
    tableListtitle: [
      { title: '期货公司', width: 150, dataIndex: 'brokerName', align: 'center' },
      { title: '席位', width: 300, dataIndex: 'seat', align: 'center' },
      { title: '前置地址', dataIndex: 'preAddress', align: 'center' },
      { title: '创建时间', width: 200, dataIndex: 'createDate', align: 'center', },
      { title: '最后修改时间', width: 200, dataIndex: 'lastupdateDate', align: 'center' },
      { title: '修改人', width: 300, dataIndex: 'lastupdateName', align: 'center', },
      {
        title: '操作',
        width: 200,
        render: (row: any) => (
        <div className="handle_btn">
          <span>
            <HandleButton icon="edit"  title="编辑" handleClick={this.editPreAddress.bind(this, row)} />
          </span>
          <span className="mL10">
            <HandleButton  icon="delete" title="删除" handleClick={this.handleDelete.bind(this, row)} />
          </span>
        </div>
        ),
        align: 'center',
      },
    ],
    parameter: {
      pageNum: 1,
      pageSize: 20,
    },
    newPreAdressVisible: false,
    selectObject:{
      preAddress:'',
      seat:'',
      brokerName:'',
    }
  
  };

  UNSAFE_componentWillMount() {
   this.getFutureCompanyList()
   this.getPageDatas()
  }

  getFutureCompanyList(){
    let { dispatch } = this.props
    if(dispatch){
      //期货公司列表
      dispatch({
        type: 'hedging/fetchFuturesCompanyList',
        payload: {}
      })
    }
  }

  //编辑
  editPreAddress(row: any) {
    this.props.form.setFieldsValue({
      preAddress:row.preAddress,
      seat:row.seat,
      brokerName:row.brokerName,
    })
    this.setState({
      newPreAdressVisible: true,
    })
  }
  
  // 删除
  handleDelete(row: any) {
    let self = this;
    confirm({
      title: '温馨提示',
      content: `是否确认将${row.brokerName}（期货公司）的${row.seat}（席位）的前置地址删除？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let { dispatch } = self.props
        if (dispatch) {
          dispatch({
            type: 'hedging/fetchDeleteFrontAddress',
            payload: { id: row.id },
            callback: (res: any) => {
              if(res.errorCode==='0000')
                message.success('操作成功');
                self.getPageDatas()
                self.setState({
                  newPreAdressVisible: false,
                })
              }
          })
        }
      },
      onCancel() { },
    });
  }

  //新增前置地址
  newFrontAddress() {
    this.setState({
      newPreAdressVisible: true,
    });
  }
  
  //获取页面数据
  getPageDatas() {
    const { dispatch } = this.props;
    if (dispatch) {
      // 页面列表
      dispatch({
        type: 'hedging/fetchPreAddressList',
        payload: this.state.parameter
      })
    }
  }

  // 取消弹窗
  handleSaveModalCancel = () => {
    this.setState({
      newPreAdressVisible: false,
    });
  };
  handleClose(){
    this.props.form.setFieldsValue({
      preAddress:'',
      seat:'',
      brokerName:'请输入期货公司',
    })
    
  }
  // 提交数据
  handleSubmit = (e: any) => {
    e.preventDefault();
    let self = this;
    let brokerId = ''
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        const { dispatch } = this.props;
        this.props.futuresCompanyList.forEach(function (item, index) {
          if (item.name === values.brokerName) {
            brokerId = item.id
          }
        })
        let param = {
          brokerId: brokerId,
          brokerName: values.brokerName,
          preAddress: values.preAddress,
          seat: values.seat,
        };
        if (dispatch) {
          dispatch({
            type: 'hedging/fetchNewPreAddress',
            payload: param,
            callback: (res: any) => {
              if(res.errorCode==='0000')
                message.success('操作成功');
                self.getPageDatas()
                self.setState({
                  newPreAdressVisible: false,
                  selectObject:{}
                })
              }
          })
        }
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 4 },
        md: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 20 },
        md: { span: 20 },
      },
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.HedgingAdressPageContent}>
        <Modal
          className={styles.passwordModalForm}
          title="修改密码"
          afterClose={this.handleClose.bind(this)}
          visible={this.state.newPreAdressVisible}
          onCancel={this.handleSaveModalCancel.bind(this)}
          footer={null}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="期货公司：">
              {getFieldDecorator('brokerName', {
                rules: [{ required: true, message: '请输入期货公司'}],
              })(
                <Select
                  showSearch
                  style={{ width: 320 }}
                  placeholder="请选择或者输入期货公司"
                  optionFilterProp="children">
                  {this.props.futuresCompanyList ?
                      this.props.futuresCompanyList.map(item => (
                        <Option key={item.id} value={item.name}>{item.name}</Option>
                      )) : ''}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="席位：">
              {getFieldDecorator('seat', {
                rules: [{ required: true, message: '请输入席位'}],
              })(
                <Input type="seat" placeholder={'请输入席位'} />,
              )}
            </Form.Item>
            <Form.Item label="前置地址：">
              {getFieldDecorator('preAddress', {
                rules: [{ required: true, message: '请输入前置地址' }],
              })(
                <Input type="preAddress" placeholder={'请输入前置地址'} />,
              )}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="center">
                <Button onClick={this.handleSaveModalCancel}>取消</Button>
                <Button htmlType="submit" className="mL20" type="primary">确定</Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <header className="pageHeader">
          <Button type="primary" onClick={this.newFrontAddress.bind(this)}>新增前置地址</Button>
        </header>
        <div className="pageContent mT20">
          <div className={` ${styles.contentItem}`}>
            <Table<any>
              loading={this.props.loading}
              size="middle"
              pagination={false}
              rowKey={record => record.index}
              bordered
              columns={this.state.tableListtitle}
              dataSource={this.props.preAddressList && this.props.preAddressList.list ? this.props.preAddressList.list : []}
            />
          </div>
        </div>
      </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<HedgingAdressFormProps>()(
  connect(({ hedging, loading }: ConnectState) => ({
    preAddressList: hedging.preAddressList,
    loading: loading.models.hedging,
    futuresCompanyList: hedging.futuresCompanyList,
  }))(HedgingAdress),
);