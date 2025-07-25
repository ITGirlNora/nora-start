import { Card, List, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableInfo } from "../model/model";
import { getTables } from "../api";

const TableList = () => {
    const [tables, setTables] = useState<TableInfo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTables().then(setTables);
    }, []);

    return (
        <Card title="数据库表列表">
            <List
                dataSource={tables}
                renderItem={item => (
                    <List.Item
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/table/${item.tableName}`)}
                    >
                        <Typography.Text strong>{item.tableName}</Typography.Text>
                        <span style={{ marginLeft: 16, color: "#888" }}>{item.comment}</span>
                    </List.Item>
                )}
            />
        </Card>
    );
};
export default TableList;