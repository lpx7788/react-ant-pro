import React from 'react';

import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import styles from './style.less';
import { Row, Col, Button, Input, Modal, Radio, Form, Table, message, } from 'antd';
import AntdRadioGroup from '@/components/AntdRadioGroup';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
const { Search } = Input;
const { confirm } = Modal;
import HandleButton from '@/components/HandleButton'

interface hedgingFormProps extends FormComponentProps {
}
interface HedgingProps extends ConnectProps {
  HedgingAccountList: any;
  loading:boolean | undefined;
  form:any,
  editPasswordCallBackCode:string
}

interface HedgingState {
  parameter: {
    queryKey: string
    approvalStatus: string
    connectionStatus: string
    operatingStatus: string
    connStatus: string
    pageNum: Number
    pageSize: Number
    
  }
  seat: string
  passwordParams: any
  passwordModalvisible: boolean | undefined
  operatingStatusArr: Array<object>
  approvalStatusArr: Array<object>
  connectionStatusTypeArr: Array<object>
  tableListtitle: Array<object>
}

class HedgingAccount extends React.Component<HedgingProps, HedgingState> {
  state:HedgingState = {

    approvalStatusArr: [
      { value: '', textName: '全部', key: 1 },
      { value: '0', textName: '未审核', key: 3 },
      { value: '1', textName: '已审核', key: 2 },
    ],

    connectionStatusTypeArr: [
      { value: '', textName: '全部', key: 1 },
      { value: '0', textName: '未连接', key: 2 },
      { value: '1', textName: '已连接', key: 3 },
    ],

    operatingStatusArr: [
      { value: '', textName: '全部', key: 1 },
      { value: '0', textName: '已停用', key: 2 },
      { value: '1', textName: '使用中', key: 3 },
    ],

    tableListtitle: [
      { title: '企业简称', dataIndex: 'companyShortName', align: 'center' },
      { title: '期货公司', dataIndex: 'brokerName', align: 'center' },
      { title: '期货账户', dataIndex: 'account', align: 'center' },

      {
        title: '账号审核状态', align: 'center',
        render: (record: any) => record.approvalStatus === 0 ? '未审核' : (record.approvalStatus === 1 ? '已审核' : '')
      },
      {
        title: '连接情况', align: 'center',
        render: (record: any) => record.connectionStatus === 0 ? '未连接' : (record.connectionStatus === 1 ? '已连接' : '')
      },
      {
        title: '账号使用状态', align: 'center',
        render: (record: any) => record.operatingStatus === 0 ? '已停用' : (record.operatingStatus === 1 ? '使用中' : '')
      },
      { title: '创建人', dataIndex: 'createUserName', align: 'center' },
      { title: '创建时间', dataIndex: 'createDate', align: 'center' },
      { title: '修改时间', dataIndex: 'lastUpdateDate', align: 'center' },
      {
        title: '操作',
        width: 200,
        render: (row: any) => (
          
          <div className="handle_btn">
            <span className={`m5 ${row.operatingStatus === 1 ? '' : 'hidden'}`}>
                <HandleButton icon="stop"  title="停止使用" handleClick={this.handleDiscontinue.bind(this, row, '2')} />
            </span>
            <span className={`m5 ${row.operatingStatus === 0 ? '' : 'hidden'}`}>
            <HandleButton icon="redo" title="恢复使用" handleClick={this.handleDiscontinue.bind(this, row, '3')} />
            </span>
            <span className={`m5 ${row.approvalStatus === 1 ? '' : 'hidden'}`}>
              <HandleButton  icon="key" title="修改密码" handleClick={this.handleChangePassword.bind(this, row)} />
            </span>
          </div>
          
        ),
        align: 'center',
      },
    ],

    parameter: {
      queryKey: '',
      approvalStatus: '',//审核状态
      connectionStatus: '',//链接状态
      operatingStatus: '',
      pageNum: 1,
      pageSize: 20,
      connStatus:'',
    },
    passwordParams: {},
    passwordModalvisible: false,
    seat: '0'
  };


