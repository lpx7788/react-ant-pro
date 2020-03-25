import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Table, DatePicker,Button,Row,Col,Input,Select,Modal,message} from 'antd';

const { confirm } = Modal;
import AntdRadioGroup from '@/components/AntdRadioGroup';
import PaginationItem from '@/components/Pagination';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HandleButton from '@/components/HandleButton'
import { router } from 'umi';
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;

interface  AllinformationProps extends ConnectProps {
  loading: boolean;
  HomeDataList:Array<any>;
  informationList:any;
  sourseList:any;
  editorList:Array<any>;
}

interface AllinformationState {
  parameter: any
  groupTypeArr:  Array<object> 
  groupClassifyArr:  Array<object> 
  selectedRowKeys:  Array<any> 
  imformationTableTitle:  Array<any>,
  informationStatus:  Array<any>,
  loading:boolean,
  listDisplayStatus:Number,
  timeValue:any
}

class AllInformation extends React.Component< AllinformationProps, AllinformationState> {
  state: AllinformationState = {
    listDisplayStatus:1,
    groupTypeArr: [
      { value: '', textName: '全部', key: 0 },
      { value: '1', textName: '要闻', key: 1 },
      { value: '2', textName: '关注', key: 2 },
      { value: '3', textName: '快讯', key: 3 },
      { value: '4', textName: '精选', key: 4 },
    ],
    groupClassifyArr: [
      { value: '', textName: '全部', key: 0 },
      { value: '1', textName: '有色', key: 1 },
      { value: '2', textName: '黑色', key: 2 },
      { value: '3', textName: '化工', key: 3 },
      { value: '4', textName: '农产品', key: 4 },
      { value: '5', textName: '其他', key: 5},
    ],
    informationStatus: [
      { value: '1', name: '全部', key: 1 },
      { value: '2', name: '可见', key: 2 },
      { value: '3', name: '不可见', key: 3 },
    ],
    imformationTableTitle : [
      {
        key: '1',
        title: '资讯标题',
        dataIndex: 'title',
        align:'center'
      },
      {
        key: '2',
        title: '资讯来源',
        dataIndex: 'source',
        align:'center'
      },
      {
        key: '3',
        title: '资讯类型',
        dataIndex: 'typeName',
        align:'center'
      },
      {
        key: '4',
        title: '状态',
        dataIndex: 'displayName',
        align:'center'
      },
      {
        key: '5',
        title: '是否顶置',
        dataIndex: 'isTopName',
        align:'center'
      },
      {
        key: '6',
        title: '创建时间',
        dataIndex: 'createDate',
        align:'center'
      },
      {
        key: '7',
        title: '更新时间',
        dataIndex: 'createDate',
        align:'center'
      },
      {
        key: '8',
        title: '编辑者',
        dataIndex: 'createUserName',
        align:'center'
      },
      {
        title: '操作',
        key: '9',
        align:'center',
        render: (row:any) =>   
      
        <div className="handle_btn">

         <span className={`m5 ${row.display==false?'block':'hidden'}`}>
            <HandleButton icon="eye"  title="显示资讯" handleClick={this.handleListDisplay.bind(this,row,row.display)} />
          </span>

          <span className={`m5 ${row.display==true?'block':'hidden'}`}>
            <HandleButton icon="eye-invisible"  title="隐藏资讯" handleClick={this.handleListDisplay.bind(this,row,row.display)} />
          </span>

          <span className="m5">
            <HandleButton icon="edit"  title="编辑" handleClick={this.handleEdit.bind(this,row)} />
          </span>

          <span className="m5">
            <HandleButton icon="vertical-align-top"  title="置顶" handleClick={this.handleListToTop.bind(this, row)} />
          </span>

          <span className="m5">
            <HandleButton icon="delete"  title="删除" handleClick={this.handleListToTop.bind(this, row)} />
          </span>

       </div>
      }
    ],
    
    parameter: {
      source: '',
      status:'',
      editor:'',
      consultationType:'',
      category:'',
      queryKey:'',
      createDateStart: '',
      createDateEnd: ''
    },
    selectedRowKeys: [],
    loading: false,
    timeValue:''
  };
  
