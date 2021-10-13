import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Button, message, Spin, Tree } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import '@/assets/css/self-button.css'
import '@/assets/css/_auth.css'

import * as CommonService from '@/services/common'
import * as RoleService from '@/services/role'
import * as BaseUtils from '../../../utils/BaseUtils'

export default class Resources extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pageLoading: true,
      buttonLoading: false,
      halfCheckedKeys: [],
      resourceData: []
    }
  }

  async componentDidMount() {
    const { state } = this.props.location
    if(!Object(state).hasOwnProperty('currentDetailId')) {
      return message.error('参数错误', 2, () => {
        this.props.history.replace('/ums/role')
      })
    }
    const currentDetailId = state.currentDetailId

    this.getPageData(currentDetailId)
  }

  async getPageData(currentDetailId) {
    const { code, msg, data: allResourceData } = await CommonService.getCommonMenus()
    const { data: roleResourceData } = await RoleService.roleGetRoleauth({ roleId: currentDetailId })
    const allData = BaseUtils.getChildrenList(allResourceData.son, [], 'key')
    const roleData = BaseUtils.getChildrenList(roleResourceData.son, [], 'key')
    const defaultCheckedKeys = BaseUtils.getChildrenListRemoveParentId(roleData, allData)
    this.setState({
      currentDetailId,
      allResourceData: allData,
      defaultCheckedKeys: defaultCheckedKeys,
      checkedKeys: BaseUtils.getChildrenListId(roleData).flat(),
      pageLoading: false
    })
  }


  handleUpdateRoleResourceBatch = async() => {
    const { currentDetailId, checkedKeys, halfCheckedKeys } = this.state
    this.setState({
      buttonLoading: true
    })
    const requestData = { menuIdList: [...new Set(checkedKeys.concat(halfCheckedKeys))], roleId: currentDetailId }
    const { code, data, msg } = await RoleService.roleSetroleauth(requestData)

    if(code === 0) {
      return message.success(msg, 1, () => {
        this.setState({
          buttonLoading: false
        })
        this.props.history.replace('/ums/role')
      })
    }
  }

  handleGoBack(event) {
    event.preventDefault()
    this.props.history.goBack()
  }

  onExpand = (expandedKeysValue) => {
    // console.log('onExpand', expandedKeysValue) // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys: expandedKeysValue,
      autoExpandParent: true
    })
  }

  onCheck = (checkedKeysValue, event) => {
    // console.log('onCheck', checkedKeysValue, event)
    this.setState({
      checkedKeys: checkedKeysValue,
      halfCheckedKeys: event.halfCheckedKeys
    })
  }

  onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', selectedKeysValue, info)
    this.setState({ selectedKeys: selectedKeysValue })
  }

  render() {
    const { buttonLoading, allResourceData, pageLoading, defaultExpandedKeys, defaultCheckedKeys, expandedKeys, autoExpandParent, checkedKeys, selectedKeys } = this.state
    return (
      <PageHeaderWrapper>
        <div>
          {pageLoading ? <Spin/> : <div className="auth-table-div">
            <Tree
              checkable
              defaultExpandAll={true}
              // checkStrictly={true}
              defaultExpandedKeys={defaultExpandedKeys}
              defaultCheckedKeys={defaultCheckedKeys}
              // onExpand={this.onExpand}
              // expandedKeys={expandedKeys}
              // autoExpandParent={false}
              onCheck={this.onCheck}
              // checkedKeys={checkedKeys}
              onSelect={this.onSelect}
              // selectedKeys={selectedKeys}
              treeData={allResourceData}
            />
            <Button className="m-top m-right " type="primary" icon={<PlusOutlined/>}
                    loading={buttonLoading}
                    onClick={(event) => this.handleUpdateRoleResourceBatch(event)}>保存</Button>
            <Button className="m-top"
                    onClick={(event) => {
                      this.handleGoBack(event)
                    }}>取消</Button>
          </div>}
        </div>
      </PageHeaderWrapper>
    )
  }
}