import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import MyOrders from "./pages/MyOrders";
import  AddEditOrder  from "./pages/AddEditOrder";
import "./styles.css";


function App() {


  return (
    <>
      <div>
        
        <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/my-orders" replace />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="add-order" element={<AddEditOrder />} />
        <Route path="add-order/:id" element={<AddEditOrder />} />
      </Route>
    </Routes>


      </div>

    </>
  )
}

export default App
