import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/getorders',{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                      }});
                setOrders(response.data.orders);
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/admin/editorders/${orderId}`, { status: newStatus },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                  }});
            setOrders((prevOrders) => 
                prevOrders.map((order) => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        // <div className="p-6">
        //     <h2 className="text-3xl font-bold text-gray-900 mb-4">Orders</h2>
        //     <table className="w-full border-collapse border border-gray-300">
        //         <thead>
        //             <tr className="bg-gray-100">
        //                 <th className="border p-2">Order ID</th>
        //                 <th className="border p-2">Customer</th>
        //                 <th className="border p-2">Total</th>
        //                 <th className="border p-2">Status</th>
        //                 <th className="border p-2">Actions</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {orders.map((order) => (
        //                 <tr key={order._id} className="text-center">
        //                     <td className="border p-2">{order._id}</td>
        //                     <td className="border p-2">{order.buyer.name}</td>
        //                     <td className="border p-2">${order.total}</td>
        //                     <td className="border p-2">{order.status}</td>
        //                     <td className="border p-2">
        //                         <select 
        //                             className="p-2 border rounded" 
        //                             value={order.status} 
        //                             onChange={(e) => updateOrderStatus(order._id, e.target.value)}
        //                         >
        //                             <option value="Pending">Pending</option>
        //                             <option value="Shipped">Shipped</option>
        //                             <option value="Delivered">Delivered</option>
        //                         </select>
        //                     </td>
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
        <div className="p-6 bg-green-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Orders</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.buyer.name}</td>
                <td className="border p-2">${order.total}</td>
                 <td className="border p-2">{order.status}</td>

                <td className="border p-2">
                  <select
                    className="p-2 border rounded"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        
    );
};

export default OrdersList;
