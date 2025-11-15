import { SQLiteDatabase } from "expo-sqlite";
import { Grocery } from "../types/grocery";

// === KHỞI TẠO BẢNG + SEED DỮ LIỆU MẪU ===
export const initTable = async (db: SQLiteDatabase) => {
  // 1. Tạo bảng grocery_items
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

  // 2. Tạo bảng categories (nếu muốn quản lý danh mục riêng)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );
  `);

  // 3. Seed dữ liệu mẫu cho grocery_items (nếu trống)
  const countResult = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM grocery_items`
  );

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
        [item.name, item.quantity, item.category ?? null, item.bought ? 1 : 0, now]
      );
    }
  }

  // 4. Seed danh mục mẫu (nếu bảng categories trống)
  const catCount = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM categories`
  );

  if (catCount && catCount.count === 0) {
    const now = Date.now();
    const sampleCategories = ["Thực phẩm", "Đồ uống", "Vệ sinh", "Khác"];

    for (const cat of sampleCategories) {
      await db.runAsync(
        `INSERT INTO categories (name, created_at) VALUES (?, ?)`,
        [cat, now]
      );
    }
  }
};

// === CREATE CATEGORY ===
export const createCategory = async (db: SQLiteDatabase, name: string) => {
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Tên danh mục không được rỗng");

  const now = Date.now();
  try {
    await db.runAsync(
      `INSERT INTO categories (name, created_at) VALUES (?, ?)`,
      [trimmedName, now]
    );
    return { success: true, message: "Tạo danh mục thành công" };
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      throw new Error("Danh mục đã tồn tại");
    }
    throw error;
  }
};

// === GET ALL CATEGORIES ===
export const getAllCategories = async (db: SQLiteDatabase): Promise<string[]> => {
  const result = await db.getAllAsync<{ name: string }>(
    `SELECT name FROM categories ORDER BY name ASC`
  );
  return result.map((row) => row.name);
};

// === DELETE CATEGORY (cẩn thận: không xóa nếu đang dùng trong grocery_items) ===
export const deleteCategory = async (db: SQLiteDatabase, name: string) => {
  await db.runAsync(`DELETE FROM categories WHERE name = ?`, [name]);
};

// === CÁC HÀM CŨ (giữ nguyên) ===
export const createGrocery = async (
  db: SQLiteDatabase,
  data: Omit<Grocery, "id" | "created_at">
) => {
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.quantity, data.category ?? null, data.bought ? 1 : 0, now]
  );
};

export const updateGrocery = async (db: SQLiteDatabase, data: Grocery) => {
  await db.runAsync(
    `UPDATE grocery_items SET name = ?, quantity = ?, category = ?, bought = ? WHERE id = ?`,
    [data.name, data.quantity, data.category ?? null, data.bought ? 1 : 0, data.id]
  );
};

export const toggleBought = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`UPDATE grocery_items SET bought = NOT bought WHERE id = ?`, [id]);
};

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

export const getGroceryById = async (
  db: SQLiteDatabase,
  id: number
): Promise<Grocery | null> => {
  return await db.getFirstAsync<Grocery>(
    `SELECT * FROM grocery_items WHERE id = ?`,
    [id]
  );
};

export const deleteGrocery = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`DELETE FROM grocery_items WHERE id = ?`, [id]);
};

