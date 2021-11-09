import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { Modal } from 'antd'

const PageModalComponent = ({ children, title = '', width = 520, footer = null }, ref) => {
  const [visible, setVisible] = useState(false)
  const openOrShowModal = useCallback((visible) => {
    setVisible(visible)
  })
  // 暴露的子组件方法，给父组件调用
  useImperativeHandle(ref, () => {
    return { openOrShowModal }
  })
  return (
    <Modal
      destroyOnClose={true}
      visible={visible}
      title={title}
      bodyStyle={{
        paddingTop: '0px'
      }}
      width={width}
      footer={footer}
      onCancel={() => openOrShowModal(false)}
    >
      {children}
    </Modal>
  )
}

export default forwardRef(PageModalComponent)
