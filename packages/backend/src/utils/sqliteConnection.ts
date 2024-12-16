import sqlite from "sqlite3"

export const makeSqliteConnection = (dbPath: string) => {
  let db: sqlite.Database | undefined

  const getDbConnection = async () => {
    if (db) {
      return db
    }

    const newDb = await new Promise<sqlite.Database>((res, rej) => {
      const newDb = new sqlite.Database(dbPath, (err) => {
        if (err) {
          console.error("Failed to connect to the database:", err.message)
          rej(err)
        } else {
          res(newDb)
        }
      })
    })
    db = newDb

    // ?
    // metaHotTeardown(() => db.close((err) => console.error(err)));

    return db
  }

  const run = async ({ query, params }: Statement) => {
    const db = await getDbConnection()

    await new Promise<void>((res, rej) => {
      db.run(query, params, (err) => {
        err ? rej(err) : res()
      })
    })
  }

  const all = async <T>({ query, params }: Statement) => {
    const db = await getDbConnection()
    // TODO err
    const result = await new Promise<Array<T>>((res, rej) =>
      db.all<T>(query, params, (err, rows) => {
        err ? rej(err) : res(rows)
      }),
    )

    return result
  }

  return {
    run,
    all,
    close: async () => {
      await new Promise<void>((res, rej) => {
        db?.close((err) => (err ? rej(err) : res()))
      })
    },
  }
}

export type Statement = {
  query: string
  params: Array<any>
}

export type SqliteConnection = ReturnType<typeof makeSqliteConnection>
