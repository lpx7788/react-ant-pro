import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Button,Table,message ,Popconfirm,Tooltip,Icon} from 'antd';
import CarouselAdd from './components/CarouselAdd'
import HandleButton from '@/components/HandleButton'

interface CarouselProps extends ConnectProps {
  loading: boolean;
  carouselList:any
  mobileCarouselList:any
}

interface CarouselState {
  mobileTableListTitle: Array<object>
  carouselVisible:boolean,
  editCarouselDatas:any,
  openType:string
}

class Carousel extends React.Component<CarouselProps, CarouselState> {
  state: CarouselState = {
    mobileTableListTitle: [
      { title: '排序', dataIndex: 'sortId', align: 'center' },
      { title: '轮播标题', dataIndex: 'title', align: 'center' },
      { title: '跳转连接', dataIndex: 'outLinkUrl', align: 'center' },
      { title: '更新时间', dataIndex: 'lastupdateDate', align: 'center' },
      {
        title: '操作', align: 'center',width:200, render: (row: any) =>
        <div className="handle_btn">
          <HandleButton icon="edit" title="编辑" handleClick={this.handleAdd.bind(this, 'edit', row)}/>
          <Popconfirm placement="top" title={'确定移动该轮播?'}  onConfirm={this.handleMove.bind(this,row,'1')} okText="确定" cancelText="取消">
            <HandleButton icon="vertical-align-top" title="上移"/>
          </Popconfirm>
          <Popconfirm placement="top" title={'确定移动该轮播?'}  onConfirm={this.handleMove.bind(this,row,'2')} okText="确定" cancelText="取消">
            <HandleButton icon="vertical-align-bottom" title="下移"/>
          </Popconfirm>
          <Popconfirm placement="top" title={'确定要删除吗?'} onConfirm={this.handleDelete.bind(this,row)} okText="确定" cancelText="取消">
            <HandleButton icon="delete" title="删除" handleClick={this.handleDelete.bind(this, row)}/>
          </Popconfirm>
        </div>
      }
    ],
    carouselVisible:false,
    editCarouselDatas:{},
    openType:'new'
  };

  // 新增
  handleAdd(type:string,row?:any){
    this.setState({
      openType:type,
      carouselVisible:true,
      editCarouselDatas:row
    })
  }

  // 移动
  handleMove(row:any,type:any){
    let self =this;
    let {dispatch} = this.props
    if(dispatch){
      dispatch({
        type:'carousel/moveCarouselRequest',
        payload:{
          id:row.id,
          move:type
        },
        callback:(res:any)=>{
          if(res.errorCode==='0000'){
            message.success('操作成功');
            self.getPageDatas()
          }
        }
      })
    }
  }

  //删除
  handleDelete(row:any){
    let self =this;
    let {dispatch} = this.props
    if(dispatch){
      dispatch({
        type:'carousel/deleteCarouselRequest',
        payload:{id:row.id},
        callback:(res:any)=>{
          if(res.errorCode==='0000'){
            message.success('操作成功');
            self.getPageDatas()
          }
        }
      })
    }
  }
  
  UNSAFE_componentWillMount() {
    this.getPageDatas()
  }
  
  // 获取页面初始化信息
  getPageDatas() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'carousel/carouselListRequest',
        payload: { type: 1 }
      })
      dispatch({
        type: 'carousel/carouselListRequest',
        payload: { type: 2}
      })
    }
  }

  // 新增弹窗/编辑弹窗
  handleModalStatusClick(value:boolean){
    this.setState({
      carouselVisible: value
    })
  }

  render() {
    return (
      <div className={styles.homePageContent}>
         <Button type="primary" icon="plus" onClick={this.handleAdd.bind(this,'new','')}>新建轮播图</Button>
        <div className={`mT20 ${styles.pageContent}`}>
          <div>
            <h3>手机端轮播</h3>
            <Table<any>
              size="middle"
              loading={this.props.loading}
              pagination={false}
              rowKey={record => record.id}
              bordered
              columns={this.state.mobileTableListTitle}
              dataSource={this.props.carouselList? this.props.carouselList.returnObject: []} />
          </div>
          <div className="mT20">
            <h3>网页端轮播</h3>
            <Table<any>
              size="middle"
              loading={this.props.loading}
              pagination={false}
              rowKey={record => record.id}
              bordered
              columns={this.state.mobileTableListTitle}
              dataSource={this.props.mobileCarouselList ? this.props.mobileCarouselList.returnObject : []} />
          </div>
        </div>
        <CarouselAdd editCarouselDatas={this.state.editCarouselDatas} carouselVisible={this.state.carouselVisible} openType={this.state.openType} getPageDatas={this.getPageDatas.bind(this)} handleStatusClick={this.handleModalStatusClick.bind(this)}></CarouselAdd>
      </div>
    );
  }
}

export default connect(({ carousel, loading }: ConnectState) => ({
  carouselList: carousel.carouselList,
  mobileCarouselList: carousel.mobileCarouselList,
  loading: loading.models.carousel,
}))(Carousel);
