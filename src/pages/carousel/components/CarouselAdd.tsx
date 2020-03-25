import React from 'react';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Form, Button, Modal, Input, Radio, message } from 'antd';
import UploadImg from '@/components/UploadImg';

// 主体部分
interface CarouselAddProps extends ConnectProps {
  form: any,
  editCarouselDatas: any,
  openType: string,
  carouselVisible: boolean,
  handleStatusClick: (value: any) => void;
  getPageDatas: (value: any) => void;
}

class CarouselAdd extends React.Component<CarouselAddProps> {
  // 关闭窗口
  onClose = () => {
    this.props.handleStatusClick(false);
  };

  // 主题部分
  render() {
    return (
      <Modal
        title={this.props.openType === 'new' ? '新建轮播' : '编辑轮播图'}
        visible={this.props.carouselVisible}
        onCancel={this.onClose}
        footer={null}
        width="800px">
        <FormItemEdit key={this.props.editCarouselDatas.id || `0${Date.now()}`} dispatch={this.props.dispatch} editCarouselDatas={this.props.editCarouselDatas} getPageDatas={this.props.getPageDatas.bind(this)} openType={this.props.openType} handleClose={this.onClose} />
      </Modal>
    );
  }
}

// form表单部分
interface CarouselFormState {
  coverPicType:any,
  coverPicFile:string
}

interface CarouselFormProps extends ConnectProps {
  handleClose: () => void
  getPageDatas: () => void
  openType: string,
  form: any,
  editCarouselDatas: any,
  dispatch:any
}

class FormItem extends React.Component<CarouselFormProps, CarouselFormState> {
  state: CarouselFormState = {
    coverPicType: '1',
    coverPicFile: '',
  };

  componentDidMount() {
    this.setState({
      coverPicType: this.props.editCarouselDatas.coverPicType ? this.props.editCarouselDatas.coverPicType : '1',
    })
    this.props.form.setFieldsValue({
      coverPicType: this.props.editCarouselDatas.coverPicType ? this.props.editCarouselDatas.coverPicType : '1',
      type: this.props.editCarouselDatas.type ? this.props.editCarouselDatas.type : '1',
    })
    if (this.props.openType === 'edit') {
      this.props.form.setFieldsValue({
        title: this.props.editCarouselDatas.title,
        outLinkUrl: this.props.editCarouselDatas.outLinkUrl,
        coverPicUrl: this.props.editCarouselDatas.coverPicUrl,
      })
    }
  }

 // 图片或者链接
  onTypeChange(e:any) {
     this.setState({
      coverPicType: e.target.value,
     })
  }


  // 新增或者编辑提交
  menuUpdetasubmit(e: any) {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      const { dispatch } = this.props
      if (!err && values) {
      const formData = new FormData();
      const { openType } = this.props;
      let url = ''
      switch (openType) {
        case 'new':
          url = 'carousel/addCarouselRequest'
          break;
        case 'edit':
          url = 'carousel/editCarouselRequest'
          formData.append('adId', this.props.editCarouselDatas.id)
        break;
      }
        formData.append('title', values.title)
        formData.append('type', values.type)
        formData.append('outLinkUrl', values.outLinkUrl)
        formData.append('coverPicFile', this.state.coverPicFile)
        formData.append('coverPicUrl', values.coverPicUrl)
        formData.append('coverPicType', values.coverPicType)
        if (dispatch) {
          dispatch({
            type: url,
            payload: formData,
            callback: (res:any) => {
              if (res.errorCode === '0000') {
                message.success('操作成功');
                this.props.handleClose()
                this.props.getPageDatas()
              }
            },
          })
        }
      }
    });
  }

  // 获取上传的图片
  getImageFile(urlObj:any) {
    this.setState({
      coverPicFile: urlObj[0],
    })
  }

  // 关闭弹窗
  onClose() {
    this.props.handleClose()
  }

  getPageDatas() {
    this.props.getPageDatas()
  }

  // 表单部分
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} onSubmit={this.menuUpdetasubmit.bind(this)}>
            <Form.Item label="标题：">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入标题' }],
              })(
                <Input placeholder="请输入按钮名称" />,
            )}
            </Form.Item>
            <Form.Item label="跳转链接：">
              {getFieldDecorator('outLinkUrl', {
                rules: [{ required: true, message: '请输入跳转链接' }],
              })(
                <Input placeholder="请输入跳转链接" />,
              )}
            </Form.Item>
            <Form.Item label="显示终端：">
            {getFieldDecorator('type')(
              <Radio.Group>
                <Radio value="1">手机</Radio>
                <Radio value="2">网页</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
            <Form.Item label="封面类型：">
            {getFieldDecorator('coverPicType')(
              <Radio.Group onChange={this.onTypeChange.bind(this)}>
                <Radio value="1">链接</Radio>
                <Radio value="2">图片</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {this.state.coverPicType === '1' ?
            <Form.Item label="封面链接：">
            {getFieldDecorator('coverPicUrl')(
              <Input placeholder="请输入封面链接" />,
            )}
          </Form.Item> :
          <Form.Item label="封面文件：">
            {getFieldDecorator('coverPicFile')(
              <div>
                <UploadImg initPicUrl= {this.props.editCarouselDatas ? this.props.editCarouselDatas.coverPicUrl : ''} preview adaption card btnType="primary" btnIcon="upload"
                handleChange={this.getImageFile.bind(this)}></UploadImg>
              </div>,
            )}
          </Form.Item>
          }
          <Form.Item style={{ height: '61' }}></Form.Item>
          <Form.Item style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            marginBottom: '0',
          }} wrapperCol={{ span: 24 }}>
            <Button onClick={this.onClose.bind(this)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button htmlType="submit" type="primary">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const FormItemEdit: any = Form.create()(FormItem);
export default connect(({ loading }: ConnectState) => ({
}))(CarouselAdd);
