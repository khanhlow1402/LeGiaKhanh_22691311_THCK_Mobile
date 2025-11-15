import { SQLiteDatabase } from "expo-sqlite";
import { Grocery } from "../types/grocery";

// === KHỞI TẠO BẢNG + SEED DỮ LIỆU MẪU ===
export const initTable = async (db: SQLiteDatabase) => {
  // 1. Tạo bảng nếu chưa có
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

  // 2. Kiểm tra bảng có dữ liệu chưa
  const countResult = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM grocery_items`
  );

  // 3. Nếu trống → seed 3 bản ghi mẫu
  if (countResult && countResult.count === 0) {
    const now = Date.now();

    const sampleData: Omit<Grocery, "id" | "created_at">[] = [
      { name: "Sữa", quantity: 2, category: "Thực phẩm", bought: false },
      { name: "Trứng", quantity: 10, category: "Thực phẩm", bought: false },
      { name: "Bánh mì", quantity: 1, category: "Thực phẩm", bought: true },
    ];

    for (const item of sampleData) {
      await db.runAsync(
        `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          item.name,
          item.quantity,
          item.category ?? null,
          item.bought ? 1 : 0,
          now,
        ]
      );
    }
  }
};

// === TOGGLE BOUGHT ===
export const toggleBought = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(
    `UPDATE grocery_items SET bought = NOT bought WHERE id = ?`,
    [id]
  );
};

// === GET ALL (có thể lọc theo bought) ===
export const getAllGroceries = async (
  db: SQLiteDatabase,
  filter?: { bought?: boolean }
): Promise<Grocery[]> => {
  let query = `SELECT * FROM grocery_items`;
  const params: any[] = [];

  if (filter?.bought !== undefined) {
    query += ` WHERE bought = ?`;
    params.push(filter.bought ? 1 : 0);
  }

  query += ` ORDER BY created_at DESC`;

  return await db.getAllAsync<Grocery>(query, params);
};

// === GET BY ID ===
export const getGroceryById = async (
  db: SQLiteDatabase,
  id: number
): Promise<Grocery | null> => {
  return await db.getFirstAsync<Grocery>(
    `SELECT * FROM grocery_items WHERE id = ?`,
    [id]
  );
};

// === DELETE (hard delete) ===
export const deleteGrocery = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`DELETE FROM grocery_items WHERE id = ?`, [id]);
};