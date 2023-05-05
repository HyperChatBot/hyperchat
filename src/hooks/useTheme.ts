import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { themeModeToTheme } from 'src/shared/utils'
import { themeState } from 'src/stores/global'
import { ThemeMode } from 'src/types/global'
import useSettings from './useSettings'

const useTheme = () => {
  const { settings, updateSettings } = useSettings()
  const [theme, setTheme] = useRecoilState(themeState)

  const setThemeClass = (currTheme: ThemeMode.light | ThemeMode.dark) => {
    if (currTheme === ThemeMode.dark) {
      document.documentElement.classList.add(ThemeMode.dark)
    } else {
      document.documentElement.classList.remove(ThemeMode.dark)
    }
  }

  const setThemeStateAndClass = (newTheme?: ThemeMode) => {
    const currTheme = themeModeToTheme(newTheme || settings?.theme_mode)
    setTheme(currTheme)
    setThemeClass(currTheme)
  }

  const toggleTheme = (newTheme: ThemeMode) => {
    setThemeStateAndClass(newTheme)

    if (settings) {
      updateSettings({ ...settings, theme_mode: newTheme })
    }
  }

  const onSystemThemeChange = (e: MediaQueryListEvent) => {
    if (settings?.theme_mode !== ThemeMode.system) return
    setThemeStateAndClass()
  }

  useEffect(() => {
    setThemeStateAndClass()
  }, [])

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme:dark)')
      .addEventListener('change', onSystemThemeChange)

    return () => {
      window
        .matchMedia('(prefers-color-scheme:dark)')
        .removeEventListener('change', onSystemThemeChange)
    }
  }, [])

  return { theme, toggleTheme }
}

export default useTheme
