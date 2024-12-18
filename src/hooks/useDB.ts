import { db } from 'src/db'

const useDB = (tableName: string) => {
  const deleteOneById = async (id: string) => {
    try {
      await db.table(tableName).delete(id)
    } catch {}
  }

  const toArray = async <T>() => {
    try {
      const array = (await db.table(tableName).toArray()) as T
      return array
    } catch {}
  }

  const updateOneById = async (id: string, data: any) => {
    try {
      await db.table(tableName).update(id, data)
    } catch {}
  }

  const insertOne = async (data: any) => {
    try {
      await db.table(tableName).add(data)
    } catch {}
  }

  const getOneById = async <T>(id: string) => {
    try {
      const data = (await db.table(tableName).get(id)) as T
      return data
    } catch {}
  }

  const getAllAndOrderByUpdatedAt = async () => {
    try {
      return db.table(tableName).orderBy('updatedAt').reverse().toArray()
    } catch {}
  }

  return {
    getAllAndOrderByUpdatedAt,
    deleteOneById,
    toArray,
    updateOneById,
    insertOne,
    getOneById
  }
}

export default useDB