  //停止使用
  handleDiscontinue(item: any, status: string) {
    const { dispatch } = this.props;
    let content =
      status == "2"
        ? "是否确认停止使用" +
        item.brokerName +
        item.account +
        "账户？停止后，与该账户相关的套保规则也将停止。"
        : "是否确认恢复使用" +
        item.brokerName +
        item.account +
        "账户？恢复后，与该账户相关的套保规则也将恢复。";

    let param = {
      companyAutoHedgeId: item.companyAutoHedgeId,
      status: status
    };

    confirm({
      title: '温馨提示',
      content: content,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        if (dispatch) {
          dispatch({
            type: 'hedging/fetchHedgingStatusDatas',
            payload: param
          })
        }
        message.success('修改成功');
      },
      onCancel() {},
    });
  }

  getPageDatas() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'hedging/fetchHedgingAccountDatas',
        payload: this.state.parameter
      })
    }
  }
  
  UNSAFE_componentWillMount() {
    this.getPageDatas()
  }
  //搜索
  handleSearch(val: string) {
    this.handleparmas(val, 'queryKey');
  }

  // 修改状态
  handleType = (e: string, type: string) => {
    this.handleparmas(e, type)
  };

  // 修改参数
  handleparmas(value: any, dataName: string) {
    let parameter = this.state.parameter;
    parameter[dataName] = value;
    this.setState({
      parameter: parameter,
    });
    this.getPageDatas();
  }

  //修改密码
  handleChangePassword(row: any) {
    this.setState({
      passwordParams: row,
      passwordModalvisible: true,
    });
  }

  handlePasswordModalCancel = () => {
    this.setState({
      passwordModalvisible: false,
    });
  };

  handleSubmit =(e:any) => {
    e.preventDefault();
    let editPasswordCallBackCode = this.props.editPasswordCallBackCode
    this.props.form.validateFields((err:any, values:any) => {
      if (!err) {
          const { dispatch } = this.props;
          let param = {
            companyAutoHedgeId: this.state.passwordParams.companyAutoHedgeId,
            password: values.password,
            seat: values.seat,
          };
          if (dispatch) {
            dispatch({
              type: 'hedging/fetchEditPassword',
              payload: param
            })
          }
          if(editPasswordCallBackCode==='0000'){
            message.success('修改成功');
            this.setState({
              passwordModalvisible: false,
            });
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
        <div className={styles.HedgingAccountPageContent}>
          <Modal
            className={styles.passwordModalForm}
            title="修改密码"
            visible={this.state.passwordModalvisible}
            onCancel={this.handlePasswordModalCancel.bind(this)}
            footer={null}
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label="企业简称：" >
                {getFieldDecorator('companyShortName')(
                  <span> {this.state.passwordParams.companyShortName} </span>
                )}
              </Form.Item>
              <Form.Item label="期货公司：" >
                {getFieldDecorator('companyName')(
                  <span> {this.state.passwordParams.companyName}</span>
                )}
              </Form.Item>
              <Form.Item label="交易账户：" >
                {getFieldDecorator('account')(
                  <span> {this.state.passwordParams.account}</span>
                )}
              </Form.Item>
              <Form.Item label="交易密码：">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input type="password" placeholder={'请输入密码'} />,
                )}
              </Form.Item>

              <Form.Item label="交易席位：">
              {getFieldDecorator('seat',{initialValue: "1"})(
                  <Radio.Group >
                    <Radio value="1">主席</Radio>
                    <Radio value="2">次席</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item  wrapperCol={{span: 24}}>
                <div className="center">
                  <Button onClick={this.handlePasswordModalCancel}>取消</Button>
                  <Button htmlType="submit" className="mL20" type="primary">确定</Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

        <header className="pageHeader">
          <Row >
            <Col className="gutter-row" >
              <Search className={`mR20 ${styles.search}`} placeholder="请输入企业名称/简称/期货账户" onSearch={value => this.handleSearch(value)} enterButton />
            </Col>
          </Row>
          <Row >
            <Col className="gutter-row mT20" >
              <Form>
                <Form.Item label="审核状态：" labelCol={{ span: 1 }}>
                  <AntdRadioGroup value={this.state.parameter.approvalStatus} groupArr={this.state.approvalStatusArr} change={(e: any) => { this.handleType(e, "approvalStatus") }} />
                </Form.Item>
                <Form.Item label="连接情况：" labelCol={{ span: 1 }}>
                  <AntdRadioGroup value={this.state.parameter.connectionStatus} groupArr={this.state.connectionStatusTypeArr} change={(e: any) => { this.handleType(e, "connectionStatus") }} />
                </Form.Item>
                <Form.Item label="使用情况：" labelCol={{ span: 1 }}>
                  <AntdRadioGroup value={this.state.parameter.operatingStatus} groupArr={this.state.operatingStatusArr} change={(e: any) => { this.handleType(e, "operatingStatus") }} />
                </Form.Item>
              </Form>
            </Col>
          </Row>

        </header>
        <div className="pageContent">
          <div className={` ${styles.contentItem}`}>
            <Table<any>
              loading={this.props.loading}
              size="middle"
              pagination={false}
              rowKey={record => record.index}
              bordered
              columns={this.state.tableListtitle}
              dataSource={this.props.HedgingAccountList && this.props.HedgingAccountList.list ? this.props.HedgingAccountList.list : []}
            />
          </div>
        </div>
      </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<hedgingFormProps>()(
  connect(({ hedging, loading }: ConnectState) => ({
        HedgingAccountList: hedging.HedgingAccountList,
        loading: loading.models.hedging,
        editPasswordCallBackCode:hedging.editPasswordCallBackCode,
      }))(HedgingAccount),
);