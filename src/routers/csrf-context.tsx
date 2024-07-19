import { mainApi } from '@/services'
import { getCookie } from '@/utils/cookie'
import React, { useEffect } from 'react'

export const CsrfProvider = ({ children }: any) => {
  useEffect(() => {
    const initializeCsrfToken = async () => {
      const _csrf = getCookie('_csrf')
      if (!_csrf || _csrf === '') { await mainApi.csrfToken() }
    }
    setTimeout(function () {
      initializeCsrfToken()
    }, 100)
  }, [])

  return (
    <>
      {children}
    </>
  )
}
