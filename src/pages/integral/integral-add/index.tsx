import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment'
import { Table, Button, Modal, Form, Input,DatePicker,Select } from 'antd'
import PaginationItem from '@/components/Pagination';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface Props extends ConnectProps {
    tableData: Array<any>
}

interface FormProps extends ConnectProps{
    props: any
    parent: any
}

class Forms extends React.Component<FormProps> {
    state = {
        visible: false,
        userIntegralData: {},
        customerOrderCode: '',
    }

    okHandle(e: Event) {
        e.preventDefault()
        const { dispatch } = this.props.props;
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                if (dispatch) {
                    dispatch({
                        type: 'integral/addUserIntegral',
                        payload: {
                            customerOrderCode: this.state.customerOrderCode,
                            integralNum: values.integralNum,
                            orderCode: values.orderCode,
                            phone: values.phone,
                            remark: values.remark,
                            type: values.type,
                            userCode: this.state.userIntegralData.userCode
                        },
                        callback: (res:any)=>{
                            if(res.errorCode==='0000'){
                                this.setState({
                                    visible: false
                                })
                                this.props.parent.queryIntegralAddRecordList()
                            }
                        }
                    })
                }
            }
        })
    }
    showModal(){
        this.setState({ 
            visible: true
        })
    }
    queryUserIntegral(val:any){
        const { dispatch } = this.props.props;
        if (dispatch) {
            dispatch({
                type: 'integral/queryUserIntegral',
                payload: {
                    phone: val
                },
                callback: (res:any)=>{
                    if(res.errorCode==='0000'){
                        this.setState({
                            userIntegralData: res.returnObject  
                        })
                    }
                }
            })
        }
    }
    selectChange(val,option){
        this.setState({
            customerOrderCode: option.props.children
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        let self = this
        return (
            <div className={styles.HandleForm}>
                <Button type="primary" icon="plus-circle" onClick={this.showModal.bind(this)}>新增</Button>
                <Modal
                    title="添加积分"
                    visible={this.state.visible}
                    confirmLoading={this.props.props.loading}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.okHandle.bind(this)}
                    onCancel={() => { this.setState({ visible: false }) }}
                > 
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                        <Form.Item label="用户手机号码" >
                            {getFieldDecorator('phone', {
                                rules: [{
                                    required: true,
                                    validator: function(rule:any, value:any, callback:any){
                                        let phoneRe = /^1[3456789]\d{9}$/
                                        if (phoneRe.test(value)) {
                                            self.queryUserIntegral(value)
                                            callback()
                                        }else{
                                            callback('请输入正确的手机号码')
                                        }
                                    }
                                }]
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="用户剩余积分">
                            <div>{this.state.userIntegralData.availableIntegral}</div>
                        </Form.Item>
                        <Form.Item label="增加积分">
                            {getFieldDecorator('integralNum', {
                                rules: [{ required: true, message: '' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="类型">
                            {getFieldDecorator('type', {
                                initialValue: '1'
                            })(
                                <Select >
                                    <Option value="1">交易赠送</Option>
                                    <Option value="2">系统退还</Option>
                                    <Option value="3">其他赠送</Option>
                                    <Option value="4">系统扣除</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="相关订单号">
                            {getFieldDecorator('orderCode', {
                                rules: [{ required: true, message: '' }],
                            })(
                                <Select onChange={this.selectChange.bind(this)}>
                                    {this.state.userIntegralData.relevanceOrderList&&this.state.userIntegralData.relevanceOrderList.map((item:any,index:any) => (
                                        <Option value={item.orderCode} key={index}>{item.customerOrderCode}</Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('remark', {
                                rules: [{ required: true, message: '' }],
                            })(
                                <TextArea rows={2} />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const HandleForm = Form.create()(Forms)

class GuidePriceSet extends React.Component<Props> {
    state = {
        tableTitle: [
            {
                title: '用户手机号码',
                dataIndex: 'userPhone',
                key: 'userPhone',
                align: 'center',
            },
            {
                title: '增加积分',
                dataIndex: 'integralNum',
                key: 'integralNum',
                align: 'center',
            },
            {
                title: '类型',
                // dataIndex: 'type',
                key: 'type',
                render: (row:any)=>{
                    return (
                        <div>{row.type===1?'交易赠送':(row.type===2?'系统退还':(row.type===3?'其他赠送':'系统扣除'))}</div>
                    )
                },
                align: 'center',
            },
            {
                title: '相关订单号',
                dataIndex: 'customerOrderCode',
                key: 'customerOrderCode',
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                align: 'center',
            },
            {
                title: '创建时间',
                // dataIndex: 'guidePrice',
                render: (row:any)=> moment(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
                key: 'guidePrice',
                align: 'center',
            },
            {
                title: '创建者',
                dataIndex: "createName",
                key: 'createName',
                align: 'center',
            }
        ],
        searchKey: '',
    }

    componentWillMount() {
        this.queryIntegralAddRecordList()
    }

    queryIntegralAddRecordList(pageNum?: number, pageSize?: number) {
        if (this.props.dispatch) {
            this.props.dispatch({
                type: 'integral/queryIntegralAddRecordList',
                payload: {
                    pageNum: pageNum ? pageNum : 1,
                    pageSize: pageSize ? pageSize : 20,
                    condition: this.state.searchKey
                }
            })
        }
    }
    searchChange(e:any){
        let self = this
        this.setState({
            searchKey: e.target.value
        },function(){
            if(self.state.searchKey===""){
                self.queryIntegralAddRecordList()
            }
        })
    }
    searchQuery(){
        this.queryIntegralAddRecordList()
    }

    render() {
        
        return (
            <PageHeaderWrapper>
                <div className={styles.integralAddRecord}>
                    <div>
                        <Search style={{ width: '300px',marginRight: '20px'}} onChange={this.searchChange.bind(this)} onSearch={this.searchQuery.bind(this)} placeholder="输入积分订单号、手机号搜索" enterButton/>
                        <HandleForm props={this.props} btnType="primary" btnIcon="plus-circle" btnText="新增" parent={this}></HandleForm>
                    </div>
                    <Table
                        className="mT20"
                        loading={this.props.loading}
                        size="middle"
                        rowKey={row => row.id}
                        bordered
                        dataSource={this.props.tableData && this.props.tableData.list}
                        columns={this.state.tableTitle}
                        pagination={false}
                    />
                    <PaginationItem total={this.props.tableData && this.props.tableData.total} changePage={this.queryIntegralAddRecordList.bind(this)} />
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading, integral }: ConnectState) => ({
    tableData: integral.integralAddRecordList,
    loading: loading.models.integral,
}))(GuidePriceSet);
