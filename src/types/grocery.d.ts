export type Grocery = {
  id: number;
  name: string;
  quantity: number;
  category: string | null;
  bought: boolean;
  created_at: number;
};