import React from 'react'
import styles from './index.less'
import { router } from 'umi'
import { connect } from 'dva'
import { Button, Select, Row, Col, Form, Input, Radio, Divider } from 'antd';
import { ConnectState, ConnectProps } from '@/models/connect';
import RcViewer from 'rc-viewer'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import CategoryMultiple from '@/components/CategoryMultiple'

const { Option } = Select

interface Props extends ConnectProps {
    loading: boolean
    location: any
    form: any,
    registerPhone: Array<any>
}

class companyEdit extends React.Component<Props>{
    private categoryData: React.RefObject<any>;

    constructor(props: Props) {
        super(props)
        this.categoryData = React.createRef();
    }
    state: any = {
        companyDetail: {},
        companyIdentity: '1',
        licensePicUrl: '',
        authorizationUrl: '',
        licensePicUrlFile: null,
        authorizationUrlFile: null,
        categoryData: [],
        switch: false,
        licenseCheck: false,
    }

    UNSAFE_componentWillMount() {
        // this.setState({
        //     companyDetail: this.props.location.state.companyDetail,
        //     licensePicUrl: this.props.location.state.companyDetail.licensePicUrl,
        //     authorizationUrl: this.props.location.state.companyDetail.authorizationFileUrl,
        //     switch: this.props.location.state.companyDetail.carefullyChosenSeller
        // })
        this.queryRegisterPhone()
    }
    componentDidMount() {
        this.props.form.setFieldsValue({ //设置编辑表单默认值
            companyIdentity: '1'
        })
    }
    uploadPic(e: any, name: string, nameFile: string) { //上传授权书、营业执照
        let self = this
        let file = e.target.files[0];
        this.props.form.setFieldsValue({
            [name]: file
        })
        //创建读取文件对象
        let reader = new FileReader();
        //读取文件
        reader.readAsDataURL(file);
        //在回调函数中修改Img的src属性
        reader.onload = function () {
            self.setState({
                [name]: reader.result,
                [nameFile]: file
            })
        }
    }
    loadImage(file: any) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.onload = function () {
                let dataURL = reader.result
                resolve(dataURL)
            }
            reader.onerror = function () {
                reject(reader.error)
            }
            reader.readAsDataURL(file)
        })
    }
    clickUpload(name: string) {
        if (this.refs[name]) {
            this.refs[name].click()
        }
    }
    queryCategoryData(val: any) {
        let arr = val.map((item: any) => item.categoryCode)
        this.setState({
            categoryData: arr
        })
    }
    switchClick(checked: boolean, event: Event) { //精选卖家开关
        this.setState({
            switch: checked
        })
    }
    save(e: Event) { //保存
        e.preventDefault();
        const { dispatch } = this.props;
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                if (dispatch) {
                    let formData = new FormData();
                    formData.append('userName', values.userName)
                    formData.append('userIdentity', values.userIdentity)
                    formData.append('userPhone', values.userPhone);
                    formData.append('companyName', values.companyName)
                    formData.append('companyShortName', values.companyShortName)
                    formData.append('referee', values.referee);
                    formData.append('remark', values.remark);
                    formData.append('companyIdentity', values.companyIdentity)
                    formData.append('creditNum', values.creditNum)
                    formData.append('imageFile', this.state.licensePicUrlFile)
                    formData.append('authorizationFile', this.state.authorizationUrlFile)
                    dispatch({
                        type: 'company/companyJoin',
                        payload: formData,
                        callback: (res: any) => {
                            if (res.errorCode === '0000') {
                                router.push({ pathname: '/company/companyList' })
                            }
                        }
                    })
                }
            }
        })
    }
    queryRegisterPhone() {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'user/queryRegisterPhone',
                payload: {}
            })
        }
    }
    changeUserPhone(value:string){ //选择手机号
        this.props.registerPhone.forEach(item => {
            if(value===item.userPhone){
                this.props.form.setFieldsValue({
                    userName: item.userName,
                    userIdentity: item.userIdentity
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <PageHeaderWrapper> 
            <div className={styles.companyAdd}>
                <Form labelAlign="right" onSubmit={this.save.bind(this)}>
                    <div className={`${styles.examineData} ${styles.dataItem}`}>
                        <h3>审核信息</h3>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="企业简称：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('companyShortName', {
                                        rules: [{ required: true, message: '请输入企业简称' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="推荐人：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('referee')(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="备注：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('remark')(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <Divider />
                    <div className={`${styles.submitData} ${styles.dataItem}`}>
                        <h3>提交人信息</h3>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="姓名：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: '请输入姓名！' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="身份证号：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('userIdentity', {
                                        rules: [{ required: true, message: '请输入身份证号！' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="手机号：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('userPhone', {
                                        rules: [{ required: true, message: '请选择手机号！' }],
                                    })(
                                        <Select showSearch onChange={this.changeUserPhone.bind(this)}>
                                            {
                                                this.props.registerPhone.map(item => {
                                                    return (
                                                        <Option value={item.userPhone} key={item.userPhone}>{item.userPhone}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <Divider />
                    <div className={`${styles.identificationData} ${styles.dataItem}`}>
                        <h3>认证信息</h3>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="公司名称：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('companyName', {
                                        rules: [{ required: true, message: '请输入公司名称！' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="统一社会信用代码：" labelCol={{ span: 8 }} wrapperCol={{ span: 13 }}>
                                    {getFieldDecorator('creditNum', {
                                        rules: [{ required: true, message: '请输入统一社会信用代码：！' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            {/* <Col span={8}>
                                <Form.Item label="注册资本：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('creditNum', {
                                        rules: [{ required: true, message: '请输入注册资本！' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col> */}
                            {/* <Col span={8}>
                                <Form.Item label="交易品种：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    <CategoryMultiple defaultValue={this.props.location.state.companyDetail.tradingCategoryCode} onChange={this.queryCategoryData.bind(this)}/>
                                </Form.Item>
                            </Col> */}
                        </Row>
                        {/* <Row>
                            <Col span={8}>
                                <Form.Item label="所在城市：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    <CategoryMultiple defaultValue={this.props.location.state.companyDetail.tradingCategoryCode} onChange={this.queryCategoryData.bind(this)}/>
                                </Form.Item>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col span={8}>
                                <Form.Item label="企业身份：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('companyIdentity')(
                                        <Radio.Group>
                                            <Radio value={'1'}>买家</Radio>
                                            <Radio value={'2'}>卖家</Radio>
                                            <Radio value={'3'}>买家和卖家</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="营业执照：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('licensePicUrl', {
                                        rules: [{ required: true, message: '请上传营业执照！' }],
                                    })(
                                        <RcViewer>
                                            <img src={this.state.licensePicUrl} alt="" />
                                        </RcViewer>
                                    )}
                                    <Button type="primary" icon="cloud-upload" onClick={this.clickUpload.bind(this, 'uploadLicense')}>上传营业执照</Button>
                                    <div className="hidden">
                                        <input ref="uploadLicense" type="file" accept="image/*" onChange={(e: any) => { this.uploadPic(e, 'licensePicUrl', 'licensePicUrlFile') }} />
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="认证授权书：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    {getFieldDecorator('authorizationUrl', {
                                        rules: [{ required: true, message: '请上传认证授权书！' }],
                                    })(
                                        <RcViewer>
                                            <img src={this.state.authorizationUrl} alt="" />
                                        </RcViewer>
                                    )}
                                    <Button type="primary" icon="cloud-upload" onClick={this.clickUpload.bind(this, 'uploadAuthorization')}>上传认证授权书</Button>
                                    <div className="hidden">
                                        <input ref="uploadAuthorization" type="file" accept="image/*" onChange={(e: any) => { this.uploadPic(e, 'authorizationUrl', 'authorizationUrlFile') }} />
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <Divider />
                <footer className="center">
                    <Button type="primary" icon="save" htmlType="submit" loading={this.props.loading} onClick={this.save.bind(this)}>确认添加</Button>
                </footer>
            </div>
            </PageHeaderWrapper>
        )
    }
}

export default Form.create<Props>()(
    connect(({ user, loading }: ConnectState) => ({
        registerPhone: user.registerPhone,
        loading: loading.models.company,
    }))(companyEdit)
);