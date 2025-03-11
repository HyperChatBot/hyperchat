import { Settings } from '@/types/settings'
import { atom } from 'jotai'

export const settingsAtom = atom<Settings | undefined>(undefined)

export const loadingAtom = atom(false)

export const settingsDialogVisibleAtom = atom(false)

export const customBotAvatarUrlAtom = atom('')
