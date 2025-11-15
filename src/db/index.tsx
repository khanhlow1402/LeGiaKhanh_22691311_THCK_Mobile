import { SQLiteDatabase } from "expo-sqlite";
import { Grocery } from "../types/grocery";

// === KHỞI TẠO BẢNG ===
export const initTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS grocery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      category TEXT,
      bought INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);
};