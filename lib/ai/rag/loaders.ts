import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

export const loadPDF = async (pdfFile: Blob) => {
  const loader = new PDFLoader(pdfFile)
  const docs = await loader.load()
  return docs
}
