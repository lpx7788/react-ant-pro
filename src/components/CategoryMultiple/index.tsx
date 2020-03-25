import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Cascader, Select, Icon } from 'antd';
import { findDOMNode } from 'react-dom'

const { Option } = Select

interface Props extends ConnectProps {
    userData: any;
    onChange: any;
    defaultValue: any;
}

interface State {
    options: Array<any>
    fieldNames: object
    categoryCheckList: Array<any>
    popupVisible: boolean,
}

class categoryMultiple extends React.Component<Props>{
    constructor(props: Props) {
        super(props)
    }
    state: State = {
        options: [],
        fieldNames: { label: 'categoryName', value: 'categoryCode', children: 'childs' },
        categoryCheckList: [],
        popupVisible: false,
    }

    UNSAFE_componentWillMount() {
        this.queryCategory()
    }
    componentDidMount() {
        document.addEventListener('click', (e) => this.outSelectClickHandler(e), false);
    }
    componentWillUnmount() {
        document.removeEventListener('click', (e) => this.outSelectClickHandler(e), false);
    }

    change(value: any, selectedOptions: any) {
        let self = this
        let categoryNameList = this.state.categoryCheckList.map(item => item.categoryName)
        let categoryCheckList = this.state.categoryCheckList
        if (categoryNameList.indexOf(selectedOptions[1].categoryName) == -1) {
            categoryCheckList.push(selectedOptions[1])
            this.setState({
                categoryCheckList: categoryCheckList,
                popupVisible: false
            }, function () {
                self.props.onChange(categoryCheckList)//这个地方把值传递给了props的事件当中
            })
        }
    }
    deselect(val: any) { //取消选中
        let self = this
        let categoryNameList = this.state.categoryCheckList.map(item => item.categoryName)
        let categoryCheckList = this.state.categoryCheckList
        let index = categoryNameList.indexOf(val)
        categoryCheckList.splice(index, 1)
        this.setState({
            categoryCheckList: categoryCheckList,
        }, function () {
            self.props.onChange(categoryCheckList)//这个地方把值传递给了props的事件当中
        })
    }
    closeAll() {
        let self = this
        this.setState({
            categoryCheckList: [],
            popupVisible: false
        }, function () {
            self.props.onChange([])//这个地方把值传递给了props的事件当中
        })
    }
    onFocus() {
        this.setState({
            popupVisible: true
        })
    }
    outSelectClickHandler(e: any) {
        // 组件已挂载且事件触发对象不在div内
        let node = findDOMNode(this.refs.select)
        if (node) {
            let result = node.contains(e.target);
            if (!result) {
                this.setState({
                    popupVisible: false
                });
            }
        }
    }
    echo(tree: Array<any>, vals: any) { //回显
        if(vals==='' || vals === []) return 
        let arr: any = []
        tree.forEach(level1 => {
            level1.childs.forEach((level2: any) => {
                level2.childs.forEach((level3: any) => {
                    arr.push(level3)
                })
            })
        })
        arr.forEach((item:any) => {
            if(vals.indexOf(item.categoryCode)!==-1){
                let list = this.state.categoryCheckList
                list.push(item)
                this.setState({
                    categoryCheckList: list
                })
            }
        })
    }
    queryCategory() {
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'category/categoryTreeQuery',
                payload: {},
                callback: (res: any) => {
                    if (res.errorCode === '0000') {
                        this.echo(res.returnObject, this.props.defaultValue)
                        let arr: any = []
                        res.returnObject.forEach((level1: any) => {
                            let obj = {
                                categoryCode: level1.categoryCode,
                                categoryName: level1.categoryName,
                                childs: []
                            }
                            level1.childs.forEach((level2: any) => {
                                level2.childs.forEach((level3: never) => {
                                    obj.childs.push(level3)
                                })
                            })
                            arr.push(obj)
                        })
                        this.setState({
                            options: arr
                        })
                    }
                }
            })
        }
    }

    render() {
        return (
            <div className={styles.categoryMultiple}>
                <div className={styles.content}>
                    <Select
                        ref='select'
                        value={this.state.categoryCheckList.map(item => item.categoryName)}
                        mode="multiple"
                        autoClearSearchValue
                        open={false}
                        onDeselect={this.deselect.bind(this)}
                        onFocus={this.onFocus.bind(this)}
                    >
                        {this.state.categoryCheckList.map((item, index) => {
                            return (<Option key={index}>{item.categoryName}</Option>)
                        })}
                    </Select>
                    <Icon type="close-circle" className={styles.closeIcon} onClick={this.closeAll.bind(this)} />
                </div>
                <div className="cascader">
                    <Cascader popupVisible={this.state.popupVisible} expandTrigger="hover" options={this.state.options} fieldNames={this.state.fieldNames} onChange={this.change.bind(this)} />
                </div>
            </div>
        )
    }
}

export default connect(({ }: ConnectState) => ({
}))(categoryMultiple);
