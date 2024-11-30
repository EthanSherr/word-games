import fs from "fs/promises"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { sql } from "./sql"
import { makeSqliteConnection, SqliteConnection } from "./sqliteConnection"

const testDbPath = "./storage/test.db"
const users = [
  {
    name: "ethan",
    email: "esherrthan@gmail.com",
  },
  {
    name: "may",
    email: "maykhine@yahoo.com",
  },
]

describe("sqliteService", () => {
  let sqliteService: SqliteConnection
  beforeEach(async () => {
    sqliteService = makeSqliteConnection(testDbPath)

    const x = sql`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );`

    await sqliteService.run(sql`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );`)
  })

  afterEach(async () => {
    sqliteService.close()
    await fs.unlink(testDbPath)
  })

  afterEach(async () => {})

  test("it can create a db and select things from it", async () => {
    for (const { email, name } of users) {
      await sqliteService.run(sql`
        INSERT INTO users (email, name)
        VALUES (${email}, ${name})
      `)
    }

    const results = await sqliteService.all<{
      name: string
      email: string
    }>(sql`
      SELECT email, name
      FROM users
    `)

    expect(results).toEqual(users)
  })

  test("it filters correctly", async () => {
    for (const { email, name } of users) {
      await sqliteService.run(sql`
        INSERT INTO users (email, name)
        VALUES (${email}, ${name})
      `)
    }

    const results = await sqliteService.all<{
      name: string
      email: string
    }>(sql`
      SELECT email, name
      FROM users
      WHERE email LIKE '%yahoo.com'
    `)

    expect(results).toEqual([
      {
        name: "may",
        email: "maykhine@yahoo.com",
      },
    ])
  })
})
