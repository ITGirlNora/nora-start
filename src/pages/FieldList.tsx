import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, InputNumber, DatePicker, Button, Table, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Condition, FieldInfo, QueryResult } from "../model/model";
import { getTableFields, queryTable } from "../api";

function getFieldInput(field: FieldInfo) {
    if (field.type.includes("int") || field.type.includes("decimal")) {
        return <InputNumber style={{ width: "100%" }} />;
    }
    if (field.type.includes("date") || field.type.includes("time")) {
        return <DatePicker showTime style={{ width: "100%" }} />;
    }
    return <Input />;
}


const FieldList = () => {
    const { tableName } = useParams<{ tableName: string }>();
    const [fields, setFields] = useState<FieldInfo[]>([]);
    const [results, setResults] = useState<QueryResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (tableName) {
            getTableFields(tableName).then(setFields);
            setResults([]);
            form.resetFields();
        }
    }, [tableName, form]);

    const handleQuery = async () => {
        const values = await form.validateFields();
        const conditions: Condition[] = Object.entries(values)
            .filter(([_, v]) => v !== undefined && v !== "")
            .map(([k, v]) => {
                let value: string | number;
                if (dayjs.isDayjs(v)) {
                    value = (v as Dayjs).format("YYYY-MM-DD HH:mm:ss");
                } else if (typeof v === "number" || typeof v === "string") {
                    value = v;
                } else {
                    value = String(v); // 兜底
                }
                return { field: k, op: "=", value };
            });
        setLoading(true);
        if (tableName) {
            queryTable({ table: tableName, conditions }).then(res => {
                setResults(res);
                setLoading(false);
            });
        }
    };

    return (
        <Card
            title={
                <Space>
                    <span>表：{tableName}</span>
                    <Button onClick={() => window.history.back()}>返回</Button>
                </Space>
            }
        >
            <Form form={form} layout="inline" style={{ marginBottom: 24 }}>
                {fields.map(field => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.comment || field.name}
                    >
                        {getFieldInput(field)}
                    </Form.Item>
                ))}
                <Form.Item>
                    <Button type="primary" onClick={handleQuery}>
                        查询
                    </Button>
                </Form.Item>
            </Form>
            <Table
                dataSource={results}
                columns={fields.map(f => ({
                    title: f.comment || f.name,
                    dataIndex: f.name,
                    key: f.name
                }))}
                rowKey={fields[0]?.name || "id"}
                loading={loading}
                pagination={false}
            />
        </Card>
    );
}
export default FieldList;