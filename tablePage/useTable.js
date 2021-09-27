import { useState, useEffect, useCallback } from 'react'
import useFetch from 'src/component/TablePage/useFetch'

const useTable = (param = {}, fetcher, options = {}, tableOptions = {}) => {
  const { defaultParams = { currentPage: 1, pageSize: 10 }, order = {} } = options
  const [query, setQuery] = useState(() => ({ currentPage: defaultParams.currentPage, pageSize: defaultParams.pageSize, sort: { orders: [order] }, reloadPage: false }))
  const [selectRowKeys, setSelectRowKeys] = useState(() => {})
  const { data, loading, isError, request } = useFetch({ ...query, ...param }, fetcher, options)
  const onTableChange = useCallback((pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    let sortParam = {}
    if(Object.keys(sorter).length > 0) {
      const { columnKey, order } = sorter
      const direction = order === 'descend' ? 'DESC' : 'ASC'
      sortParam = { property: columnKey, direction: direction }
    }
    setQuery((prev) => ({ ...prev, currentPage: current, pageSize, sort: { orders: [sortParam] } }))
  }, [])

  useEffect(() => {
    setQuery(prev => ({ ...prev, currentPage: defaultParams.currentPage, pageSize: defaultParams.pageSize }))
  }, Object.values(param))

  const refresh = useCallback(() => {
    setQuery((prev) => ({ ...prev, currentPage: defaultParams.currentPage, pageSize: defaultParams.pageSize }))
  }, [])
  const reloadPage = useCallback(() => {
    //重载页面数据,new Date()表示每次参数不一致,会重新加载页面数据
    setQuery((prev) => ({ ...prev, reloadPage: new Date() }))
  }, [])
  const rowSelectionChange = useCallback((selectRowKeys) => {
    setSelectRowKeys(selectRowKeys)
  })
  let newData = data ? tableOptions.tableDataKey ? data[tableOptions.tableDataKey] : data : {}
  if(tableOptions.formatData) {
    newData.list = tableOptions.formatData(newData.list)
  }
  const tableProps = {
    onChange: onTableChange,
    dataSource: newData.list,
    pagination: {
      total: newData.totalElements,
      pageSize: query.pageSize,
      current: query.currentPage,
      size: 'small',
      pageSizeOptions: [10, 20, 40, 60],
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `总条数: ${total}`
    },
  }
  // 是否显示全选按钮
  if(tableOptions.rowSelection) {
    tableProps.rowSelection = {
      ...tableOptions.rowSelection,
      onChange: rowSelectionChange,
    }
  }
  return {
    tableProps,
    loading,
    isError,
    request,
    refresh,
    reloadPage,
    selectRowKeys
  }
}
export default useTable
