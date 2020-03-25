import React from 'react';
import { Form, Select, Input, Radio,message, Button, Upload, Icon } from 'antd';
const { Option } = Select;
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import styles from './style.less';
import UploadImg from '@/components/UploadImg';
import AntdRadioGroup from '@/components/AntdRadioGroup';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import E from 'wangeditor';
import route from 'mock/route';
import { router } from 'umi';

interface UserFormProps extends FormComponentProps {
  age: number;
  name: string;
  location:any,
  dispatch:any,
  sourseList:any
}
interface RleaseState {
  parameter: any
  editorContent: any;
  categoryType: Array<object>;
  consultingType: Array<object>;
  editReleaseDatas:any,
}
class RleaseInformation extends React.Component<UserFormProps, RleaseState> {
  state: RleaseState = {
    editorContent: '',
    consultingType: [
      { value: '1', textName: '要闻', key: 1 },
      { value: '2', textName: '关注', key: 2 },
      { value: '3', textName: '快讯', key: 3 },
      { value: '4', textName: '精选', key: 4 },
    ],
    categoryType: [
      { value: '1', textName: '有色', key: 1 },
      { value: '2', textName: '黑色', key: 2 },
      { value: '3', textName: '化工', key: 3 },
      { value: '4', textName: '农产品', key: 4 },
      { value: '5', textName: '其他', key: 5 },
    ],
    parameter: {
      type: '1',
      source: '',
      category: '1',
      file:[]
    },
    editReleaseDatas:''
  };

  componentWillMount(){
    let editReleaseDatas = this.props.location.state&&this.props.location.state.editDatas 
    if(editReleaseDatas){
      this.setState({
        editReleaseDatas:editReleaseDatas
      })
    }
    this.getSourseList();
  }

  getSourseList(){
    let {dispatch} =this.props
    if (dispatch) {
      dispatch({
        type: 'information/getSourseListRequest',
      })
    }
  }

  componentDidMount() {   
    this.props.form.setFieldsValue({
    advertisement:"0"
  })

    let parameter = this.state.parameter
    let editDatas = this.props.location.state?this.props.location.state.editDatas:''
    if(editDatas){
      parameter['category'] = this.state.editReleaseDatas.category
      parameter['type'] = this.state.editReleaseDatas.type
      parameter['coverImage'] = this.state.editReleaseDatas.coverPicUrl
      parameter['mobileCoverImage'] = this.state.editReleaseDatas.mobileCoverPicUrl
      this.setState({
        parameter:parameter
      })
      this.props.form.setFieldsValue({
        title:this.state.editReleaseDatas.title,
        source:this.state.editReleaseDatas.source,
        advertisement:this.state.editReleaseDatas.advertisement,
        coverImage:this.state.editReleaseDatas.coverPicUrl,
        mobileCoverImage:this.state.editReleaseDatas.mobileCoverPicUrl
      })
    }

    // 创建富文本编辑区域
    const elemMenu = this.refs.editorElemMenu;
    const elemBody = this.refs.editorElemBody;
    const editor = new E(elemMenu, elemBody);
    editor.customConfig.onchange = (html: any) => {
      this.setState({
        editorContent: editor.txt.html(),
      });
      
    };
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
    ];
    editor.customConfig.uploadImgShowBase64 = true;
    editor.create();

