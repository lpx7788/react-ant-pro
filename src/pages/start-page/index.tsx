import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Button, Table, message, Popconfirm } from 'antd';
import HandleButton from '@/components/HandleButton'
import moment from 'moment';
import 'moment/locale/zh-cn';
import { router } from 'umi';

interface StartPageProps extends ConnectProps {
  loading: boolean;
  advertisementList: any
}

interface StartPageState {
  mobileTableListTitle: Array<object>
  editCarouselDatas: any,
  // openType: string,
  parameter: any
}

class StartPage extends React.Component<StartPageProps, StartPageState> {
  state: StartPageState = {
    mobileTableListTitle: [
      {
        title: '序号', align: 'center', width: 100, key: '1', render: (text: any, record: any, index: any) =>
          <p>{index + 1}</p>
      },
      { title: '轮播标题', dataIndex: 'title', key: '2', align: 'center' },
      {
        title: '图片', key: '3', align: 'center', render: (row: any) =>
          <img src={row.advertisingPicture} alt="" />
      },
      { title: '跳转链接', dataIndex: 'advertisingUrl', key: '4', align: 'center' },
      { title: '开始日期', dataIndex: 'playingCreatDate', key: '5', align: 'center' },
      { title: '结束日期', dataIndex: 'playingEndDate', key: '6', align: 'center' },
      {
        title: '出现时段', key: '7', align: 'center', render: (row: any) =>
          <div>
            <div>星期{row.playingWeek.replace(/1/g, "一").replace(/2/g, "二").replace(/3/g, "三").replace(/4/g, "四").replace(/5/g, "五").replace(/6/g, "六").replace(/7/g, "日")}
            </div>
            <div>
              {row.chooseTime == '1' ? '全天' : (row.chooseTime == '2' ? '09:00 - 21:00' : row.chooseTime == '3' ? '21：00 - 00：00和00：00 - 09：00' : row.specifiedStartTime + ' - ' + row.specifiedEndTime)}
            </div>
          </div>
      },
      { title: '最后更新时间', key: '8', width: 200, align: 'center', render: (record: any) => moment(record.lastupdateDate).format('YYYY-MM-DD HH:mm:ss') },
      {
        title: '操作', align: 'center', width: 200, key: '9', render: (row: any) =>
        <div className="handle_btn">
            <span>
              <HandleButton icon="edit"  title="编辑" handleClick={this.handleAdd.bind(this, 'edit', row)} />
            </span>
            <span className="mL10">
              <HandleButton  icon="delete" title="删除" handleClick={this.handleDelete.bind(this, row)} />
            </span>
        </div>
      }
    ],
    editCarouselDatas: {},
    // openType: 'new',
    parameter: {
      pageNum: 1,
      pageSize: 20
    }
  };

  // 新增
  handleAdd(type: string, row?: any) {
    router.push({
      pathname: '/start-page/advertisement-add/index',
      state: {datas:row,openType:type},
      
    })
  }

  //删除
  handleDelete(row: any) {
    let self = this;
    let { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'advertisement/deleteAdvertisementRequest',
        payload: { id: row.id },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
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
        type: 'advertisement/advertisementListRequest',
        payload: this.state.parameter
      })
    }
  }

  render() {
    return (
      <div className={styles.startPageContent}>
        <Button type="primary" onClick={this.handleAdd.bind(this, 'new', '')}>创建广告</Button>
        <div className={`mT20 ${styles.pageContent}`}>
          <Table<any>
            size="middle"
            loading={this.props.loading}
            pagination={false}
            rowKey={record => record.index}
            bordered
            columns={this.state.mobileTableListTitle}
            dataSource={this.props.advertisementList.returnObject ? this.props.advertisementList.returnObject.list : []} />
        </div>
      </div>
    );
  }
}

export default connect(({ advertisement, loading }: ConnectState) => ({
  advertisementList: advertisement.advertisementList,
  loading: loading.models.advertisement,
}))(StartPage);
