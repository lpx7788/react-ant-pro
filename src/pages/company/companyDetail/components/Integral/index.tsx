import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Button, Select, Form, Input, Modal, Table, Cascader, Popconfirm, Tooltip } from 'antd';
import { ConnectState, ConnectProps } from '@/models/connect';

const { Option } = Select;

interface Props extends ConnectProps {
  loading: boolean;
  location: any;
  form: any;
  tableData: Array<any>;
  companyCode: string;
  queryIntegrals: any;
}

interface FormProps extends ConnectProps {
  Props: any;
  loading: boolean;
  location: any;
  form: any;
  tableData: Array<any>;
  companyCode: string;
  queryIntegrals: any;
  handleFinish: any;
  onRef: any;
}

interface FormState {
  fieldNames: object;
  options: Array<any>;
  checkedCategory: Array<any>;
  categoryTree: Array<any>;
  integralData: object;
}
class FormItem extends React.Component<FormProps> {
  state: FormState = {
    fieldNames: { label: 'categoryName', value: 'categoryCode', children: 'childs' },
    options: [],
    checkedCategory: [],
    categoryTree: [],
    integralData: {
      id: '',
    },
  };

  UNSAFE_componentWillMount() {
    this.queryCategory();
  }
  componentDidMount() {
    this.props.onRef(this);
  }

  cascaderChange(value: any, selectedOptions: any) {
    this.setState({
      checkedCategory: selectedOptions,
    });
  }
  queryCategory() {
    const { dispatch } = this.props.Props;
    if (dispatch) {
      dispatch({
        type: 'category/categoryTreeQuery',
        payload: {},
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            let arr: any = [];
            res.returnObject.forEach((level1: any) => {
              let obj = {
                categoryCode: level1.categoryCode,
                categoryName: level1.categoryName,
                childs: [],
              };
              level1.childs.forEach((level2: any) => {
                level2.childs.forEach((level3: never) => {
                  obj.childs.push(level3);
                });
              });
              arr.push(obj);
            });
            this.setState({
              categoryTree: arr,
              options: arr,
            });
          }
        },
      });
    }
  }
  save(e: Event) {
    //保存
    e.preventDefault();
    const { dispatch } = this.props.Props;
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        if (dispatch) {
          let params = {
            categoryCode: this.state.checkedCategory[1].categoryCode,
            categoryName: this.state.checkedCategory[1].categoryName,
            companyCode: this.props.companyCode,
            rewardConditions: values.rewardConditions,
            rewardNum: values.rewardNum,
          };
          if (this.state.integralData.id) {
            params['id'] = this.state.integralData.id;
          }
          dispatch({
            type: 'integral/addRewardIntegral',
            payload: params,
            callback: (res: any) => {
              if (res.errorCode === '0000') {
                this.props.handleFinish();
              }
            },
          });
        }
      }
    });
  }
  showModal(row: any) {
    this.setState({
      integralData: row.rewardConditions ? row : {},
    });
    let checkedCategory = this.echo(row.categoryName, 'categoryName');
    if (row.categoryName) {
      this.setState({
        checkedCategory: checkedCategory,
      });
    }
    this.props.form.setFieldsValue({
      //设置编辑表单默认值
      rewardConditions: row.rewardConditions ? row.rewardConditions : '1',
      rewardNum: row.rewardNum ? row.rewardNum : '',
      categoryCode: checkedCategory
        ? [checkedCategory[0].categoryCode, checkedCategory[1].categoryCode]
        : [],
    });
  }
  echo(val: string, type: string) {
    let res;
    this.state.categoryTree.forEach((item: any) => {
      item.childs.forEach((i: any) => {
        if (i[type] === val) {
          let level1 = {
            categoryCode: item.categoryCode,
            categoryName: item.categoryName,
          };
          // this.setState({
          //     checkedCategory: [level1,i]
          // })
          res = [level1, i];
        }
      });
    });
    return res;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form labelAlign="right" onSubmit={this.save.bind(this)}>
        <Form.Item label="交易品种：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('categoryCode', {
            rules: [{ required: true, message: '请选择交易品种！' }],
          })(
            <Cascader
              expandTrigger="hover"
              options={this.state.options}
              fieldNames={this.state.fieldNames}
              onChange={this.cascaderChange.bind(this)}
            />,
          )}
        </Form.Item>
        <Form.Item label="奖励条件：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('rewardConditions', { initialValue: '1' })(
            <Select>
              <Option value="1">成交价达到指导价，且成交</Option>
              <Option value="2">成交即可</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="奖励数量：" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('rewardNum', {
            rules: [{ required: true, message: '请输入奖励数量！' }],
          })(<Input />)}
        </Form.Item>
        <div className="center">
          <Button type="primary" htmlType="submit" loading={this.props.Props.loading}>
            确认添加
          </Button>
        </div>
      </Form>
    );
  }
}
const FormItems: any = Form.create()(FormItem);

