import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment'
import { Table, Button, Tooltip, Modal, Form, Input,DatePicker } from 'antd'
import PaginationItem from '@/components/Pagination';
import AntdRadioGroup from '@/components/AntdRadioGroup';
import CategoryCascader from '@/components/CategoryCascader';
import HandleButton from '@/components/HandleButton'

const { confirm } = Modal;

interface Props extends ConnectProps {
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
        // categoryCode: '',
        categoryName: '',
        closingDate: null,
    }

    okHandle(e: Event) {
        e.preventDefault()
        const { dispatch } = this.props.props;
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                if (dispatch) {
                    let params ={
                        categoryCode: values.categoryCode[1],
                        categoryName: this.state.categoryName,
                        brand: values.brand,
                        material: values.material,
                        spec: values.spec,
                        wareHouse: values.wareHouse,
                        guidePrice: values.guidePrice,
                        closingDate: Date.parse(values.closingDate),
                    }
                    if(this.props.formType==='2') params.id = this.props.data.id
                    dispatch({
                        type: 'integral/addGuidePrice',
                        payload: params,
                        callback: (res:any)=>{
                            if(res.errorCode==='0000'){
                                this.setState({
                                    visible: false
                                })
                                this.props.parent.queryGuidePriceList()
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
            let data = this.props.data
            this.props.form.setFieldsValue({
                categoryCode: data.categoryCode,
                brand: data.brand,
                material: data.material,
                spec: data.spec,
                wareHouse: data.wareHouse,
                guidePrice: data.guidePrice,
                closingDate: moment(data.closingDate),
            })
            this.setState({
                categoryName: data.categoryName,
            })
        }
    }
    dateOnChange(date, dateString){
        this.setState({
            closingDate: Date.parse(date)
        })
    }
    categoryChange(codes,name){
        this.setState({
            // categoryCode: codes[1],
            categoryName: name,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        // let self = this
        return (
            <div className={styles.HandleForm}>
                {/* <Tooltip title={this.props.title}  mouseEnterDelay={1}>
                    <Button type={this.props.btnType} shape={this.props.btnShape} icon={this.props.btnIcon} onClick={this.showModal.bind(this)}>{this.props.btnText}</Button>
                </Tooltip> */}
                <HandleButton icon={this.props.btnIcon} shapes={this.props.btnShape} text={this.props.btnText} title={this.props.title} handleClick={this.showModal.bind(this)} />
                <Modal
                    title={this.props.title}
                    visible={this.state.visible}
                    confirmLoading={this.props.props.loading}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.okHandle.bind(this)}
                    onCancel={() => { this.setState({ visible: false }) }}
                > 
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                        <Form.Item label="商品编号" className={this.props.formType==='2'?'':'hidden'}>
                            <span>{this.props.data&&this.props.data.guidePriceId}</span>
                        </Form.Item>
                        <Form.Item label="商品品种">
                            {getFieldDecorator('categoryCode', {
                                rules: [{ required: true, message: ' ' }],
                            })(
                                <CategoryCascader values={this.props.data&&this.props.data.categoryCode} onChange={this.categoryChange.bind(this)}/>
                            )}
                        </Form.Item>
                        <Form.Item label="品牌">
                            {getFieldDecorator('brand', {})(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="规格">
                            {getFieldDecorator('spec', {})(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="材质">
                            {getFieldDecorator('material', {})(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="仓库">
                            {getFieldDecorator('wareHouse', {})(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="指导价">
                            {getFieldDecorator('guidePrice', {
                                rules: [{ required: true, message: ' ' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="有效截止日期">
                            {getFieldDecorator('closingDate', {
                                rules: [{ required: true, message: ' ' }],
                            })(
                                <DatePicker style={{width:'100%'}} onChange={this.dateOnChange.bind(this)} />
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
                title: '指导价编号',
                dataIndex: 'guidePriceId',
                key: 'guidePriceId',
                align: 'center',
            },
            {
                title: '商品品种',
                dataIndex: 'categoryName',
                key: 'categoryName',
                align: 'center',
            },
            {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand',
                align: 'center',
            },
            {
                title: '规格',
                dataIndex: 'spec',
                key: 'spec',
                align: 'center',
            },
            {
                title: '材质',
                dataIndex: 'material',
                key: 'material',
                align: 'center',
            },
            {
                title: '仓库',
                dataIndex: 'wareHouse',
                key: 'wareHouse',
                align: 'center',
            },
            {
                title: '指导价',
                dataIndex: 'guidePrice',
                key: 'guidePrice',
                align: 'center',
            },
            {
                title: '状态',
                key: 'status',
                render: (row: any) => {
                    return <div>{row.status===0?'已停用':'生效中'}</div>
                },
                align: 'center',
            },
            {
                title: '有效截止日期',
                key: 'closingDate',
                render: (row: any) => moment(row.closingDate).format('YYYY-MM-DD'),
                align: 'center',
            },
            {
                title: '操作',
                width: '120px',
                key: 'handle',
                render: (row: any) => {
                    return <div className={styles.handleBtn}>
                        <HandleForm props={this.props} formType="2" title="编辑" btnIcon="edit" btnType="primary" btnShape="circle" data={row} parent={this}></HandleForm>
                        {/* <Tooltip title={row.status===0?'启用':'停用'} mouseEnterDelay={1}>
                            <Button icon={row.status===0?'unlock':'lock'} type="danger" shape="circle" onClick={this.disableSet.bind(this, row)}></Button>
                        </Tooltip> */}
                        <HandleButton icon={row.status===0?'unlock':'lock'} title={row.status===0?'启用':'停用'} handleClick={this.disableSet.bind(this, row)} />
                    </div>
                },
                align: 'center',
            },
        ],
        status: '',
        groupArr: [
            { value: '', textName: '全部', key: 1 },
            { value: '1', textName: '生效中', key: 2 },
            { value: '0', textName: '已停用', key: 3 },
        ],
    }

    componentWillMount() {
        this.queryGuidePriceList()
    }

    queryGuidePriceList(pageNum?: number, pageSize?: number) {
        if (this.props.dispatch) {
            this.props.dispatch({
                type: 'integral/queryGuidePriceList',
                payload: {
                    pageNum: pageNum ? pageNum : 1,
                    pageSize: pageSize ? pageSize : 20,
                    status: this.state.status
                }
            })
        }
    }
    disableSet(row: any) {
        let self = this
        confirm({
            title: '温馨提示',
            content: `此操作将${row.status===0?'启用':'停止'}该指导价, 是否继续?`,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                return new Promise((resolve, reject) => {
                    if (self.props.dispatch) {
                        self.props.dispatch({
                            type: 'integral/stopGuidePriceList',
                            payload: {
                                id: row.id,
                                status: row.status===0?'1':'0'
                            },
                            callback: (res: any) => {
                                if (res.errorCode === '0000') {
                                    resolve();
                                    self.queryGuidePriceList();
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
    tabsChange(idx: any){
        this.setState({
            status: idx
        },function(){
            this.queryGuidePriceList()
        })
    }

    render() {
        
        return (
            <PageHeaderWrapper>
                <div className={styles.guidePriceSet}>
                    <div className="flex-between">
                        <AntdRadioGroup
                        value={this.state.status}
                        groupArr={this.state.groupArr}
                        change={this.tabsChange.bind(this)}
                        />
                        <HandleForm props={this.props} formType="1" btnShape="square" title="新增" btnType="primary" btnIcon="plus-circle" btnText="新增" parent={this}></HandleForm>
                    </div>
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
                    <PaginationItem total={this.props.tableData && this.props.tableData.total} changePage={this.queryGuidePriceList.bind(this)} />
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading, integral }: ConnectState) => ({
    tableData: integral.guidePriceList,
    loading: loading.models.integral,
}))(GuidePriceSet);
