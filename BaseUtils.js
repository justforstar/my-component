import moment from 'moment'

export function formatDate(expectDate) {
  if(expectDate) {
    return expectDate.format('YYYY-MM-DD HH:mm:ss')
  }
  return Date().format('YYYY-MM-DD HH:mm:ss')
}

export function formatMomentDate(momentDate) {
  if(momentDate) {
    return moment(momentDate, 'YYYY-MM-DD')
  }
  return moment()
}

export function formatDateYYYYMMDD(dateStr) {
  const date = new Date(dateStr)
  return date.getFullYear() + '-' + padStartNumberWithZero(date.getMonth() + 1) + '-' + padStartNumberWithZero(date.getDate())

}

export function getExpireDate(dateStr) {
  const date = new Date(dateStr)
  date.setDate(date.getDate() - 1)
  date.setFullYear(date.getFullYear() + 3)
  return date.getFullYear() + '-' + padStartNumberWithZero(date.getMonth() + 1) + '-' + padStartNumberWithZero(date.getDate())
}

export function padStartNumberWithZero(number) {
  return number.toString().padStart(2, '0')
}

//处理非空字段
export function filterNotNullObject(obj) {
  let param = {}
  if(obj === null || obj === undefined || obj === '') return param
  for(let key in obj) {
    let tempValue = obj[key]
    if(tempValue !== null && tempValue !== undefined && tempValue !== '') {
      if(typeof tempValue === 'string') {
        tempValue = tempValue.trim()
      }
      param[key] = tempValue
    }
  }
  return param
}

//处理树形结构 为页面所需结构
export function getChildrenList(data, disabledParentKey, filedKeyName = 'value') {
  return data.map(item => {
    let disabled = false
    if(disabledParentKey.includes(item.parentId)) {
      disabled = true
    }
    const returnValue = { title: item.name, [filedKeyName]: item.id, disabled: disabled }
    if(item.son) {
      returnValue.children = getChildrenList(item.son, disabledParentKey, filedKeyName)
      returnValue.length = returnValue.children.length + returnValue.children.map(item => {return item.children ? item.children.length : 0}).reduce((previousValue, currentValue) => previousValue + currentValue)
    }
    return returnValue
  })
}

export function getChildrenListId(data) {
  return data.map(item => {
    let returnValue = [item.key]
    if(item.children) {
      returnValue = returnValue.concat(...getChildrenListId(item.children))
    }
    return returnValue
  })
}

export function getFlatData(data) {
  return data.map(item => {
    let returnValue = [item]
    if(item.children) {
      const values = getFlatData(item.children)
      returnValue = returnValue.concat(...values)
    }
    return returnValue
  })

}

export function getChildrenListRemoveParentId(data, allData) {

  const flatAllData = getFlatData(allData).flat()
  const flatData = getFlatData(data).flat()
  return flatData.map(item => {
    const findItem = flatAllData.find(allItem => allItem.key === item.key)
    if(findItem && findItem.length) {
      if(findItem.length === item.length) {
        return item.key
      }
    } else {
      return item.key
    }
  }).filter(item => item)
  // return finalValue
}

//获取页面图片 初始化值
export function getPageFileListObject(needFormatFieldName, originObject) {
  const fileObject = {}
  needFormatFieldName.forEach(item => {
    const key = item + 'FileList'
    if(originObject[item]) {
      fileObject[key] = [getInitFileObject(originObject[item])]
    }
  })
  return fileObject
}

// 根据页面参数 获取请求图片url
export function getDbFileRequestFromPage(needFormatFieldName, values) {
  const fileObject = {}
  needFormatFieldName.forEach(item => {
    fileObject[item] = getFileUrlByFileList(values[item + 'FileList'])
  })
  return fileObject
}

export function getInitFileObject(fileUrl) {
  return {
    name: '',
    uid: 1,
    status: 'done',
    url: fileUrl
  }
}

export function getFileUrlByFileList(fileList) {
  if(!fileList || fileList.length === 0) {
    return
  }
  return fileList[0].url
}

export function isBase64(str) {
  if(str === '' || str.trim() === '') {
    return false
  }
  try {
    return btoa(atob(str)) === str
  } catch(err) {
    return false
  }
}

// 既然身份证号码包含出生年份，那么直接用现在的年份减去出生年份，就能直接计算出每个人的实际年龄了。
export function getAgeByIdNo(value) {
  return new Date().getFullYear() - value.slice(6, 10)
}

//仅靠身份证里面的第十七位数字，便能知道性别。即奇数代表男生，偶数就代表女生。
export function getSexByIdNo(value) {
  return (value.slice(16, 17)) % 2 === 0 ? 2 : 1
}

export function getBirthdayByIdNo(value) {
  const birthdayYear = value.slice(6, 10)
  const birthdayMonth = value.slice(10, 12)
  const birthdayDay = value.slice(12, 14)
  return birthdayYear + '-' + birthdayMonth + '-' + birthdayDay
}

export function getDefaultPasswordByIdNo(value) {
  return value.slice(-6)
}

export function isOverDate(createDate) {
  const date = new Date(createDate)
  const currentDate = new Date()
  const diffDay = parseInt((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))/*不用考虑闰年否*/
  return diffDay > 365
}

