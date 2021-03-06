import { useCallback, useEffect, useState } from 'react'
import useFetch from 'src/component/TablePage/useFetch'
import { useDispatch } from 'react-redux'
// https://react-redux.js.org/api/hooks#usestore
const useTable = (param = {}, fetcher, options = {}, tableOptions = {}) => {
  const dispatch = useDispatch()
  const { defaultParams = { currentPage: 1, pageSize: 10 }, order = {} } = options
  const orders = options.orders ? options.orders : [order]
  const [query, setQuery] = useState(() => ({ currentPage: defaultParams.currentPage, pageSize: defaultParams.pageSize, sort: { orders: orders }, ...param, reloadPage: false }))

  const [selectedRowKeys, setSelectedRowKeys] = useState(() => {})
  const [selectedRows, setSelectedRows] = useState([])
  // { ...query, ...param }
  const { data, loading, isError, request } = useFetch(Object.assign({}, query), fetcher, options)
  const onTableChange = useCallback((pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    let sortParam = orders
    if(Object.keys(sorter).length > 0) {
      const { columnKey, order } = sorter
      const direction = order === 'descend' ? 'DESC' : 'ASC'
      sortParam = [{ property: columnKey, direction: direction }]
    }
    setQuery((prev) => ({ ...prev, currentPage: current, pageSize, sort: { orders: sortParam } }))
    dispatch({ type: 'TABLE_PAGINATION_CHANGE', defaultParams: { currentPage: current, pageSize, sort: { orders: [sortParam] } } })
  }, [])

  const resetDefaultParams = useCallback((params) => {
    setQuery((prev) => ({ ...prev, ...params, currentPage: defaultParams.currentPage, pageSize: defaultParams.pageSize }))
  }, [])
  // useEffect(() => {
  //   // setQuery(prev => ({ ...prev, currentPage: defaultParams.currentPage, pageSize: defaultParams.pageSize }))
  //   setQuery(prev => ({ ...prev}))
  // }, Object.values(param))

  const refresh = useCallback(() => {
    setQuery((prev) => ({ ...prev, currentPage: defaultParams.currentPage, pageSize: defaultParams.pageSize }))
  }, [])
  const reloadPage = useCallback(() => {
    //??????????????????,new Date()???????????????????????????,???????????????????????????
    setQuery((prev) => ({ ...prev, reloadPage: new Date() }))
  }, [])
  const rowSelectionChange = useCallback((selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
  })
  let newData = data ? tableOptions.tableDataKey ? data[tableOptions.tableDataKey] : data : {}
  if(tableOptions.formatData) {
    newData.list = tableOptions.formatData(newData.list)
  }
  const tableProps = {
    onChange: onTableChange,
    dataSource: newData.list,
    pagination: tableOptions.selectedRowKeys === false ? false : {
      total: newData.totalElements,
      pageSize: query.pageSize,
      current: query.currentPage,
      size: 'small',
      pageSizeOptions: ['10', '20', '40', '60'],
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `?????????: ${total}`
    },
  }
  // ????????????????????????
  if(tableOptions.rowSelection) {
    tableProps.rowSelection = {
      ...tableOptions.rowSelection,
      onChange: tableOptions.rowSelection.onChange ? tableOptions.rowSelection.onChange : rowSelectionChange,
    }
  }
  return {
    tableProps,
    loading,
    isError,
    request,
    refresh,
    reloadPage,
    selectedRowKeys,
    selectedRows,
    resetDefaultParams
  }
}

export default useTable