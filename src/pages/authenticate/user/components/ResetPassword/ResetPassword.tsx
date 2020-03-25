/***用户信息弹窗***/
import React from 'react';
import styles from './ResetPassword';
import { connect } from 'dva';
import { ConnectProps ,ConnectState} from '@/models/connect';
import {Modal,Form,Input,Button,message } from 'antd';

// 主体部分内容
interface ResetPasswordProps extends ConnectProps {
  reSetModaleStatus:boolean,
  userInfoData:any,
  handleModalClick:  (value: boolean) => void;
}
 class ResetPassword extends React.Component<ResetPasswordProps> {
  // 关闭窗口
  onClose = () => {
    this.props.handleModalClick(false);
  };
  render() {
    return (
      <Modal
        width="750px"
        title="重置密码"
        onCancel={this.onClose.bind(this)}
        visible={this.props.reSetModaleStatus}
        footer=''>
        <FormItemEdit dispatch={this.props.dispatch} key={(this.props.userInfoData.id || '0') + Date.now()}  userInfoData={this.props.userInfoData}  handleClose={this.onClose} />
      </Modal>
    );
  }
}

// form表单部分的内容
interface ChildProps extends ConnectProps {
  handleClose: () => void
  form: any,
  userInfoData: any,
  dispatch:any,
}
class FormItem extends React.Component<ChildProps> {
  // 重置密码提交
  handleResetSubmit(e: any) {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      //  新增成功发起请求
      let { dispatch } = this.props
      if (!err && values) {
        let payload = {
          id: this.props.userInfoData.id ? this.props.userInfoData.id : '',
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          rePassword: values.rePassword,
        }
        // console.log(payload)
        if (dispatch) {
          dispatch({
            type: 'user/ResetUserPwd',
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
    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} onSubmit={this.handleResetSubmit.bind(this)}>
      <Form.Item label="旧密码：">
        {getFieldDecorator('oldPassword', {
          rules: [{ required: true, message: '请输入旧密码' }],
        })(<Input type="password" placeholder="请输入旧密码" />)}
      </Form.Item>
      <Form.Item label="新密码：">
        {getFieldDecorator('newPassword', {
          rules: [{ required: true, message: '请输入新密码' }],
        })(<Input type="password" placeholder="请输入新密码" />)}
      </Form.Item>

      <Form.Item label="确认密码：">
      {getFieldDecorator('rePassword', {
            rules: [{ required: true, message: '请确认密码' }],
          })(<Input type="password" placeholder="请确认密码" />)}
      </Form.Item> 
      <Form.Item style={{
          textAlign: 'center',
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
    );
  }
}
const FormItemEdit: any = Form.create()(FormItem);
export default connect(({loading }: ConnectState) => ({}))(ResetPassword);