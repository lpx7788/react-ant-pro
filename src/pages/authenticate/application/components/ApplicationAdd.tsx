import React from 'react';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import styles from './style.less';
import { Drawer, Form, Button,message, Input, Select } from 'antd';
const { Option } = Select;

// 主体部分
interface ApplicationAddProps extends ConnectProps {
  form: any,
  editInfoDatas: any,
  openType: string,
  applicationVisible: boolean,
  applicationNameList: any,
  handleStatusClick: (value: any) => void;
}
class ApplicationAdd extends React.Component<ApplicationAddProps> {
  // 关闭窗口
  onClose = () => {
    this.props.handleStatusClick(false);
  };
 
  // 主题部分
  render() {
    return (
      <div className={styles.ApplicationAdd}>
        <Drawer
          title={'修改应用信息'}
          width={700}
          onClose={this.onClose}
          visible={this.props.applicationVisible}>
          <FormItemEdit key={(this.props.editInfoDatas.id || '0') + Date.now()} curFormMenuDatas={this.props.editInfoDatas} openType={this.props.openType} dispatch={this.props.dispatch} chidapplicationNameList={this.props.applicationNameList} handleClose={this.onClose} />
        </Drawer>
      </div>
    );
  }
}

// form表单部分
interface childMenuFormState {
  typeValue:any
}

interface childMenuFormProps extends ConnectProps {
  handleClose: () => void
  openType: string,
  form: any,
  curFormMenuDatas: any,
  chidapplicationNameList: any
  dispatch:any,
}

class FormItem extends React.Component<childMenuFormProps, childMenuFormState> {
  state: childMenuFormState = {
    typeValue:'1'
  };

  componentDidMount() {
    if(this.props.openType==='edit'){
      this.props.form.setFieldsValue({
        clientId:this.props.curFormMenuDatas.clientId,
        clientName:this.props.curFormMenuDatas.clientName,
        clientSecret:this.props.curFormMenuDatas.clientSecret,
        webServerRedirectUri:this.props.curFormMenuDatas.webServerRedirectUri,
        authorizedGrantTypes:this.props.curFormMenuDatas.authorizedGrantTypes,
      })
    }
  }

  // 新增或者编辑提交
  applicationUpdetasubmit(e: any) {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      let { dispatch } = this.props;
      let payload:any;
      if (!err && values) {
           payload = {
            clientName: values.clientName,
            clientSecret:values.clientSecret,
            clientId:values.clientId,
            authorizedGrantTypes:values.authorizedGrantTypes,
            webServerRedirectUri:values.webServerRedirectUri,
          }
        if (dispatch) {
          dispatch({
            type: 'application/updateApplicationRequest',
            payload: payload,
            callback: (res: any) => {
              if (res.errorCode === '0000') {
                message.success('操作成功');
                this.props.handleClose()
              }
            },
          })
        }
      }
    });
  }
  onClose(){
    this.props.handleClose()
  }
  // 表单部分
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.menuItem}>
        <Form labelCol={{ span: 3}} wrapperCol={{ span: 14 }} onSubmit={this.applicationUpdetasubmit.bind(this)}>
          <Form.Item label="应用标识：">
            {getFieldDecorator('clientId', {
              rules: [{ required: true, message: '请输入应用标识' }],
            })(
              <Input  placeholder="请输入应用标识"  />
            )}
          </Form.Item>

          <Form.Item label="应用名称：">
            {getFieldDecorator('clientName', {
              rules: [{ required: true, message: '请输入应用名称' }],
            })(
              <Select
                showSearch
                style={{ width: 320 }}
                placeholder="请选择应用名称"
                optionFilterProp="children">
                {
                  this.props.chidapplicationNameList ?
                    this.props.chidapplicationNameList.map((item:any) => (
                      <Option key={item.id} value={item.clientName}>{item.clientName}</Option>
                  )) : ''
                }
              </Select>
            )}
          </Form.Item>

          <Form.Item label="应用密钥：">
            {getFieldDecorator('clientSecret', {
              rules: [{ required: true, message: '请输入应用密钥' }],
            })(
              <Input  placeholder="请输入应用密钥" />
            )}
          </Form.Item>

          <Form.Item label="回调地址：">
            {getFieldDecorator('webServerRedirectUri', {
              rules: [{ required: true, message: '请输入回调地址' }],
            })(
              <Input placeholder="请输入回调地址"/>
            )}
          </Form.Item>

          <Form.Item label="授权方式：">
            {getFieldDecorator('authorizedGrantTypes', {
              rules: [{ required: true, message: '请输入授权方式' }],
            })(
              <Input placeholder="请输入授权方式"/>
            )}
          </Form.Item>

          <Form.Item style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',

            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            marginBottom: '0'
          }} wrapperCol={{ span: 24 }}>
            <Button onClick={this.onClose.bind(this)} style={{ marginRight: 8 }}>
              取消
                </Button>
            <Button htmlType="submit" type="primary">
              提交
                </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const FormItemEdit: any = Form.create()(FormItem);
export default connect(({loading }: ConnectState) => ({
  loading: loading.models.application,
}))(ApplicationAdd);