import React from 'react'
import styles from './index.less'
import { router } from 'umi'
import { connect } from 'dva'
import { Button, Switch, Row, Col, Form, Input, Radio, Divider } from 'antd';
import { ConnectState, ConnectProps } from '@/models/connect';
import RcViewer from 'rc-viewer'
import CategoryMultiple from '@/components/CategoryMultiple'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
interface Props extends ConnectProps {
    location: any
    form: any
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
    }

    UNSAFE_componentWillMount() {
        this.setState({
            companyDetail: this.props.location.state.companyDetail,
            licensePicUrl: this.props.location.state.companyDetail.licensePicUrl,
            authorizationUrl: this.props.location.state.companyDetail.authorizationFileUrl,
            switch: this.props.location.state.companyDetail.carefullyChosenSeller
        })
    }
    componentDidMount() {
        this.props.form.setFieldsValue({ //设置编辑表单默认值
            companyShortName: this.state.companyDetail.companyShortName,
            // referee: this.state.companyDetail.referee,
            introducer: this.state.companyDetail.introducer,
            remark: this.state.companyDetail.remark,
            userName: this.state.companyDetail.userName,
            userIdentity: this.state.companyDetail.userIdentity,
            companyIdentity: this.state.companyDetail.companyIdentity,
            companyName: this.state.companyDetail.companyName,
            creditNum: this.state.companyDetail.creditNum
        })
    }
    uploadPic(e: any, name: string, nameFile: string) { //上传授权书、营业执照
        let self = this
        let file = e.target.files[0];
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
    queryCategoryData(val:any){
        let arr = val.map((item:any) => item.categoryCode)
        this.setState({
            categoryData: arr
        })
    }
    switchClick(checked: boolean, event: Event){ //精选卖家开关
        this.setState({
            switch: checked
        })
    }
    save(e: Event) { //保存编辑
        e.preventDefault();
        const { dispatch } = this.props;
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                if (dispatch) {
                    let formData = new FormData();
                    formData.append('companyCode', this.state.companyDetail.companyCode)
                    formData.append('userName', values.userName)
                    formData.append('userIdentity', values.userIdentity)
                    formData.append('mobilePhone',this.state.companyDetail.mobilePhone);
                    formData.append('companyName', values.companyName)
                    formData.append('companyShortName', values.companyShortName)
                    // formData.append('referee',values.referee);
                    formData.append('introducer',values.introducer);
                    formData.append('carefullyChosenSeller',this.state.switch?'1':'0')
                    formData.append('remark',values.remark);
                    formData.append('companyIdentity', values.companyIdentity)
                    formData.append('creditNum', values.creditNum)
                    formData.append('tradingCategoryCode',this.state.categoryData.join(','))
                    if (this.state.licensePicUrl != null) {
                        formData.append('imageFile', this.state.licensePicUrlFile)
                    }
                    if (this.state.authorizationFileUrl != null) {
                        formData.append('authorizationFile', this.state.authorizationUrlFile)
                    }
                    dispatch({
                        type: 'company/companyDetailEdit',
                        payload: formData,
                        callback: (res: any) => {
                            if (res.errorCode === '0000') {
                                router.push({pathname:'/company/companyList/companyDetail',state:{companyCode: this.state.companyDetail.companyCode}})
                            }
                        }
                    })
                }
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <PageHeaderWrapper> 
            <div className={styles.companyEdit}>
                <header className="clearBoth">
                    <div className="fl"><h3>{this.state.companyDetail.companyName}</h3><span className={styles.carefullyChosenSeller}>精选卖家<Switch size="small" className="mL10" defaultChecked={this.state.switch} onClick={this.switchClick.bind(this)}/></span></div>
                    <div className="fr"><Button type="primary" icon="save" htmlType="submit" onClick={this.save.bind(this)}>保存</Button></div>
                </header>
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
                                    {getFieldDecorator('introducer')(
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
                    <Divider/>
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
                                    <span>{this.state.companyDetail.mobilePhone}</span>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <Divider/>
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
                                        rules: [{ required: true, message: '请输入统一社会信用代码！' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="交易品种：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    <CategoryMultiple defaultValue={this.props.location.state.companyDetail.tradingCategoryCode} onChange={this.queryCategoryData.bind(this)}/>
                                </Form.Item>
                            </Col>
                        </Row>
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
                                    <RcViewer>
                                        <img src={this.state.licensePicUrl} alt="" />
                                    </RcViewer>
                                    <Button type="primary" icon="cloud-upload" onClick={this.clickUpload.bind(this, 'uploadLicense')}>重新上传</Button>
                                    <div className="hidden">
                                        <input ref="uploadLicense" type="file" accept="image/*" onChange={(e: any) => { this.uploadPic(e, 'licensePicUrl', 'licensePicUrlFile') }} />
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="认证授权书：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                    <RcViewer>
                                        <img src={this.state.authorizationUrl} alt="" />
                                    </RcViewer>
                                    <Button type="primary" icon="cloud-upload" onClick={this.clickUpload.bind(this, 'uploadAuthorization')}>重新上传</Button>
                                    <div className="hidden">
                                        <input ref="uploadAuthorization" type="file" accept="image/*" onChange={(e: any) => { this.uploadPic(e, 'authorizationUrl', 'authorizationUrlFile') }} />
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
            </PageHeaderWrapper>
        )
    }
}

export default Form.create<Props>()(
    connect(({ company, loading }: ConnectState) => ({
        loading: loading.models.company,
    }))(companyEdit)
);