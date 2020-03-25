import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment'
import { Table, Button, Tooltip, Modal, Form, Input } from 'antd'
import PaginationItem from '@/components/Pagination';
import UploadImg from '@/components/UploadImg'
import HandleButton from '@/components/HandleButton'

const { confirm } = Modal;

interface Props extends ConnectProps {
    exchangeSetList: Array<any>
    tableData: Array<any>
}

interface FormProps extends ConnectProps{
    form: any
    data: object
    btnType: string
    btnShape: string
    btnIcon: string
    btnText: string
    formType: string
    title: string
    props: any
    parent: any
}
class Forms extends React.Component<FormProps> {
    state = {
        visible: false,
        title: '',
        commodityPhotoFile: null
    }

    okHandle(e: Event) {
        e.preventDefault()
        const { dispatch } = this.props.props;
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                if (dispatch) {
                    let formData = new FormData();
                    formData.append('commodityName',values.commodityName)
                    formData.append('cashingIntegral',values.cashingIntegral)
                    formData.append('stockNum',values.stockNum)
                    if(this.props.formType==='1'){
                        formData.append('commodityPhoto',this.state.commodityPhotoFile)
                    }else{
                        formData.append('saveStockNum',values.addStockNum?values.addStockNum:0)
                        formData.append('Pid',this.props.data.id)
                        if(this.state.commodityPhotoFile) formData.append('commodityPhoto',this.state.commodityPhotoFile)
                    }
                    dispatch({
                        type: 'integral/joinCashingCommodity',
                        payload: formData,
                        callback: (res:any)=>{
                            if(res.errorCode==='0000'){
                                this.setState({
                                    visible: false
                                })
                                this.props.parent.queryCashingCommodityList()
                            }
                        }
                    })
                }
            }
        })
    }
    showModal(){
        this.setState({ 
            visible: true,
            commodityPhotoFile: null
        })
        if(this.props.data){
            this.props.form.setFieldsValue({
                commodityName: this.props.data.commodityName,
                stockNum: this.props.data.stockNum,
                remainingStock: this.props.data.remainingStock,
                cashingIntegral: this.props.data.cashingIntegral,
            })
        }
    }
    getImgFile(data: Array){
        this.setState({
            commodityPhotoFile: data[0]
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        let self = this
        return (
            <div className={styles.HandleForm}>
                {/* <Button type={this.props.btnType} shape={this.props.btnShape} icon={this.props.btnIcon} onClick={this.showModal.bind(this)}>{this.props.btnText}</Button> */}
                <HandleButton icon={this.props.btnIcon} shapes={this.props.btnShape} title={this.props.title} handleClick={this.showModal.bind(this)} />
                <Modal
                    title={this.props.title}
                    // forceRender={true}
                    visible={this.state.visible}
                    confirmLoading={this.props.props.loading}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.okHandle.bind(this)}
                    onCancel={() => { this.setState({ visible: false }) }}
                > 
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                        <Form.Item label="商品编号" className={this.props.formType==='2'?'':'hidden'}>
                            <span>{this.props.data&&this.props.data.commodityCode}</span>
                        </Form.Item>
                        <Form.Item label="商品名称">
                            {getFieldDecorator('commodityName', {
                                rules: [{ required: true, message: ' ' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="商品图片">
                            {getFieldDecorator('commodityPhoto', {
                                rules: [{ 
                                validator: function(rule:any, value:any, callback:any){
                                    if(self.props.formType==='2') return callback()
                                    if(value||self.state.commodityPhotoFile!==null){
                                        callback()
                                    }else{
                                        callback('请上传商品图片')
                                    }
                                } }],
                            })(
                                <div>
                                    <UploadImg initPicUrl={this.props.data&&this.props.data.commodityPhoto} adaption card btnType="primary" btnIcon="upload" handleChange={this.getImgFile.bind(this)}></UploadImg>
                                </div>
                            )}
                        </Form.Item>
                        <Form.Item label="总库存">
                            {getFieldDecorator('stockNum', {
                                rules: [{ required: true, message: ' ' }],
                            })(
                                <Input disabled={this.props.formType==='2'}/>
                            )}
                        </Form.Item>
                        <Form.Item label="剩余库存" className={this.props.formType==='2'?'':'hidden'}>
                            {getFieldDecorator('remainingStock', {})(
                                <Input disabled={this.props.formType==='2'}/>
                            )}
                        </Form.Item>
                        <Form.Item label="增加库存" className={this.props.formType==='2'?'':'hidden'}>
                            {getFieldDecorator('addStockNum', {})(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="兑换积分">
                            {getFieldDecorator('cashingIntegral', {
                                rules: [{ required: true, message: ' ' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const HandleForm = Form.create()(Forms)

class ExchangeSet extends React.Component<Props> {
    state = {
        tableTitle: [
            {
                title: '商品编号',
                dataIndex: 'commodityCode',
                key: 'commodityCode',
                align: 'center',
            },
            {
                title: '商品名称',
                dataIndex: 'commodityName',
                key: 'commodityName',
                align: 'center',
            },
            {
                title: '兑换积分',
                dataIndex: 'cashingIntegral',
                key: 'cashingIntegral',
                align: 'center',
            },
            {
                title: '总库存',
                dataIndex: 'stockNum',
                key: 'stockNum',
                align: 'center',
            },
            {
                title: '剩余库存',
                dataIndex: 'remainingStock',
                key: 'remainingStock',
                align: 'center',
            },
            {
                title: '创建时间',
                // dataIndex: 'createDate',
                key: 'createDate',
                render: (row: any) => moment(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
                align: 'center',
            },
            {
                title: '最后修改时间',
                // dataIndex: 'lastupdateDate',
                key: 'lastupdateDate',
                render: (row: any) => moment(row.lastupdateDate).format('YYYY-MM-DD HH:mm:ss'),
                align: 'center',
            },
            {
                title: '修改人',
                dataIndex: 'lastupdateName',
                key: 'lastupdateName',
                align: 'center',
            },
            {
                title: '操作',
                width: '120px',
                key: 'handle',
                render: (row: any) => {
                    return <div className={styles.handleBtn}>
                        <HandleForm props={this.props} formType="2" title="编辑" btnIcon="edit" btnType="primary" btnShape="circle" data={row} parent={this}></HandleForm>
                        <HandleButton icon="delete" title="删除" handleClick={this.deleteSet.bind(this, row)} />
                    </div>
                },
                align: 'center',
            },
        ],
    }

    componentWillMount() {
        this.queryCashingCommodityList()
    }

    queryCashingCommodityList(pageNum?: number, pageSize?: number) {
        if (this.props.dispatch) {
            this.props.dispatch({
                type: 'integral/queryCashingCommodityList',
                payload: {
                    pageNum: pageNum ? pageNum : 1,
                    pageSize: pageSize ? pageSize : 20,
                }
            })
        }
    }
    addSet() {

    }
    deleteSet(row: any) {
        let self = this
        confirm({
            title: '温馨提示',
            content: '是否删除该兑换设置?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                return new Promise((resolve, reject) => {
                    if (self.props.dispatch) {
                        self.props.dispatch({
                            type: 'integral/deleteCashingCommodity',
                            payload: {
                                id: row.id,
                            },
                            callback: (res: any) => {
                                if (res.errorCode === '0000') {
                                    resolve();
                                    self.queryCashingCommodityList();
                                } else {
                                    reject();
                                }
                            },
                        });
                    }
                })
            },
            onCancel() { },
        });
    }

    render() {
        
        return (
            <PageHeaderWrapper>
                <div className={styles.exchangeSet}>
                    <HandleForm props={this.props} formType="1" title="新增 " btnShape=" " btnType="primary" btnIcon="plus-circle" btnText="新增" parent={this}></HandleForm>
                    <p></p>
                    <Table
                        loading={this.props.loading}
                        size="middle"
                        rowKey={row => row.id}
                        bordered
                        dataSource={this.props.tableData && this.props.tableData.list}
                        columns={this.state.tableTitle}
                        pagination={false}
                    />
                    <PaginationItem total={this.props.tableData && this.props.tableData.total} changePage={this.queryCashingCommodityList.bind(this)} />
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading, integral }: ConnectState) => ({
    tableData: integral.exchangeSetList,
    loading: loading.models.integral,
}))(ExchangeSet);
