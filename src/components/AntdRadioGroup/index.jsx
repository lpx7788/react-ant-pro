import React from 'react'
import { Radio } from 'antd';
export default class AntdRadioGroup extends React.Component {
  changeButton = e => {
    this.props.change(e.target.value);
  }
  render() {
    return (
      <Radio.Group value={this.props.value} onChange={this.changeButton}>
        {
          this.props.groupArr.map((item) => {
            return (
              <Radio.Button value={item.value} key={item.key}  >{item.textName}</Radio.Button>
            )
          })
        }
      </Radio.Group>
    )
  }
}




