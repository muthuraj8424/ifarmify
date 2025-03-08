import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/products');
                setProducts(response.data.products);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
                        <img src={product.picture} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold text-gray-800 mt-2">{product.name}</h3>
                        {/* <p className="text-lg text-green-600 font-bold">${product.price}</p> */}
                        <p className="text-sm text-gray-600">{product.quantity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsList;
