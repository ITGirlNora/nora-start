export interface TableInfo {
  tableName: string;
  comment: string;
}

export interface FieldInfo {
  name: string;
  type: string;
  comment: string;
}

export interface Condition {
  field: string;
  op: string;
  value: string | number | string[];
}

export type QueryResult = Record<string, any>;