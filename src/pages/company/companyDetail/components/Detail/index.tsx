import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Button, Row, Col, Modal, Form, Input, Spin } from 'antd';
import RcViewer from 'rc-viewer'
import { router } from 'umi';

const { TextArea } = Input;

interface Props extends ConnectProps {
    loading: boolean;
    categoryTree: any
    companyCode: string
    companyData: {
        companyName: any,
        companyShortName: any,
        verifyUserName: any,
        companyStatus: any,
        carefullyChosenSeller: any,
        companyStatusName: any,
        userName: any,
        userIdentity: any,
        mobilePhone: any,
        creditNum: any,
        companyIdentityName: any,
        address: any,
        registeredCapital: any,
        licensePicUrl: any,
        authorizationFileUrl: any,
        RegistCapi: any,
        lastupdateDate: any,
        detailByYJ: any,
        remark: any,
        introducer: any,
        tradingCategoryCode: any
    };
}
interface State {
    companyCode: string
    visible: boolean
    categoryNameList: Array<any>, //交易品种中文名
    categoryList: Array<any>, //品种树
    allCategoryLevel3List: Array<any>, //三级品种
    isPass: string,
}
interface FormProps extends ConnectProps {
    form: any
    companyDetail: any
    iProps: any
    closeModel: any
    isPass: string
}
class FormItem extends React.Component<FormProps>{
    componentDidMount(){
        this.props.onRef(this)
    }

