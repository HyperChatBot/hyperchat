// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import {
  SaveFileToAppDataDirRequest,
  SaveFileToAppDataDirResponse,
  SaveFileWithDialogRequest,
  SaveFileWithDialogResponse,
  TransformFilenameToSrcRequest,
  TransformFilenameToSrcResponse
} from 'src/ipc'
import { BRIDGE_NAME, IPC_NAMES } from './constants'

contextBridge.exposeInMainWorld(BRIDGE_NAME, {
  saveFileWithDialog: (
    params: SaveFileWithDialogRequest
  ): Promise<SaveFileWithDialogResponse> =>
    ipcRenderer.invoke(IPC_NAMES.saveFileWithDialog, params),
  saveFileToAppDataDir: (
    params: SaveFileToAppDataDirRequest
  ): Promise<SaveFileToAppDataDirResponse> =>
    ipcRenderer.invoke(IPC_NAMES.saveFileToAppDataDir, params),
  transformFilenameToSrc: (
    params: TransformFilenameToSrcRequest
  ): Promise<TransformFilenameToSrcResponse> =>
    ipcRenderer.invoke(IPC_NAMES.transformFilenameToSrc, params)
})
