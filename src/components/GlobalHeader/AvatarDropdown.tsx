import { Avatar, Icon, Menu, Modal, Form, Input } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect'; // import { CurrentUser } from '@/models/user';

import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  // currentUser?: CurrentUser;
  menu?: boolean;
}
export interface Props extends ConnectProps {
  form: any;
  type?: string;
}

class FormItem extends React.Component<Props> {
  state = {
    visible: false,
  };

  handleSubmit(e: Event) {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
      }
    });
  }

  visibleCancel() {
    this.setState({
      visible: false,
    });
  }

  restPW() {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
      }
    });
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 20,
        },
      },
    };
    return (
      <div
        style={
          this.props.type === 'inline'
            ? {
                display: 'inline',
              }
            : {}
        }
      >
        <span onClick={this.showModal.bind(this)}>重置密码</span>
        <Modal
          title="重置密码"
          closable={false}
          zIndex={2000}
          visible={this.state.visible}
          onOk={this.restPW.bind(this)}
          onCancel={this.visibleCancel.bind(this)}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit.bind(this)} className="login-form">
            <Form.Item label="旧密码">
              {getFieldDecorator('oldPW', {
                rules: [
                  {
                    required: true,
                    message: '旧密码不能为空',
                  },
                ],
              })(
                <Input
                  type="password"
                  prefix={
                    <Icon
                      type="lock"
                      style={{
                        color: 'rgba(0,0,0,.25)',
                      }}
                    />
                  }
                  placeholder="请输入旧密码"
                />,
              )}
            </Form.Item>
            <Form.Item label="新密码">
              {getFieldDecorator('newPW', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                  {
                    validator: (rule: any, value: any, callback: any) => {
                      // let reg = /^(\w){6,20}$/
                      const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/;

                      if (!reg.exec(value)) {
                        callback('密码长度为8-18位,由字母、数字组成，区分大小写');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <Input
                  type="password"
                  prefix={
                    <Icon
                      type="lock"
                      style={{
                        color: 'rgba(0,0,0,.25)',
                      }}
                    />
                  }
                  placeholder="请输入新密码"
                />,
              )}
            </Form.Item>
            <Form.Item label="确认密码">
              {getFieldDecorator('confirmNewPW', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                  {
                    validator: (rule: any, value: any, callback: any) => {
                      const newPW = this.props.form.getFieldValue('newPW');

                      if (newPW !== value) {
                        callback('新密码与确认密码不一致');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <Input
                  type="password"
                  prefix={
                    <Icon
                      type="lock"
                      style={{
                        color: 'rgba(0,0,0,.25)',
                      }}
                    />
                  }
                  placeholder="请输入新密码"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const ResetPW: any = Form.create()(FormItem);

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  state = {
    visible: false,
  };

  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      localStorage.clear();
      router.push('/user/login');
      return;
    } // router.push(`/account/${key}`);

    if (key === 'resetPW') {
      this.setState({
        visible: true,
      });
    }
  };

  visibleCancel() {
    this.setState({
      visible: false,
    });
  }

  restPW() {}

  render(): React.ReactNode {
    let userName = localStorage.getItem('userData');
    userName = userName ? JSON.parse(userName).returnObject.nickname : 'unknow';
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>

        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
        <Menu.Item key="resetPW">
          <Icon type="key" />
          {/* 重置密码 */}
          <ResetPW visible={this.state.visible} type="inline" />
        </Menu.Item>
      </Menu>
    ); 
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <div className={styles.userName}>
          <Avatar size="small" icon="user" />
          <span>{userName}</span>
        </div>
      </HeaderDropdown>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
}))(AvatarDropdown);
