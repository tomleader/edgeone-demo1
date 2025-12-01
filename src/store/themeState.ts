/** 使用 jotai 管理主题状态 */
import { atom, useAtom, useAtomValue } from 'jotai'

export const themeState = atom<'light' | 'dark'>('light')
export const useThemeState = () => {
  return useAtom(themeState)
}
export const useThemeValue = () => {
  return useAtomValue(themeState)
}