class Integral extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  state: any = {
    visible: false,
    tableListTitle: [
      { title: '交易品种', dataIndex: 'categoryName', align: 'center' },
      {
        title: '奖励条件',
        dataIndex: 'rewardConditions',
        render: (row: any) => <div>{row === '1' ? '成交价达到指导价，且成交' : '成交即可'}</div>,
        align: 'center',
      },
      { title: '奖励数量', dataIndex: 'rewardNum', align: 'center' },
      {
        title: '操作',
        width: 200,
        render: (row: any) => (
          <div className={styles.handle}>
            <Tooltip placement="top" title={'编辑'} mouseEnterDelay={1}>
              <Button className="bgMain" onClick={this.showModal.bind(this,row)} icon="edit" shape="circle"></Button> 
            </Tooltip>
            {/* <Button
              type="primary"
              size="small"
              icon="edit"
              onClick={this.showModal.bind(this, row)}
            >
              编辑
            </Button> */}
            <Popconfirm
              title={'是否确认删除' + row.categoryName + '的奖励设置？'}
              onConfirm={this.deleteIntegral.bind(this, row)}
              okText="确认"
              cancelText="取消"
            >
              {/* <Button type="danger" size="small" icon="delete">
                删除
              </Button> */}
              <Tooltip placement="top" title={'删除'} mouseEnterDelay={1}>
                <Button className="bgRed" icon="delete" shape="circle"></Button> 
              </Tooltip>
            </Popconfirm>
          </div>
        ),
        align: 'center',
      },
    ],
    checkedCategory: [],
    integralData: {},
  };

  UNSAFE_componentWillMount() {}

  handleFinish() {
    this.setState({
      visible: false,
    });
    this.props.queryIntegrals();
  }
  queryCategory() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'category/categoryTreeQuery',
        payload: {},
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            let arr: any = [];
            res.returnObject.forEach((level1: any) => {
              let obj = {
                categoryCode: level1.categoryCode,
                categoryName: level1.categoryName,
                childs: [],
              };
              level1.childs.forEach((level2: any) => {
                level2.childs.forEach((level3: never) => {
                  obj.childs.push(level3);
                });
              });
              arr.push(obj);
            });
            this.setState({
              categoryTree: arr,
              options: arr,
            });
          }
        },
      });
    }
  }
  deleteIntegral(row?: any) {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'integral/deleteIntegral',
        payload: {
          id: row.id,
        },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            this.props.queryIntegrals();
          }
        },
      });
    }
  }
  handleCancel() {
    this.setState({ visible: false });
  }
  showModal(row?: any) {
    this.setState({
      visible: true,
    });
    this.child.showModal(row);
  }
  child: any = {};
  onRef = (ref: any) => {
    this.child = ref;
  };

  render() {
    return (
      <div className={styles.integral}>
        <h3>积分奖励设置</h3>
        <Table
          loading={this.props.loading}
          size="middle"
          rowKey={row => row.id}
          bordered
          columns={this.state.tableListTitle}
          dataSource={this.props.tableData}
          pagination={false}
        />
        <Modal
          title="添加奖励品种"
          visible={this.state.visible}
          footer={null}
          forceRender={true}
          onCancel={this.handleCancel.bind(this)}
        >
          <FormItems
            onRef={this.onRef}
            Props={this.props}
            checkedCategory={this.state.checkedCategory}
            companyCode={this.props.companyCode}
            handleFinish={this.handleFinish.bind(this)}
          />
        </Modal>
        <footer>
          <Button
            type="primary"
            icon="plus-circle"
            htmlType="submit"
            onClick={this.showModal.bind(this, {})}
          >
            添加奖励品种
          </Button>
        </footer>
      </div>
    );
  }
}

export default connect(({ loading }: ConnectState) => ({
  loading: loading.models.integral,
}))(Integral);