    setRequired(val?:string){
        this.props.form.resetFields()
    }
    submit(e: Event) { //提交编辑后信息
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                const { dispatch } = this.props.iProps;
                if (dispatch) {
                    let userCode = JSON.parse(localStorage.getItem('userData')).user.userCode
                    let params
                    if (this.props.isPass === 'Y') {
                        params = {
                            auditor: userCode,
                            companyCode: this.props.companyDetail.companyCode,
                            isPass: this.props.isPass,
                            remark: values.remark,
                            introducer: values.introducer,
                            shortName: values.shortName
                        }
                    } else {
                        params = {
                            auditor: userCode,
                            companyCode: this.props.companyDetail.companyCode,
                            isPass: this.props.isPass,
                            remark: values.remark
                        }
                    }
                    dispatch({
                        type: 'company/companyExamine',
                        payload: params,
                        callback: (res: any) => {
                            if (res.errorCode === '0000') {
                                this.props.closeModel()
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
                    <Form.Item label="企业名称：" className={this.props.isPass === 'Y' ? '' : 'hidden'}>
                        <span>{this.props.companyDetail&&this.props.companyDetail.companyName}，确认审核通过。</span>
                    </Form.Item>
                    <Form.Item label="企业简称：" className={this.props.isPass === 'Y' ? '' : 'hidden'}>
                        {getFieldDecorator('shortName', {
                            rules: [{ required: this.props.isPass === 'Y', message: '请输入企业简称' }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="推荐人：" className={this.props.isPass === 'Y' ? '' : 'hidden'}>
                        {getFieldDecorator('introducer')(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="备注：">
                        {getFieldDecorator('remark', {
                            rules: [{ required: this.props.isPass === 'N', message: '请输入备注' }],
                        })(
                            <TextArea />
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
        companyCode: '',
        visible: false,
        categoryNameList: [], //交易品种中文名
        categoryList: [], //品种树
        allCategoryLevel3List: [], //三级品种
        isPass: '',
    }

    UNSAFE_componentWillMount() {
        this.queryCategoryTree()
    }
    edit() { //编辑
        router.push({ pathname: '/company/companyList/companyDetail/companyEdit', state: { companyDetail: this.props.companyData } })
    }
    examine(val: string) { //审核
        this.setState({
            visible: true,
            isPass: val === '1' ? 'Y' : 'N'
        },function(){
            this.child.setRequired()
        })
    }
    afterClose() {

    }
    closeModel() {
        this.setState({
            visible: false
        })
        // this.queryCompanyDetail()
    }
    queryCategoryTree() {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'category/categoryTreeQuery',
                payload: {},
                callback: (response: any) => {
                    if (response.errorCode === '0000') {
                        let res = response.returnObject
                        this.setState({
                            categoryList: res,
                        })
                        let arr2: any = []
                        res.forEach((level1: any) => {
                            level1.childs.forEach((level2: any) => {
                                level2.childs.forEach((level3: any) => {
                                    arr2.push(level3)
                                })
                            })
                        })
                        this.state.allCategoryLevel3List = arr2

                        if (this.props.companyDetail && this.props.companyDetail.tradingCategoryCode) {
                            this.state.categoryNameList = []
                            let tradingCategoryCodeList = this.props.companyDetail.tradingCategoryCode.split(',')
                            this.state.allCategoryLevel3List.forEach(item => {
                                tradingCategoryCodeList.forEach((i: any) => {
                                    if (item.categoryCode == i) {
                                        this.state.categoryNameList.push(item.categoryName)
                                    }
                                })
                            })
                        }
                        this.setState({
                            categoryNameList: this.state.categoryNameList
                        })
                    }
                }
            })
        }
    }
    onRef = (ref) => {
        this.child = ref
    }

    render() {
        
        return (
            <div className={styles.basicData}>
                <Spin spinning={this.props.loading}>
                    <div className={styles.tabPaneContent}>
                        <header className="clearBoth">
                            <div className="fl">
                                <div>
                                    <h3>{this.props.companyData && this.props.companyData.companyName} <span className={this.props.companyData && this.props.companyData.carefullyChosenSeller ? styles.carefullyChosenSeller : 'hidden'} style={{ fontSize: 15 }}>(精选卖家)</span></h3>
                                    <div style={{ fontSize: 15 }}>当前状态：<span className={this.props.companyData && this.props.companyData.companyStatus === '1' ? 'warning' : (this.props.companyData && this.props.companyData.companyStatus === '2' ? 'success' : 'error')}>{this.props.companyData && this.props.companyData.companyStatusName}</span></div>
                                </div>
                            </div>
                            <div className={this.props.companyData && this.props.companyData.companyStatus === '1' ? 'hidden' : ''}>
                                <Button className="fr" type="primary" onClick={this.edit.bind(this)}>编辑</Button>
                            </div>
                            <div className={this.props.companyData && this.props.companyData.companyStatus === '1' ? '' : 'hidden'}>
                                <Button className="fr mL10" type="danger" icon="close" onClick={this.examine.bind(this, '2')}>拒绝</Button>
                                <Button className="fr" type="primary" icon="check" onClick={this.examine.bind(this, '1')}>通过</Button>
                            </div>
                        </header>
                    </div>
                    <div className={`${styles.tabPaneContent} ${this.props.companyData && this.props.companyData.companyStatus === '1' ? 'hidden' : ''}`}>
                        <h3>审核信息</h3>
                        <div className={this.props.companyData && this.props.companyData.companyStatus === '2' ? '' : 'hidden'}>
                            <Row>
                                <Col span={8}>
                                    <p>
                                        <span>企业简称：</span>
                                        <span>{this.props.companyData && this.props.companyData.companyShortName}</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>审核人：</span>
                                        <span>{this.props.companyData && this.props.companyData.verifyUserName}</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>审核时间：</span>
                                        <span>{this.props.companyData && this.props.companyData.lastupdateDate}</span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <p>
                                        <span>推荐人：</span>
                                        <span>{this.props.companyData && this.props.companyData.introducer}</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>备注：</span>
                                        <span>{this.props.companyData && this.props.companyData.remark}</span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <p>
                                        <span>最后更新时间：</span>
                                        <span>{this.props.companyData && this.props.companyData.lastupdateDate}</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>编辑者：</span>
                                        <span>{this.props.companyData && this.props.companyData.verifyUserName}</span>
                                    </p>
                                </Col>
                            </Row>
                        </div>
                        <div className={this.props.companyData && this.props.companyData.companyStatus === '3' ? '' : 'hidden'}>
                            <Row>
                                <Col span={8}>
                                    <p>
                                        <span>审核人：</span>
                                        <span>{this.props.companyData && this.props.companyData.verifyUserName}</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>审核时间：</span>
                                        <span>{this.props.companyData && this.props.companyData.lastupdateDate}</span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <p>
                                        <span>拒绝原因：</span>
                                        <span>{this.props.companyData && this.props.companyData.remark}</span>
                                    </p>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className={styles.tabPaneContent}>
                        <h3>提交人信息</h3>
                        <Row>
                            <Col span={8}>
                                <p>
                                    <span>姓名：</span>
                                    <span>{this.props.companyData && this.props.companyData.userName}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p>
                                    <span>身份证号：</span>
                                    <span>{this.props.companyData && this.props.companyData.userIdentity}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p>
                                    <span>手机号：</span>
                                    <span>{this.props.companyData && this.props.companyData.mobilePhone}</span>
                                </p>
                            </Col>
                        </Row>
                    </div>
                    <div className={styles.tabPaneContent}>
                        <h3>认证信息</h3>
                        <Row>
                            <Col span={8}>
                                <p>
                                    <span>企业名称：</span>
                                    <span>{this.props.companyData && this.props.companyData.companyName}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p>
                                    <span>统一社会信用代码：</span>
                                    <span>{this.props.companyData && this.props.companyData.creditNum}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p>
                                    <span>企业身份：</span>
                                    <span>{this.props.companyData && this.props.companyData.companyIdentityName}</span>
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <p>
                                    <span>企业地址：</span>
                                    <span>{this.props.companyData && this.props.companyData.address}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p>
                                    <span>企业注册资本：</span>
                                    <span>{this.props.companyData && this.props.companyData.registeredCapital} 万元</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p>
                                    <span>交易品种：</span>
                                    <span>{this.state.categoryNameList.map((item, index) => {
                                        return (
                                            <span key={item}>{item}<i className={index == this.state.categoryNameList.length - 1 ? 'hidden' : ''}>，</i></span>
                                        )
                                    })}</span>
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <p>营业执照：</p>
                            </Col>
                            <Col span={8}>
                                <p>认证授权书：</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <RcViewer>
                                    <img src={this.props.companyData && this.props.companyData.licensePicUrl} alt="" />
                                </RcViewer>
                            </Col>
                            <Col span={8}>
                                <RcViewer>
                                    <img src={this.props.companyData && this.props.companyData.authorizationFileUrl} alt="" />
                                </RcViewer>
                            </Col>
                        </Row>
                    </div>
                    <div className={styles.tabPaneContent}>
                        <h3>企业资料核查</h3>
                        <div className={this.props.companyData.detailByYJ === null ? 'hidden' : ''}>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>注册资本：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.RegistCapi}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>实缴资本：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>-</span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>经营状态：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.Status}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>成立日期：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.StartDate} </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>注册号：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.No}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>组织机构代码：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.OrgNo} </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>纳税人识别号：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.CreditCode}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>统一社会信用代码：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.CreditCode} </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>公司类型：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.EconKind}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>所属行业：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.Industry} </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>核准日期：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.CheckDate}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>登记机关：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.BelongOrg} </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>所属地区：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.Province}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>英文名：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.CompanyNameEg} </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>曾用名：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.OriginalName}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>经营方式：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.ScopeType} </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>人员规模：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.Employee}</span>
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        <span>企业期限：</span>
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.TeamEnd} </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>企业地址：</span>
                                    </p>
                                </Col>
                                <Col span={20}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.Address}</span>
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <p>
                                        <span>经营范围：</span>
                                    </p>
                                </Col>
                                <Col span={20}>
                                    <p>
                                        <span>{this.props.companyData.detailByYJ && this.props.companyData.detailByYJ.Scope} </span>
                                    </p>
                                </Col>
                            </Row>
                        </div>
                        <div className={this.props.companyData.detailByYJ === null ? '' : 'hidden'}>
                            <p>找不到名字匹配的企业</p>
                        </div>
                    </div>
                </Spin >
                <Modal
                    title={this.state.isPass==='Y'?'审核通过':'拒绝理由'}
                    forceRender={true}
                    afterClose={this.afterClose.bind(this)}
                    footer={null}
                    visible={this.state.visible}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                >
                    <FormItemEdit onRef={this.onRef} companyDetail={this.props.companyData} iProps={this.props} isPass={this.state.isPass} closeModel={this.closeModel.bind(this)} />
                </Modal>
            </div>
        )
    }
}

export default connect(({ category, loading }: ConnectState) => ({
    categoryTree: category.categoryTree,
    loading: loading.models.company,
}))(UserDetail);