/** 使用 jotai 管理主题状态 */
import { atom, useAtom, useAtomValue } from 'jotai'

export const userState = atom<Record<string, any>>({})

export const useUserState = () => {
  return useAtom(userState)
}

export const useUserValue = () => {
  return useAtomValue(userState)
}
