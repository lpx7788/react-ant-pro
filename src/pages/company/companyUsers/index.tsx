import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Table, Button, Input, message,Tooltip } from 'antd';
import AntdRadioGroup from '@/components/AntdRadioGroup';
import PaginationItem from '@/components/Pagination';
import HandleButton from '@/components/HandleButton';
import apiM from '@/services/apiManager'
import env from '@/../config/env'
import { router } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
const { Search } = Input;

interface CompanyProps extends ConnectProps {
    loading: boolean;
    companyUsers: {
        list: any,
        total: number
    };
}

interface CompanyState {
    parameter: any
    tableListTitle: any
    totalPage: number
    tableListLoading: boolean
    dataList: Array<Object>
    groupArr: Array<Object>
    exportDataUrl: string
}

class CompanyUsers extends React.Component<CompanyProps, CompanyState> {
    state: CompanyState = {
        totalPage: 0, //总页数
        parameter: {
            userCompanyStatus: '',
            // pageNum: 1,
            // pageSize: 20,
            queryKey: '',
        },
        // table数据
        dataList: [],
        //table标题
        tableListTitle: [
            {
                title: '用户编号', dataIndex: 'userId',
                render: this.tableRender.bind(this), align: 'center'
            },
            {
                title: '真实姓名', dataIndex: 'userName',
                render: this.tableRender.bind(this), align: 'center'
            },
            {
                title: '手机号码', dataIndex: 'userPhone',
                render: this.tableRender.bind(this), align: 'center'
            },
            { title: '所属公司', dataIndex: 'companyName', align: 'center' },
            { title: '用户身份', dataIndex: 'roleName', align: 'center' },
            { title: '有效期', dataIndex: 'validityDate', align: 'center' },
            { title: '企业认证状态', dataIndex: 'userCompanyStatusName', align: 'center' },
            { title: '上次登录时间', dataIndex: 'lastLoginDate', align: 'center' },
            {
                title: '操作',
                width: 100,
                render: (value: any, row: any, index: number) => {
                    const obj = {
                        children: <HandleButton icon="eye" title="查看" handleClick={this.goToCompanyDetail.bind(this, row)}/>,
                        props: {
                            rowSpan: {}
                        },
                    };
                    let arr = this.objectSpanMethod()
                    obj.props.rowSpan = arr[index]
                    return obj;
                }, align: 'center',
            },
        ],
        tableListLoading: false,
        groupArr: [
            { value: '', textName: '全部', key: 1 },
            { value: '1', textName: '待审核', key: 2 },
            { value: '2', textName: '正常', key: 3 },
            { value: '3', textName: '已拒绝', key: 4 },
        ],
        exportDataUrl: '',
    };

    UNSAFE_componentWillMount() {
        this.getPageDatas()
    }

    componentDidMount() {
        // 初始化导出url
        this.setState({
            exportDataUrl: env[process.env.API_ENV ? process.env.API_ENV : 'dev'].apiHostName + apiM.users_exportData + '?userCompanyStatus=0'
        })
    }

    tableRender(value: any, row: any, index: number) {
        const obj = {
            children: value,
            props: {
                rowSpan: {}
            },
        };
        let arr = this.objectSpanMethod()
        obj.props.rowSpan = arr[index]
        return obj;
    }

    objectSpanMethod() { //合并行数据
        let valueLength = 1
        const arr = []
        let data = this.props.companyUsers.list
        for (var i = data.length - 1; i >= 0; i--) {
            if (i === 0) {
                arr[i] = valueLength
            } else {
                if (data[i].userId === data[i - 1].userId) {
                    arr[i] = 0
                    valueLength++
                } else {
                    arr[i] = valueLength
                    valueLength = 1
                }
            }
        }
        return arr;
    }

    tabsChange(key: any) { //切换tabs
        this.child.reset()
        let parameter = this.state.parameter
        parameter.userCompanyStatus = key
        this.setState({
            parameter: parameter
        })
        this.getPageDatas()
        if (key === '') key = '0'
        // 修改导出url
        this.setState({
            exportDataUrl: env['dev'].apiHostName + apiM.users_exportData + '?userCompanyStatus=' + key
        })
    }

    getPageDatas(pageNum?: number, pageSize?: number) {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'company/companyUserQuery',
                payload: {
                    userCompanyStatus: this.state.parameter.userCompanyStatus,
                    pageNum: pageNum ? pageNum : 1,
                    pageSize: pageSize ? pageSize : 20,
                    queryKey: this.state.parameter.queryKey,
                }
            })
        }
    }

    goToCompanyDetail(row: any) { //跳转企业详情
        router.push({ pathname: '/company/companyList/companyDetail', state: { userCode: row.userCode } })
    }

    //setState参数值
    handleParameter(value: any, dataName: any) {
        let parameter = this.state.parameter;
        // if (Array.isArray(value)) {
        //     value.forEach((item, index) => {
        //         parameter[dataName[index]] = item
        //     })
        // } else {
        if (typeof (value)) parameter[dataName] = value;
        // }
        this.setState({
            parameter: parameter,
        });
        this.getPageDatas();
    }
    exportData() { //导出数据
        message.loading('数据导出中')
    }
    //搜索
    handleSearch(val: string) {
        this.handleParameter(val, 'queryKey');
    }

    child: any = {}
    onRef = (ref: any) => { //父组件给子组件传入一个onRef方法过去。接受子组件反馈的参数ref,把接受到的值赋予给，this.child这时就可以调用子组件的一个方法叫reset()方法。
        this.child = ref
    }

    render() {

        return (
            <PageHeaderWrapper>
                <div className={styles.companyUsers}>
                    <header>
                        <div className="fl">
                            <AntdRadioGroup value={this.state.parameter.userCompanyStatus} groupArr={this.state.groupArr} change={this.tabsChange.bind(this)} />
                        </div>
                        <div className={`fl ${styles.search}`}>
                            <Search placeholder="请输入企业名称/简称/用户手机号码/姓名" onSearch={(value: any) => this.handleSearch(value)} enterButton />
                        </div>
                        <div className="fl">
                            <Button type="primary" icon="cloud-download" href={this.state.exportDataUrl} onClick={this.exportData.bind(this)}>导出</Button>
                        </div>
                    </header>
                    <Table
                        className='mT20'
                        loading={this.props.loading}
                        size="middle"
                        rowKey={(row: any, index: any) => index}
                        bordered
                        columns={this.state.tableListTitle}
                        dataSource={this.props.companyUsers.list}
                        pagination={false}
                    />
                    <PaginationItem ref={this.onRef} total={this.props.companyUsers.total} changePage={this.getPageDatas.bind(this)} />
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ company, loading }: ConnectState) => ({
    companyUsers: company.companyUsers,
    loading: loading.models.company,
}))(CompanyUsers);
