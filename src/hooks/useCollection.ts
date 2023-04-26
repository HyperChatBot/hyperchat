import { db } from 'src/db'

const useCollection = <T>(collectionName: string) =>
  db.collections[collectionName]

export default useCollection
