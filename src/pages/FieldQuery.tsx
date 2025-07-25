import { message, Card, Space, Button, Select, Input, Table, Form } from "antd";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTableFields, queryTable } from "../api";
import { FieldInfo, Condition } from "../model/model";

const operatorOptions = [
  { label: "等于", value: "=" },
  { label: "包含", value: "LIKE" },
  { label: "IN", value: "IN" },
  { label: "大于", value: ">" },
  { label: "小于", value: "<" }
];

const FieldQuery = () => {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  const [fields, setFields] = useState<FieldInfo[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([
    { field: "", op: "=", value: "" }
  ]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tableName) {
      getTableFields(tableName).then(setFields);
      setResults([]);
      setConditions([{ field: "", op: "=", value: "" }]);
    }
  }, [tableName]);

  const handleConditionChange = (idx: number, key: keyof Condition, value: any) => {
    const newConds = [...conditions];
    newConds[idx][key] = value;
    setConditions(newConds);
  };

  const addCondition = () => setConditions([...conditions, { field: "", op: "=", value: "" }]);
  const removeCondition = (idx: number) => setConditions(conditions.filter((_, i) => i !== idx));

  const handleQuery = async () => {
    const validConds = conditions.filter(c => c.field && c.op && c.value !== "");
    if (validConds.length === 0) {
      message.warning("请至少填写一个完整的查询条件！");
      return;
    }
    const conds = validConds.map(c => {
      let value: string | number | string[] = c.value;
      if (c.op === "LIKE") value = `%${value}%`;
      if (c.op === "IN" && typeof value === "string") value = value.split(",").map(v => v.trim());
      return { ...c, value };
    });
    setLoading(true);
    try {
      const res = await queryTable({ table: tableName!, conditions: conds });
      setResults(res);
    } catch (e) {
      message.error("查询失败，请检查后端服务和条件！");
    }
    setLoading(false);
  };

  return (
    <Card
      title={
        <Space>
          <span>表：{tableName}</span>
          <Button onClick={() => navigate(-1)}>返回</Button>
        </Space>
      }
    >
      <Form layout="inline">
        {conditions.map((cond, idx) => (
          <Space key={idx} style={{ marginBottom: 8 }}>
            <Select
              style={{ width: 120 }}
              placeholder="字段"
              value={cond.field}
              onChange={v => handleConditionChange(idx, "field", v)}
              options={fields.map(f => ({ label: f.comment || f.name, value: f.name }))}
            />
            <Select
              style={{ width: 100 }}
              placeholder="操作符"
              value={cond.op}
              onChange={v => handleConditionChange(idx, "op", v)}
              options={operatorOptions}
            />
            <Input
              style={{ width: 150 }}
              placeholder={cond.op === "IN" ? "用逗号分隔" : "值"}
              value={cond.value}
              onChange={e => handleConditionChange(idx, "value", e.target.value)}
            />
            <Button onClick={() => removeCondition(idx)} disabled={conditions.length === 1}>删除</Button>
          </Space>
        ))}
        <Button onClick={addCondition}>添加条件</Button>
        <Button type="primary" onClick={handleQuery} loading={loading}>查询</Button>
      </Form>
      <Table
        style={{ marginTop: 24 }}
        dataSource={results}
        columns={fields.map(f => ({
          title: f.comment || f.name,
          dataIndex: f.name,
          key: f.name
        }))}
        rowKey={fields[0]?.name || "id"}
        pagination={false}
      />
    </Card>
  );
};

export default FieldQuery;