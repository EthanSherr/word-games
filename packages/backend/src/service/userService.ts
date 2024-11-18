import { makeSqliteService } from "./sqliteService";
import { sql } from "../utils/sql";

export const makeUserService = (
  sqliteService = makeSqliteService("./storage/db.sqlite"),
) => {
  const init = async () => {
    // Migrate create talbe users
    await sqliteService.run(sql`
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          receiveDailyNotification BOOLEAN NOT NULL DEFAULT 0
      );`);
  };

  const signupForNotifications = async (email: string) => {
    // TODO err? have unique constr on email...
    await sqliteService.run(sql`
      INSERT INTO users (email, receiveDailyNotification)
      VALUES (${email}, ${true})
    `);
  };

  const getAllNotifiableUsers = async () => {
    // TODO CHECK ERR
    const rows = await sqliteService.all<{ email: string }>(sql`
      SELECT email
      FROM users
      WHERE receiveDailyNotification = 1
    `);
    // TODO errcheck
    return rows;
  };

  return {
    init,
    signupForNotifications,
    getAllNotifiableUsers,
  };
};