  UNSAFE_componentWillMount() {
    this.getInformationList()
    this.getInitialDatasList()
  }

  // 删除
  handleDelete(row:any){
    let self = this;
    confirm({
      title: '温馨提示',
      content: '确定删除该资讯？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        self.deleteRequest(row)
      },
    });
  }

  deleteRequest(row:any){
    let {dispatch} = this.props
    if (dispatch) {
      dispatch({
        type: 'information/deleteInformationRequest',
        payload: {id:row.id},
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            message.success('操作成功');
            this.getInformationList()
          }
        },
      })
    }
  }

  // 置顶
  handleListToTop(row:any){
    let {dispatch} = this.props
    if (dispatch) {
      dispatch({
        type: 'information/informationListToTopRequest',
        payload: {
          category:row.category,
          id: row.id,
          topped: "1",
          type:  row.type
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {;
            message.success('操作成功');
            this.getInformationList()
          }
        },
      })
    }
  }

  // 显示或者隐藏

  handleListDisplay(row:any,status:boolean){
    let display:string;
    let content:string;
   
    if(status===false){
      display = '1',
      content = '确定显示该资讯?'
    }else{
      display = '0',
      content = '确定要隐藏该资讯？'
    }
    
    let self = this;
    confirm({
      title: '温馨提示',
      content: content,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        self.listDisplayRequset(row,display)
      },
    });
  
  }

  listDisplayRequset(row:any,display:any){
    let {dispatch} = this.props
    if (dispatch) {
      dispatch({
        type: 'information/informationListDisplayRequest',
        payload: {
          id: row.id,
          display: display
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {;
            message.success('操作成功');
            this.getInformationList()
          }
        },
      })
    }
  }

  // 跳转编辑页面
  handleEdit(row:any){
    router.push({
      pathname:'/information/release-information',
      state:{editDatas:row}
    })
  }
  
  // 初始化页面数据
  getInitialDatasList(){
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'information/getEditorListRequest',
      })
    }
    if (dispatch) {
      dispatch({
        type: 'information/getSourseListRequest',
      })
    }
  }

  // 获取页面资讯列表
  getInformationList() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'information/getInformationListRequest',
        payload: this.state.parameter
      })
    }
  }

  //获取时间戳
  handleRangePicker(date: object, dateStrings: [string, string]) {
    let parameter = this.state.parameter
    parameter['createDateStart'] =new Date(dateStrings[0]).getTime()
    parameter['createDateEnd'] =new Date(dateStrings[1]).getTime()
    this.setState({
      parameter: parameter
    });
    this.getInformationList();
  }

  // 刷新
  handleRefresh(){
    let parameter = this.state.parameter
    parameter['createDateStart'] =''
    parameter['createDateEnd'] =''
    parameter['consultationType'] ='0'
    parameter['category'] ='0'
    parameter['queryKey'] =''
    parameter['source'] =''
    parameter['status'] =''
    parameter['editor'] =''
    this.refs.search.input.state.value=''
    this.setState({
        timeValue:new Date(),
        parameter: parameter
      }
    ) 
    this.getInformationList()
  }  
 
  // 获取资讯来源
  onSourseChange(value:any){
    this.haddelParmas(value,'source')
  }

  // 获取资讯状态
  onStatusChange(value:any){
    this.haddelParmas(value,'status')
  }

  // 获取编辑者
  onEditorChange(value:any){
    this.haddelParmas(value,'editor')
  }
  
  // 操作按钮组
  handleBtnGroup = (value: string, dataName: string) => {
    this.haddelParmas(value,dataName)
  };

  // 操作请求参数
  haddelParmas(value: string, dataName: string){
    let parameter = this.state.parameter;
    parameter[dataName] = value;
    this.setState({
      parameter: parameter,
    });
    this.getInformationList()
  }
  // 搜索
  handleSearch(value:any){
    this.haddelParmas(value,'queryKey')
  }

  child: any = {}
  onRef = (ref: any) => {  
    this.child = ref
  }

  render() {
  //  console.log('informationList====',this.props.informationList)
  //  console.log('editorList====',this.props.editorList)
  //  console.log('sourseList====',this.props.sourseList)
    return (
      <PageHeaderWrapper> 
        <div className={styles.allImformationPage}>
          <header className="pageHeader">
          <Row className={ ` ${styles.input}`}>
            <Col span={5}>
              <span>资讯来源：</span> 
              <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择"
                  value={this.state.parameter.source?this.state.parameter.source:'请选择'}
                  onChange={this.onSourseChange.bind(this)}
                  optionFilterProp="children">
                  {this.props.sourseList ?
                      this.props.sourseList.map((item:any,index:number) => (
                        <Option key={item||index} value={item}>{item}</Option>
                      )) : ''}
                </Select>
            </Col>
            <Col span={5}>
              <span>资讯状态：</span> 
              <Select
                  onChange={this.onStatusChange.bind(this)}
                  showSearch
                  value={this.state.parameter.status?this.state.parameter.status:'请选择'}
                  style={{ width: 200 }}
                  placeholder="请选择"
                  optionFilterProp="children">
                  {this.state.informationStatus ?
                      this.state.informationStatus.map(item => (
                        <Option key={item.key} value={item.name}>{item.name}</Option>
                      )) : ''}
                </Select>
            </Col>
            <Col span={5}>
              <span>编辑者：</span> 
              <Select
                  showSearch
                  value={this.state.parameter.editor?this.state.parameter.edito:"请选择"}
                  onChange={this.onEditorChange.bind(this)}
                  style={{ width: 200 }}
                  placeholder="请选择"
                  optionFilterProp="children">
                  {this.props.editorList?
                      this.props.editorList.map((item:any,index:Number)=> (
                      <Option key={item||index} value={item}>{item}</Option>
                      )) : ''}
                </Select>
            </Col>
          </Row>
          <div className={`mT20`}> <span>资讯类型：</span> <AntdRadioGroup value={this.state.parameter.consultationType} groupArr={this.state.groupTypeArr} change={(e: any) => {this.handleBtnGroup(e, "consultationType")}}   /></div>
          <div className={`mT20`}> <span>所属分类：</span> <AntdRadioGroup  value={this.state.parameter.category} groupArr={this.state.groupClassifyArr}  change={(e: any) => {this.handleBtnGroup(e, "category")}} /></div>

          <div className={`mT20`}>
            <RangePicker key = {this.state.timeValue} className={` ${styles.allImformationContent}`}  onChange={this.handleRangePicker.bind(this)} placeholder={['开始日期', '结束日期']} />
            <Search className={`mL20 ${styles.search}`} ref='search'  placeholder="请输入标题关键词" onSearch={value => this.handleSearch(value)}  enterButton />
            <Button type="primary" className={`mL20`}  icon="sync" onClick={this.handleRefresh.bind(this)}>刷新</Button>
          </div>  
          </header>
          <div className="pageContent">
            <div className={`mT20 border ${styles.contentItem}`}>
              <Table<any> loading={this.props.loading} size="middle" rowKey={record => record.id}  columns={this.state.imformationTableTitle} dataSource={this.props.informationList.list} pagination={false}/>
             <div className="m10">
                <PaginationItem ref={this.onRef} total={this.props.informationList.total} changePage={this.getInformationList.bind(this)} />
             </div>
            </div>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ information, loading }: ConnectState) => ({
  informationList: information.informationList,
  editorList: information.editorList,
  sourseList: information.sourseList,
  loading: loading.models.information,
}))(AllInformation);
