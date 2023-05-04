import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { themeModeState } from 'src/stores/global'
import { ThemeMode } from 'src/types/global'

const useTheme = () => {
  const [theme, setTheme] = useRecoilState(themeModeState)

  const setLight = () => {
    setTheme(ThemeMode.light)
    document.documentElement.classList.remove(ThemeMode.dark)
  }

  const setDark = () => {
    setTheme(ThemeMode.dark)
    document.documentElement.classList.add(ThemeMode.dark)
  }

  const setThemeBySystem = (isDark: boolean) => {
    if (isDark) {
      setDark()
    } else {
      setLight()
    }
  }

  const setStateAndClassList = (currTheme: ThemeMode) => {
    if (currTheme === ThemeMode.dark) {
      setDark()
    } else if (currTheme === ThemeMode.light) {
      setLight()
    } else {
      setThemeBySystem(
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
    }
  }

  const toggleTheme = (newTheme: ThemeMode) => {
    localStorage.theme = newTheme
    setStateAndClassList(newTheme)
  }

  const onSystemThemeChange = (e: MediaQueryListEvent) => {
    if (localStorage.theme !== ThemeMode.system) return
    setThemeBySystem(e.matches)
  }

  useEffect(() => {
    setStateAndClassList(localStorage.theme)
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
