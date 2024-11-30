import { sql } from "../utils/sql"
import { SqliteConnection } from "../utils/sqliteConnection"

export const makeUserStoreAdapter = (sqliteService: SqliteConnection) => {
  const init = async () => {
    // Migrate create talbe users
    await sqliteService.run(sql`
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          receiveDailyNotification BOOLEAN NOT NULL DEFAULT 0
      );`)
  }

  const setReceiveDailyNotification = async (email: string, value: boolean) => {
    // TODO err? have unique constr on email...
    await sqliteService.run(sql`
      INSERT OR REPLACE INTO users (email, receiveDailyNotification)
      VALUES (${email}, ${value});
    `)
  }

  const getAllNotifiableUsers = async () => {
    // TODO CHECK ERR
    const rows = await sqliteService.all<{ email: string }>(sql`
      SELECT email
      FROM users
      WHERE receiveDailyNotification = 1
    `)
    // TODO errcheck
    return rows
  }

  return {
    init,
    setReceiveDailyNotification,
    getAllNotifiableUsers,
  }
}
