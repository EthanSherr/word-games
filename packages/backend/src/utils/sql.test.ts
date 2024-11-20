import { describe, expect, test } from "vitest";
import { sql } from "./sql";

describe("sql function", () => {
  test("separates variabels and sql", async () => {
    const id = 5;
    const name = "John";
    const { query, params } =
      sql`SELECT * FROM table WHERE id = ${id} AND name = ${name}`;

    expect(query).toEqual("SELECT * FROM table WHERE id = $1 AND name = $2");
    expect(params).toEqual([5, "John"]);
  });

  test("separates works well with arrays", async () => {
    const names = ["Ethan", "May"];
    const id = 5;
    const { query, params } =
      sql`SELECT * FROM table WHERE name in ${names} and id = ${id}`;

    expect(query).toEqual(
      "SELECT * FROM table WHERE name in ($1, $2) and id = $3",
    );
    expect(params).toEqual(["Ethan", "May", 5]);
  });
});
