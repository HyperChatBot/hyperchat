import { db } from 'src/db'

const useCollection = <T>(collectionName: string) => {
  const collection = db.collections[collectionName]

  if (!collection) {
    throw new Error('')
  }

  return collection
}

export default useCollection
