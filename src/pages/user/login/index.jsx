import { Input, Form, Button, Checkbox, Icon, message } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';
import router from 'umi/router';
import { connect } from 'dva';
import { setAuthority } from '@/utils/authority';
import Footer from '../../../layouts/Footer';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  setToken(){
        let datas = {
        "returnObject": {
            "id": 1,
            "createTime": 1510937819000,
            "updateTime": 1546967147000,
            "username": "admin",
            "password": "$2a$10$TJkwVdlpbHKnV45.nBxbgeFHmQRmyWlshg94lFu2rKxVtT2OMniDO",
            "nickname": "管理员",
            "headImgUrl": "http://pkqtmn0p1.bkt.clouddn.com/头像.png",
            "mobile": "18888888888",
            "sex": 0,
            "enabled": true,
            "type": "APP",
            "openId": "123",
            "roles": [{
              "code": "ADMIN",
              "createTime": 1510937819000,
              "id": 1,
              "name": "管理员",
              "updateTime": 1537349950000,
              "userId": 0
          }],
            "roleId": null,
            "oldPassword": null,
            "newPassword": null,
            "permissions": null,
            "accountNonLocked": true,
            "credentialsNonExpired": true,
            "accountNonExpired": true,
            "userId": "123",
            "del": false
        },
        "errorCode": 0,
        "errorMsg": ""
    }
    localStorage.setItem('userData', JSON.stringify(datas))
    localStorage.setItem('token','699101a5-26e0-4c76-b31f-b38751f5e0bb');
    setAuthority(datas.returnObject.roles)

  }

  randomstring(L){
    var s= '';
    var randomchar=function(){
     var n= Math.floor(Math.random()*62);
     if(n<10) return n; //1-10
     if(n<36) return String.fromCharCode(n+55); //A-Z
     return String.fromCharCode(n+61); //a-z
    }
    while(s.length< L) s+= randomchar();
    return s;
  }

  handleSubmit = e => {
    
    this.setToken()
    router.push('/home');
    // e.preventDefault();
    // const { dispatch } = this.props.data;
    // let self = this;
    // this.props.form.validateFields((err, values) => {
    //   dispatch({
    //     type: 'login/getToken',
    //     payload: {
    //       username: values.userName,
    //       password: values.password,
    //       deviceId: self.randomstring(10),
    //     },
    //     callback: res => {
    //       const datas = res.returnObject;
    //       localStorage.setItem('token', datas.access_token);
    //       if(localStorage.getItem('token')){
    //         dispatch({
    //           type: 'login/getuserDatas',
    //         });
    //       }
    //     },
    //   });
    // });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('userName', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '手机号码不能为空',
              },
              {
                message: '手机号码不正确',
              },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入手机号码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            initialValue: '',
            rules: [
              { required: true, message: '请输入密码!' },
              
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入密码"
              type="password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <div className={styles.buttnItem}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>自动登录</Checkbox>)}
            <a href="">忘记密码</a>
          </div>

          <div className={styles.buttnItem}>
            <Button type="primary" htmlType="submit" className={styles.button}>
              登录
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  }
}
LoginForm = Form.create({})(LoginForm);
class Login extends Component {
 
  render() {
    const { userData, loading } = this.props;
    return (
      <div className={styles.loginPage}>
        <div className={styles.main}>
          <LoginForm data={this.props} />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  userData: login.userData,
  loading: loading.models.login,
}))(Login);
