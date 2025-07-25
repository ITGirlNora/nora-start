import axios from "axios";
import { Condition, FieldInfo, QueryResult, TableInfo } from "../model/model";

const api = axios.create({
  baseURL: "http://localhost:8081/db",
  timeout: 60000,
});

// 获取所有表
export async function getTables(): Promise<TableInfo[]> {
  const res = await api.get<TableInfo[]>("/tables");
  return res.data;
}

// 获取表字段
export async function getTableFields(tableName: string): Promise<FieldInfo[]> {
  const res = await api.get<FieldInfo[]>("/metadata", { params: { table: tableName } });
  return res.data;
}

// 查询表数据
export async function queryTable(params: { table: string; conditions: Condition[] }): Promise<QueryResult[]> {
  const res = await api.post<QueryResult[]>("/query", params);
  return res.data;
}