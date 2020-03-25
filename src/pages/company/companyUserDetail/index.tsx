import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Table, Button, Row, Col, Modal, Form, Input, DatePicker, Radio, message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
interface Props extends ConnectProps {
    loading: boolean;
    userData: any;
}

interface FormProps extends ConnectProps {
    form: any
    userData: any
    iProps: any
    closeModel: any
}

interface State {
    userCode: string
    tableListTitle: any
    visible: boolean
}

class FormItem extends React.Component<FormProps>{

    componentDidMount() {
        this.props.form.setFieldsValue({ //设置编辑表单默认值
            createDate: moment(this.props.userData.createDate),
            userName: this.props.userData.userName,
            userIdentity: this.props.userData.userIdentity,
            userPhone: this.props.userData.userPhone,
            refereeUserName: this.props.userData.refereeUserName,
            refereePhone: this.props.userData.refereePhone,
            isBuyer: this.props.userData.isBuyer==='1'?'1':'2'
        })
    }

    changeDate() {

    }
    submit(e: Event) { //提交编辑后信息
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                const { dispatch } = this.props.iProps;
                if (dispatch) {
                    dispatch({
                        type: 'user/editUserDetail',
                        payload: {
                            createDate: Date.parse(values.createDate),
                            isBuyer: values.isBuyer === '1' ? true : false,
                            userCode: this.props.iProps.userData.user.userCode,
                            userIdentity: values.userIdentity,
                            userName: values.userName,
                            userPhone: values.userPhone,
                            refereePhone: values.refereePhone,
                            refereeUserName: values.refereeUserName,
                        },
                        callback: (res: any) => {
                            if (res.errorCode === '0000') {
                                this.props.closeModel()
                                message.success('操作成功!');
                            }
                        }
                    })
                }
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onSubmit={this.submit.bind(this)}>
                    <Form.Item label="真实姓名：">
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入真实姓名!' }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="身份证号：">
                        {getFieldDecorator('userIdentity', {
                            rules: [{ required: true, message: '请输入身份证号!' }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="手机号：">
                        {getFieldDecorator('userPhone', {
                            rules: [{ required: true, message: '请输入手机号!' }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="推荐人：">
                        {getFieldDecorator('refereeUserName')(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="推荐人手机号：">
                        {getFieldDecorator('refereePhone')(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="注册时间：">
                        {getFieldDecorator('createDate')(
                            <DatePicker allowClear={false} showTime onOk={this.changeDate} />
                        )}
                    </Form.Item>
                    <Form.Item label="是否平台买手：">
                        {getFieldDecorator('isBuyer')(
                            <Radio.Group>
                                <Radio value={'1'}>是</Radio>
                                <Radio value={'2'}>否</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <div className="center">
                            <Button type="primary" htmlType="submit" loading={this.props.iProps.loading}>确定</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
const FormItemEdit: any = Form.create()(FormItem)

class UserDetail extends React.Component<Props>{
    state: State = {
        userCode: '',
        //table标题
        tableListTitle: [
            { title: '公司名称', dataIndex: 'companyName', align: 'center' },
            { title: '简称', dataIndex: 'companyShortName', align: 'center' },
            { title: '用户身份', dataIndex: 'roleName', align: 'center' },
            { title: '业务方向', dataIndex: 'businessDirectionName', align: 'center' },
            { title: '有效期', dataIndex: 'validityDate', align: 'center' },
            { title: '账户状态', dataIndex: 'userCompanyStatusName', align: 'center' },
            { title: '上次登陆时间', dataIndex: 'lastLoginDate', align: 'center' },
            { title: '提交认证时间', dataIndex: 'registerDate', align: 'center' }
        ],
        visible: false,
    }

    UNSAFE_componentWillMount() {
        let props: any = this.props
        let self = this
        let userCode = props.location.state.userCode
        this.setState({
            userCode: userCode
        }, function () {
            self.queryUserDetail()
        })
    }

    queryUserDetail() { //获取用户信息
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'user/queryUserDetail',
                payload: {
                    createDate: "",
                    id: 1,
                    registerDate: "",
                    userCode: this.state.userCode,
                    userIdentity: "",
                    userName: "",
                    userPhone: "",
                }
            })
        }
    }
    edit() { //编辑
        this.setState({
            visible: true
        })
    }
    afterClose() {

    }
    closeModel(){
        this.setState({
            visible: false
        })
        this.queryUserDetail()
    }

    render() {
        return (
            <PageHeaderWrapper> 
            <div className={styles.companyUserDetail}>
                <header className="clearBoth">
                    <div className="fl">
                        <h3>账号 {this.props.userData.user && this.props.userData.user.userPhone}</h3>
                    </div>
                    <div className="fr">
                        <Button type="primary" icon="edit" onClick={this.edit.bind(this)}>编辑</Button>
                    </div>
                </header>
                <div className={styles.basicData}>
                    <h3>基本信息</h3>
                    <Row>
                        <Col span={8}>
                            <span>真实姓名：</span>
                            <span>{this.props.userData.user && this.props.userData.user.userName}</span>
                        </Col>
                        <Col span={8}>
                            <span>身份证号：</span>
                            <span>{this.props.userData.user && this.props.userData.user.userIdentity}</span>
                        </Col>
                        <Col span={8}>
                            <span>手机号码：</span>
                            <span>{this.props.userData.user && this.props.userData.user.userPhone}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <span>注册时间：</span>
                            <span>{this.props.userData.user && this.props.userData.user.createDate}</span>
                        </Col>
                        <Col span={8}>
                            <span>推荐人：</span>
                            <span>{this.props.userData.user && this.props.userData.user.refereeUserName}</span>
                        </Col>
                        <Col span={8}>
                            <span>推荐人手机号：</span>
                            <span>{this.props.userData.user && this.props.userData.user.refereePhone}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <span>是否平台买手：</span>
                            <span>{this.props.userData.user && this.props.userData.user.isBuyer==='1' ? '是' : '否'}</span>
                        </Col>
                    </Row>
                </div>
                <h3 className={styles.companyData}>认证公司信息</h3>
                <Table
                    loading={this.props.loading}
                    size="middle"
                    rowKey={row => row.companyCode}
                    bordered
                    columns={this.state.tableListTitle}
                    dataSource={this.props.userData.userCompany}
                    pagination={false}
                />
                <Modal
                    title="编辑"
                    afterClose={this.afterClose.bind(this)}
                    footer={null}
                    visible={this.state.visible}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                >
                    <FormItemEdit userData={this.props.userData.user} iProps={this.props} closeModel={this.closeModel.bind(this)}/>
                </Modal>
            </div>
            </PageHeaderWrapper>
        )
    }
}

export default connect(({ user, loading }: ConnectState) => ({
    userData: user.userData,
    loading: loading.models.user,
}))(UserDetail);
