import { Table } from 'antd'
import React, { useImperativeHandle, forwardRef } from 'react'
import useTable from './useTable'

const TableComponent = ({ columns, selectValue, fetcher, options, tableOptions }, ref) => {
  const { loading, tableProps, refresh, reloadPage, selectRowKeys } = useTable(selectValue, fetcher, options, tableOptions)
  // 暴露的子组件方法，给父组件调用
  useImperativeHandle(ref, () => {
    return { refresh, reloadPage, selectRowKeys }
  })
  return (<Table rowKey={tableOptions.rowKey} columns={columns} loading={loading}{...tableProps} />
  )
}
export default forwardRef(TableComponent)
