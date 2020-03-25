import React from 'react'
import { connect } from 'dva'
import { Cascader } from 'antd';
import { ConnectState, ConnectProps } from '@/models/connect';

interface Props extends ConnectProps {
    onChange: (data: any) => void;
}

class categoryCascader extends React.Component<Props>{
    state: any = {
        tree: [],
        options: [],
        fieldNames: { label: 'categoryName', value: 'categoryCode', children: 'childs' },
        defaultValue: []
    }

    UNSAFE_componentWillMount() {
        this.queryCategory()
    }

    change(val: Array<any>){
        this.props.onChange(val,this.queryCategoryName(this.state.tree,val[1]))
        this.setState({
            defaultValue: val
        })
    }
    queryCategory() {
        let self = this
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'category/categoryTreeQuery',
                payload: {},
                callback: (res: any) => {
                    if (res.errorCode === '0000') {
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
                            options: arr,
                            tree: res.returnObject
                        },function(){
                            self.echo(self.props.values)
                        })
                    }
                }
            })
        }
    }
    queryCategoryName(tree: Array<any>,val:string){
        let categoryName
        let arr: any = []
        tree.forEach(level1 => {
            level1.childs.forEach((level2: any) => {
                level2.childs.forEach((level3: any) => {
                    arr.push(level3)
                })
            })
        })
        arr.forEach((item:any) => {
            if(item.categoryCode===val){
                categoryName = item.categoryName
            }
        })
        return categoryName
    }
    echo(val:string){
        this.state.options.forEach(item => {
            item.childs.forEach(i => {
                if(i.categoryCode===val){
                    this.setState({
                        defaultValue: [item.categoryCode,i.categoryCode]
                    })
                }
            })
        })
    }

    render() {
        return (
            <div className="categorySelect" ref="cascader">
                <Cascader expandTrigger="hover" value={this.state.defaultValue} options={this.state.options} fieldNames={this.state.fieldNames} onChange={this.change.bind(this)} />
            </div>
        )
    }
}

export default connect(({ }: ConnectState) => ({
}))(categoryCascader)
