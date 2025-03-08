import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    price: 0,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
    description: "",
    picture: null,
  });

  useEffect(() => {
    // Fetch data for the dashboard when it loads
    const fetchDashboardData = async () => {
      
      try {
        const usersResponse = await axios.get(
          "https://ifarmify.onrender.com/admin/getallusers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(usersResponse.data.users);

        const productsResponse = await axios.get(
          "https://ifarmify.onrender.com/admin/products",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProducts(productsResponse.data.products);

        const ordersResponse = await axios.get(
          "https://ifarmify.onrender.com/admin/getorders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(ordersResponse.data.orders);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEditOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `https://ifarmify.onrender.com/admin/editorders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order status updated");

      // Update order status directly in the state to avoid extra re-fetch
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleEditProduct = async (productId) => {
    // Replace with actual form/modal for editing product details
    const name = prompt("Enter new product name:");
    const quantity = prompt("Enter new product quantity:");

    if (name && quantity) {
      try {
        await axios.put(
          `https://ifarmify.onrender.com/admin/editproducts/${productId}`,
          { name, quantity },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Product updated successfully");
        // Re-fetch products to get the updated list
        const productsResponse = await axios.get(
          "https://ifarmify.onrender.com/admin/products",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProducts(productsResponse.data.products);
      } catch (error) {
        console.error("Error updating product", error);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://ifarmify.onrender.com/admin/deleteproducts/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Product deleted successfully");
        // Re-fetch products after deletion
        const productsResponse = await axios.get(
          "https://ifarmify.onrender.com/admin/products",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProducts(productsResponse.data.products);
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  const handleAddProduct = async () => {
    const { name, quantity, price, description, picture } = newProduct;

    // Check if all fields are filled
    if (!name || !quantity || !price || !description || !picture) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("picture", picture); // Send the picture as part of the form data

    try {
      const response = await axios.post(
        "https://ifarmify.onrender.com/admin/products/add",
        formData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        }},
      );

      alert("Product added successfully");
      // Add new product to the products list without re-fetching all products
      setProducts([...products, response.data.product]);

      // Reset form
      setNewProduct({
        name: "",
        quantity: 0,
        price: 0,
        description: "",
        picture: null,
      });
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  const handleFileChange = (event) => {
    setNewProduct({ ...newProduct, picture: event.target.files[0] });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Admin Dashboard
      </h2>

      <div className="flex justify-between mb-6"><Link to="/UsersList" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow  hover:text-white transition">
          Users List
        </Link>
        <Link to="/ProductsManagement" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow  hover:text-white transition">
          Products
        </Link>
        <Link to="/OrdersManagement" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow  hover:text-white transition">
          Orders
        </Link>
      </div>

      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Add New Product
      </h3>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-gray-100 file:mr-2 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:rounded-lg hover:file:bg-blue-600 transition"
        />

        <button
          onClick={handleAddProduct}
          className="w-full py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition"
        >
          Add Product
        </button>
       
        {/* <h3>Users</h3>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <>
            <img
  src={`http://localhost:5000${user.profilePic}`} 
  alt={user.name} 
  style={{ width: "100px", height: "100px" }}
/>


              <li key={user._id}>
                {user.name} - {user.email}
              </li>
            </>
          ))}
        </ul>
      )} */}

        {/* <h3>Products</h3>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <div>
                <img
                  src={product.picture}
                  alt={product.name}
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
              {product.name} - {product.quantity}
              <button onClick={() => handleEditProduct(product._id)}>
                Edit
              </button>
              <button onClick={() => handleDeleteProduct(product._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )} */}

        {/* <h3>Orders</h3> */}
        {/* {loading ? (
        <p>Loading orders...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              Order ID: {order._id} - Product:{" "}
              {order.product ? order.product.name : "N/A"} - Status:{" "}
              {order.status}
              <select
                value={order.status}
                onChange={(e) =>
                  handleEditOrderStatus(order._id, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </li>
          ))}
        </ul>
      )} */}
      </div>
    </div>
  );
};

export default AdminDashboard;
