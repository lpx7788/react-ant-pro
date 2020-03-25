import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DatePicker,Tree} from 'antd';
// import AntdRadioGroup from '@/components/AntdRadioGroup';
const { RangePicker } = DatePicker;
const { TreeNode } = Tree;


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
  treeData = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
          ],
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
          ],
        },
        {
          title: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
      ],
    },
    {
      title: '0-2',
      key: '0-2',
    },
  ];
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
    return (
      <PageHeaderWrapper>
        <div className={styles.dictionaryManagementPage}>
          <header className="pageHeader">
            <p>
              <span>创建时间</span>
              <RangePicker className={`mL20 ${styles.dictionaryContent}`} onChange={this.handleRangePicker.bind(this)} locale={locale} />
            </p>
        
          </header>
          <div className="pageContent">
            <div className={`border ${styles.contentItem}`}>
              <section>
              <Tree
                onExpand={this.onExpand}  
                  checkable
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
              >
                {this.renderTreeNodes(this.treeData)}
              </Tree>
              </section>
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
