import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DatePicker,Tree, Row,Col,Table,Card } from 'antd';
// import AntdRadioGroup from '@/components/AntdRadioGroup';
const { RangePicker } = DatePicker;
const { TreeNode } = Tree;
import G2 from '@antv/g2';

interface DictionaryManagementProps extends ConnectProps {
  loading: boolean;
  HomeDataList:Array<any>;
}

interface DictionaryManagementState {
  parameter: {
    dateKey: any,
    createDateStart: any,
    createDateEnd: any
  }
  expandedKeys:any,
  autoExpandParent: boolean,
  checkedKeys: any,
  selectedKeys: any,
}

class DictionaryManagement extends React.Component<DictionaryManagementProps, DictionaryManagementState> {
  state: DictionaryManagementState = {
    parameter: {
      dateKey: 'today',
      createDateStart: '',
      createDateEnd: ''
      
    },
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
  };

  UNSAFE_componentWillMount() {
    this.getPageDatas()
  }
  
  getRedisChartData(){
    const data = [
      { yaxis: '01:04', value: 10468 },
      { yaxis: '01:06', value: 11000 },
      { yaxis: '01:08', value: 11000 },
      { yaxis: '01:10', value: 11009 },
      { yaxis: '01:12', value: 11000 },
      { yaxis: '01:14', value: 11056 },
      { yaxis: '01:16', value: 11082 },
      { yaxis: '01:18', value: 11040 },
      { yaxis: '01:20', value: 11056 }
    ];

    const chart = new G2.Chart({
      container: 'RedisChart',
      forceFit: true,
      height: 500,
      width:100
    });
    chart.source(data);
    chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    });
    chart.area().position('yaxis*value');
    chart.line().position('yaxis*value').size(2);
    chart.render();
  }



  getRedisKeyChartData(){
    const data = [
      { yaxis: '01:04', value: 10081 },
      { yaxis: '01:06', value: 11000 },
      { yaxis: '01:08', value: 11300 },
      { yaxis: '01:10', value: 11009 },
      { yaxis: '01:12', value: 11240 },
      { yaxis: '01:14', value: 11000 },
      { yaxis: '01:16', value: 11081 },
      { yaxis: '01:18', value: 11000 },
      { yaxis: '01:20', value: 11000 }
    ];

    const chart = new G2.Chart({
      container: 'RedisKeyChart',
      forceFit: true,
      height: 500
    });
    chart.source(data);
    chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    });
    chart.area().position('yaxis*value');
    chart.line().position('yaxis*value').size(2);
    chart.render();
  }

  componentDidMount(){
    this.getRedisChartData();
    this.getRedisKeyChartData();

  }

  getPageDatas() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'home/fetchDatas',
        payload: this.state.parameter
      })
    }
  }

  //获取时间戳
  handleRangePicker(date: object, dateStrings: [string, string]) {
    let parameter = this.state.parameter
    parameter['dateKey'] = ''
    parameter['createDateStart'] =new Date(dateStrings[0]).getTime()
    parameter['createDateEnd'] =new Date(dateStrings[1]).getTime()
    this.setState({
      parameter: parameter
    });
    this.getPageDatas();
  }

  renderTreeNodes =( data:any) =>
  data.map((item:any) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} {...item} />;
  });
  onExpand = (expandedKeys:any) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };


  onCheck = (checkedKeys:any) => {
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys:any, info:any) => {
    this.setState({ selectedKeys });
  };
  render() {
    let data= [
      {
        key: '1',
        name: 'redis_version',
        content: 'Redis 服务器版本',
        detail: '4.0.14',
      },
      {
        key: '2',
        name: 'redis_git_sha1',
        content: 'Git SHA1',
        detail: '00000000',
      },
      {
        key: '3',
        name: 'redis_git_dirty',
        content: 'Git dirty flag',
        detail: '0',
      },
    ]
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'content',
        dataIndex: 'content',
      },
      {
        title: 'detail',
        dataIndex: 'detail',
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.dictionaryManagementPage}>
          <div className="pageContent">
            <div className={`border ${styles.contentItem}`}>

                <Row>
                  <Col span={10}>   
                 
                      <h3 className="m20">Redis内存实时占用情况</h3>
                      <div id="RedisChart"></div>
           
                  </Col>
                  <Col span={2}></Col>
                  <Col span={10}>
                 
                      <h3 className="m20">Redis Key的实时数量</h3>
                      <div id="RedisKeyChart"></div>
                   
                  </Col>
                </Row>
             
              <div>
                <h3 className="m20">Redis详细信息</h3>
                <Table  className="m20" columns={columns}  showHeader={false}
                    dataSource={data} size="middle" />
              </div>
            </div>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ home, loading }: ConnectState) => ({
  HomeDataList: home.HomeDataList,
  loading: loading.models.home,
}))(DictionaryManagement);
