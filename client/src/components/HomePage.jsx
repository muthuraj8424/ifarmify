// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { motion } from 'framer-motion';

// const HomePage = () => {
//     const navigate = useNavigate();

//     const handleButtonClick = (destination) => {
//         navigate(destination);
//     };

//     const handleLogout = async () => {
//         try {
//             await axios.post('http://localhost:5000/auth/logout'); // Server-side logout (optional)
//         } catch (error) {
//             console.error('Logout failed:', error);
//         }

//         localStorage.removeItem('token');
//         localStorage.removeItem('role');
//         localStorage.removeItem('user');

//         navigate('/');
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-300 p-6 text-center">
//             <motion.h2 
//                 className="text-5xl font-extrabold text-gray-900 mb-4"
//                 initial={{ opacity: 0, y: -50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//             >
//                 Welcome to IFarmify
//             </motion.h2>
            
//             <motion.p 
//                 className="text-lg text-gray-700 mb-6"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5, duration: 0.8 }}
//             >
//                 Connecting Farmers & Consumers Directly
//             </motion.p>
            
//             <motion.p 
//                 className="text-md text-gray-800 max-w-2xl mb-6"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7, duration: 0.8 }}
//             >
//                 At <strong>IFarmify</strong>, we bring you farm-fresh, organic, and locally sourced produce straight from farmers to your home. 
//                 No middlemen, just pure goodness at fair prices!
//             </motion.p>
            
//             <motion.div 
//                 className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.9, duration: 0.8 }}
//             >
//                 <motion.div className="p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
//                     <h3 className="text-xl font-semibold text-green-600">Fresh & Organic</h3>
//                     <p className="text-sm text-gray-600">Get naturally grown fruits, vegetables, dairy, and more directly from trusted farmers.</p>
//                 </motion.div>
//                 <motion.div className="p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
//                     <h3 className="text-xl font-semibold text-blue-600">Fair Prices for Farmers</h3>
//                     <p className="text-sm text-gray-600">We empower farmers by ensuring they receive a fair share of their hard work.</p>
//                 </motion.div>
//                 <motion.div className="p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
//                     <h3 className="text-xl font-semibold text-orange-600">Support Local Agriculture</h3>
//                     <p className="text-sm text-gray-600">Your purchase helps local farmers thrive and promotes sustainable farming.</p>
//                 </motion.div>
//                 <motion.div className="p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
//                     <h3 className="text-xl font-semibold text-purple-600">Quick & Easy Orders</h3>
//                     <p className="text-sm text-gray-600">Browse, buy, and get doorstep delivery with just a few clicks.</p>
//                 </motion.div>
//             </motion.div>
            
            
//         </div>
//     );
// };

// export default HomePage;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/auth/logout'); // Server-side logout (optional)
        } catch (error) {
            console.error('Logout failed:', error);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-blue-200 p-6 text-center">
            {/* Header */}
            <motion.h2 
                className="text-5xl font-extrabold text-gray-900 mb-3 tracking-wide"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Welcome to <span className="text-green-700">IFarmify</span>
            </motion.h2>

            <motion.p 
                className="text-lg text-gray-700 mb-4 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Connecting <strong>Farmers & Consumers</strong> directly for fresh, organic produce at fair prices.
            </motion.p>

            {/* Features Section */}
            <motion.div 
                className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
            >
                {[
                    { title: "Fresh & Organic", desc: "Get naturally grown fruits, vegetables, dairy, and more directly from trusted farmers.", color: "green-500" },
                    { title: "Fair Prices for Farmers", desc: "We empower farmers by ensuring they receive a fair share of their hard work.", color: "blue-500" },
                    { title: "Support Local Agriculture", desc: "Your purchase helps local farmers thrive and promotes sustainable farming.", color: "orange-500" },
                    { title: "Quick & Easy Orders", desc: "Browse, buy, and get doorstep delivery with just a few clicks.", color: "purple-500" }
                ].map((feature, index) => (
                    <motion.div 
                        key={index} 
                        className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 border-l-4 border-${feature.color}`}
                    >
                        <h3 className={`text-xl font-semibold text-${feature.color} mb-2`}>{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
                <button 
                    className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                    onClick={() => navigate('/marketplace')}
                >
                    Visit Marketplace
                </button>
                <button 
                    className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default HomePage;
