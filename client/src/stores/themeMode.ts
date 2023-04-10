import { atom } from 'recoil'
import type { PaletteMode } from '@mui/material'

const setDefaultThemeMode = () => {
    const cachedThemeMode = window.localStorage.getItem('global_theme_mode')

    if (cachedThemeMode === 'dark' || cachedThemeMode === 'light') {
        return cachedThemeMode
    }

    return new Date().getHours() >= 18 ? 'dark' : 'light'
}

export const themeModeState = atom<PaletteMode>({
    key: 'ThemeModeState',
    default: setDefaultThemeMode()
})
