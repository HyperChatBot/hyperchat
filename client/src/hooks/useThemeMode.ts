import { useRecoilState } from 'recoil'
import { themeModeState } from 'src/stores/themeMode'

const useThemeMode = () => {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState)

  const toggleThemeMode = () => {
    if (themeMode === 'light') {
      setThemeMode('dark')
      window.localStorage.setItem('global_theme_mode', 'dark')
    } else {
      setThemeMode('light')
      window.localStorage.setItem('global_theme_mode', 'light')
    }
  }

  return { themeMode, toggleThemeMode }
}

export default useThemeMode