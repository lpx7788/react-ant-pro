/** *新增用户页面** */
import React from 'react';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Drawer, Form, Button, Input, Radio, Select, message } from 'antd';
import styles from './NewUser.less';

const { Option } = Select;

// 主体部分
interface NewUserProps extends ConnectProps {
  form: any,
  userDefaultInfoData: any,
  openType: string,
  menuListDatas: any[]
  rolesList: any[]
  userVisible:boolean,
  departmentTreeDatas:any,
  handleStatusClick: (value: any) => void;
}
class NewUser extends React.Component<NewUserProps> {
  // 开启窗口
  showDrawer = () => {
    this.props.handleStatusClick(true);
  };

  // 关闭窗口
  onClose = () => {
    this.props.handleStatusClick(false);
  };

  render() {
    // console.log('rolesList==',this.props.rolesList);
    return (
      <div className={styles.menuAdd}>
      <Drawer
        title={this.props.openType === 'new' ? '新增用户' : '修改用户'}
        width={700}
        onClose={this.onClose}
        visible={this.props.userVisible}>
        <FormItemEdit rolesList={this.props.rolesList} dispatch={this.props.dispatch} key={(this.props.userDefaultInfoData.userId || '0') + Date.now()} openType={this.props.openType} chidmenuListDatas={this.props.menuListDatas} userInfoData={this.props.userDefaultInfoData} chiddepartmentTreeDatas={this.props.departmentTreeDatas} handleClose={this.onClose} />
      </Drawer>
    </div>
    );
  }
}

// form表单部分
interface ChildProps extends ConnectProps {
  handleClose: () => void
  form: any,
  userInfoData: any,
  openType: string,
  rolesList: any,
  dispatch:any
}

class FormItem extends React.Component<ChildProps> {
  // 初始化form数据
  componentDidMount() {
    const { openType } = this.props
    switch (openType) {
      case 'edit':
        const rolesName: string[] = [];
        // 处理角色数组
        if (this.props.userInfoData.roles.length != 0) {
          this.props.userInfoData.roles.forEach((item: any) => {
            rolesName.push(item.id)
          });
        }
        this.props.form.setFieldsValue({ // 设置编辑表单默认值
          username: this.props.userInfoData.username,
          nickname: this.props.userInfoData.nickname,
          mobile: this.props.userInfoData.mobile,
          roleName: rolesName,
          sex: `${this.props.userInfoData.sex}`,
        })
        break;
      case 'new':
        this.props.form.setFieldsValue({ // 设置编辑表单默认值
          sex: '1',
        })
    }
  }

  // 新增用户或者编辑用户信息
  UpdateUsersubmit(e: any) {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      //  新增成功发起请求
      const { dispatch } = this.props;
      if (!err && values) {
        const payload = {
          id: this.props.userInfoData.id ? this.props.userInfoData.id : '',
          username: values.username,
          nickname: values.nickname,
          mobile: values.mobile,
          sex: values.sex,
          roleId: values.roleName.join(','),
        }
        if (this.props.openType === 'new') {
          payload.password = values.password
        }
        // console.log(payload)
        if (dispatch) {
          dispatch({
            type: 'user/UpdateUserRequest',
            payload,
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

  onClose() {
    this.props.handleClose()
  }

  // 表单部分
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.menuItem}>
        <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} onSubmit={this.UpdateUsersubmit.bind(this)}>
          <Form.Item label="用户名：">
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(<Input placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item label="账户：">
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入账户' }],
            })(<Input placeholder="请输入账户" />)}
          </Form.Item>
          {this.props.openType === 'new' ?
            <Form.Item label="密码：">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(<Input type="password" placeholder="请输入密码" />)}
            </Form.Item> : ''
          }
          <Form.Item label="手机：">
            {getFieldDecorator('mobile', {
              rules: [{ required: true, message: '请输入手机号码' }],
            })(<Input placeholder="请输入手机号码" />)}
          </Form.Item>
          <Form.Item label="角色：">
            {getFieldDecorator('roleName', {
              rules: [{ required: true, message: '请选择角色名称' }],
            })(
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择角色"
              >
                {
                  this.props.rolesList ?
                    this.props.rolesList.map((item: any) => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    )) : ''
                }
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="性别：">
            {getFieldDecorator('sex', {
              rules: [{ required: true, message: '' }],
            })(
              <Radio.Group>
                <Radio value="1">男</Radio>
                <Radio value="2">女</Radio>
              </Radio.Group>,
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
            marginBottom: '0',
          }} wrapperCol={{ span: 24 }}>
            <Button onClick={this.onClose.bind(this)}style={{ marginRight: 8 }}>
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
export default connect(({ loading }: ConnectState) => ({
  // loading: loading.models.system,
}))(NewUser);
