import { atom, selector } from 'recoil'
import { themeModeToTheme } from 'src/shared/utils'
import { Products, ThemeMode } from 'src/types/global'
import items from 'src/components/Sidebar/Items'

export const onlineState = atom({
  key: 'OnlineState',
  default: window.navigator.onLine
})

export const currProductState = atom({
  key: 'CurrProduct',
  default:
    (window.localStorage.getItem('currProductState') as Products) ||
    Products.ChatCompletion
})

export const themeState = atom<ThemeMode.dark | ThemeMode.light>({
  key: 'Theme',
  default: themeModeToTheme()
})

export const configurationDrawerVisibleState = atom({
  key: 'ConfigurationDrawerVisible',
  default: false
})

export const metaOfCurrProductSelector = selector({
  key: 'metaOfCurrProduct',
  get: ({ get }) => items.find(
    (item) => item.product === get(currProductState)
  )
})