    if(this.state.editReleaseDatas){
      editor.cmd.do('insertHTML', this.state.editReleaseDatas.content)
    }
    
  }
  
  // 发布提交
  handleReleaseSubmit = (e: any) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      let url ='';
      let self = this;
      if (!err && values) {
        let {dispatch} = this.props
        let formData = new FormData();
        formData.append('title', values.title)
        formData.append('type', this.state.parameter.type)
        formData.append('category', this.state.parameter.category)
        formData.append('source', values.source)
        formData.append('content',this.state.editorContent)
        if(!this.state.editReleaseDatas){
          formData.append('display','1')
          url = 'information/informationReleaseRequest'
        }else{
          url = 'information/informationEditRequest'
          formData.append('industryId',this.state.editReleaseDatas.id)
        }
        formData.append('advertisement',values.advertisement)
        formData.append('coverImage',this.state.parameter.coverImage)
        formData.append('mobileCoverImage',this.state.parameter.mobileCoverImage)
        
        if(this.state.parameter.file.length!==0){
          for (let i = 0; i < this.state.parameter.file.length; i++) {
            formData.append('file',this.state.parameter.file[i])
          }
        }

        if (dispatch) {
          dispatch({
            type: url,
            payload: formData,
            callback: (res: any) => {
              if (res.errorCode === '0000') {
                message.success('操作成功')
                router.push({
                  pathname:'/information/all-information'
                })
              }
            },
          })
        }
      }
    });
  }

  getCoverImageFile(imgUrl: any){
    this.setParmas(imgUrl[0],'coverImage')
  }
  onEditorChange(){

  }

  getMobileCoverImageFile(imgUrl: any){
    this.setParmas(imgUrl[0],'mobileCoverImage')
  }

  getAccessoryFile(imgUrl: any){
    this.setParmas(imgUrl,'file')
  }

  setParmas(value:any,name:any){
    let parameter = this.state.parameter
    parameter[name] = value
    this.setState({
      parameter:parameter
    })
  }

  handleTypeChange = (e: String, name: string) => {
    let parameter = this.state.parameter;
    parameter[name] = e;
    this.setState({
      parameter: parameter,
    });
  };

  render() {
    let self = this
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 4 },
        md: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 20 },
        md: { span: 22 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper> 
        <div className={styles.RleaseInformationPage}>
       
        <Form {...formItemLayout} onSubmit={this.handleReleaseSubmit}>
          <Form.Item label="资讯标题：" hasFeedback>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题,100字以内!' }],
            })(<Input  style={{ width: '300px' }} placeholder={'请输入标题,100字以内'} />)}
          </Form.Item>
          <Form.Item label="资讯类型：">
            {getFieldDecorator('type')(
              <div>
                <AntdRadioGroup
                  value={this.state.parameter.type}
                  groupArr={this.state.consultingType}
                  change={(e: string) => {
                    this.handleTypeChange(e, 'type');
                  }}
                />
              </div>,
            )}
          </Form.Item>
          <Form.Item label="所属分类：">
            {getFieldDecorator('category')(
              <div>
                <AntdRadioGroup
                  value={this.state.parameter.category}
                  groupArr={this.state.categoryType}
                  change={(e: string) => {
                    this.handleTypeChange(e, 'category');
                  }}
                />
              </div>,
            )}
          </Form.Item>
          <Form.Item label="资讯来源：">
            {getFieldDecorator('source', {
              rules: [{ required: true, message: '请输入或选择资讯来源!' }],
            })(
              <Select
              mode="multiple"
              style={{ width: '300px' }}
              placeholder="请选择资讯来源"
              showSearch
              onChange={this.onEditorChange.bind(this)} 
              optionFilterProp="children"
            >
              {
                this.props.sourseList ?
                  this.props.sourseList.map((item: any) => (
                    <Option key={item} value={item}>{item}</Option>
                  )) : ''
              }
            </Select>
            )}
          </Form.Item>
          <Form.Item label="广告资讯：">
            {getFieldDecorator('advertisement',{
            rules: [{ required: true, message: '请选择!' }],})(
              <Radio.Group>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="资讯封面图：" extra="网页端">
            {getFieldDecorator('coverImage', {
              rules: [{ 
                validator: function(rule:any, value:any, callback:any){
                    if(self.state.parameter.coverImage||value||(self.state.editReleaseDatas&&self.state.editReleaseDatas.coverPicUrl)){
                      callback()
                    }else{
                      callback('请上传网页端封资讯封面图!')
                    }
                } }],
            })(
              <div>
                <UploadImg ref="trer" initPicUrl= {this.state.editReleaseDatas&&this.state.editReleaseDatas.coverPicUrl} preview adaption card btnType="primary" btnIcon="upload" handleChange={this.getCoverImageFile.bind(this)}></UploadImg>
              </div>
            )}
          </Form.Item>

          <Form.Item label="资讯封面图：" extra="手机端">
            {getFieldDecorator('mobileCoverImage', {
                rules: [{ 
                  validator: function(rule:any, value:any, callback:any){
                      if(self.state.parameter.mobileCoverImage||value||(self.state.editReleaseDatas&&self.state.editReleaseDatas.mobileCoverPicUrl)){
                          callback()
                      }else{
                          callback('请上传手机端资讯封面图!')
                      }
                  } }],
                })(
                <div>
                   <UploadImg initPicUrl= {this.state.editReleaseDatas&&this.state.editReleaseDatas.mobileCoverPicUrl} preview adaption card btnType="primary" btnIcon="upload" handleChange={this.getMobileCoverImageFile.bind(this)}></UploadImg>
                </div>
            )}
          </Form.Item>

          <Form.Item label="资讯附件：" extra=".png,.jpg,.jpeg,.pdf,.ppt,.xls,.xlsx,.doc,.docx">
            {getFieldDecorator('file', {
              rules: [{ 
                validator: function(rule:any, value:any, callback:any){
                  // console.log(self.state.parameter.file);
                  if(self.state.parameter.file){
                      callback()
                  }else{
                      callback('请上传附件!')
                  }
              } }],
            })(
             <div><UploadImg multiple btnType="primary" btnIcon="upload" handleChange={this.getAccessoryFile.bind(this)}></UploadImg></div>
            )}
          </Form.Item>
          <Form.Item label="资讯详情：">
            {getFieldDecorator('rw', {
              rules: [{ 
                validator: function(rule:any, value:any, callback:any){
                    if(self.state.editorContent){
                        callback()
                    }else{
                        callback('请输入资讯详情')
                    }
                } }],
            })(
              <div className="text-area">
                <div
                  ref="editorElemMenu"
                  style={{ backgroundColor: '#f1f1f1', border: '1px solid #ccc' }}
                  className="editorElem-menu"
                ></div>
                <div
                  style={{
                    padding: '10px 0 10px 10px',
                    overflowY: 'scroll',
                    height: 400,
                    border: '1px solid #ccc',
                    borderTop: 'none',
                  }}
                  ref="editorElemBody"
                  className="editorElem-body"
                ></div>
              </div>,
            )}
          </Form.Item>

          <Form.Item {...submitFormLayout}>
            <Button type="primary" icon="check" htmlType="submit">
              确认发布
            </Button>
            <Button className="mL20" type="primary" icon="edit" htmlType="submit">
              保存草稿
            </Button>
          </Form.Item>
        </Form>
      </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<UserFormProps>()(
  connect(({information}: ConnectState) => ({
    sourseList: information.sourseList,
  }))(RleaseInformation),
);
