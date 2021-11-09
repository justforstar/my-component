import React, { useState, useEffect, useCallback } from 'react'

const useFetch = (param, fetcher, options) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(undefined)
  const [isError, setIsError] = useState(false)
  const request = useCallback(async() => {
    setLoading(true)
    try {
      const { data } = await fetcher(param)
      options.onSuccess && options.onSuccess(data, param)
      // unstable_batchedUpdates(() => {
      setData(data)
      // })
    } catch(error) {
      setIsError(true)
      options.onError && options.onError(error, param)
    }
    setLoading(false)
  }, Object.values(param))
  useEffect(() => {
    request()
  }, Object.values(param))
  return { data, loading, isError, request }
}

export default useFetch
