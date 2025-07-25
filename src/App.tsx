import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import TableList from './pages/TableList';
import FieldQuery from './pages/FieldQuery';

function App() {
  return (
     <BrowserRouter>
      <Layout style={{ minHeight: "100vh", padding: 24 }}>
        <Routes>
          <Route path="/" element={<TableList />} />
           <Route path="/table/:tableName" element={<FieldQuery />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
