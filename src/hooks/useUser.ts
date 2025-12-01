import req from '@/src/libs/req'
import { useUserState } from '../store/useStore'
import { useCallback, useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function useUser() {
  const [user, setUser] = useUserState()

  const getUserInfo = async (userId?: string) => {
    const res = await req.get(`/users/${userId || ''}`)
    setUser(res)
    return res
  }

  const createUser = async () => {
    const res = await req.post('/users', {
      password: '123456',
    })
    await updateUserAttr(
      {
        current_index: 1000,
        money: 1000,
      },
      res.user_id,
    )
    localStorage.setItem('userToken', res.username)
  }

  const updateUserAttr = async (params: Record<string, any>, id?: string) => {
    await req.put(`/users/${id || user.user.user_id}`, {
      attribute: {
        ...user.attributes,
        ...params,
      },
    })
    setUser({
      ...user,
      attributes: {
        ...user.attributes,
        ...params,
      },
    })
  }

  const initUser = async () => {
    const userToken = localStorage.getItem('userToken')
    if (userToken && !user?.user?.user_id) {
      getUserInfo(userToken)
    } else {
      createUser()
    }
  }

  useEffect(() => {}, [])

  return {
    getUserInfo,
    createUser,
    updateUserAttr,
    initUser,
    user,
  }
}
