import { Condition, FieldInfo, QueryResult, TableInfo } from "../model/model";

export function getTables(): Promise<TableInfo[]> {
  return Promise.resolve([
    { tableName: "users", comment: "用户表" },
    { tableName: "orders", comment: "订单表" }
  ]);
}

export function getTableFields(tableName: string): Promise<FieldInfo[]> {
  const fields: Record<string, FieldInfo[]> = {
    users: [
      { name: "id", type: "int", comment: "主键" },
      { name: "username", type: "varchar", comment: "用户名" },
      { name: "created_at", type: "datetime", comment: "创建时间" }
    ],
    orders: [
      { name: "order_id", type: "int", comment: "订单号" },
      { name: "amount", type: "decimal", comment: "金额" },
      { name: "created_at", type: "datetime", comment: "下单时间" }
    ]
  };
  return Promise.resolve(fields[tableName] || []);
}

export function queryTable(params: { table: string; conditions: Condition[] }): Promise<QueryResult[]> {
  if (params.table === "users") {
    return Promise.resolve([
      { id: 1, username: "张三", created_at: "2024-02-01 10:00:00" },
      { id: 2, username: "李四", created_at: "2024-03-01 11:00:00" }
    ]);
  }
  if (params.table === "orders") {
    return Promise.resolve([
      { order_id: 1001, amount: 200, created_at: "2024-04-01 12:00:00" }
    ]);
  }
  return Promise.resolve([]);
}