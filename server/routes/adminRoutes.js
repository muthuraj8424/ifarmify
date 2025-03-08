const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Required for folder checks
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Middleware to check admin access
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};

// Fetch All Users (Admin Only)
router.get('/getallusers', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const users = await User.find();
        if (!users.length) return res.status(404).json({ message: 'No users found.' });
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        const updatedProducts = products.map(product => ({
            ...product._doc,
            picture: product.picture ? `http://localhost:5000/uploads/${product.picture}` : null
        }));
        res.status(200).json({ products: updatedProducts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Add Product with Image Upload
router.post('/products/add', authMiddleware, isAdmin, upload.single('picture'), async (req, res) => {
    const { name, quantity } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Picture is required' });

    try {
        const product = new Product({
            name,
            quantity,
            picture: req.file.filename // Save only filename
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Product
router.put('/editproducts/:id', authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Product
router.delete('/deleteproducts/:id', authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/getorders', authMiddleware, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'products.product', // Populate the product inside the array
                model: 'Product' // Ensure it references the correct model
            })
            .populate('buyer'); // Populate buyer details

        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update Order Status
router.put('/editorders/:id', authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;












// const express = require('express');
// const router = express.Router();
// const multer = require('multer'); // Import multer
// const path = require('path');
// const Product = require('../models/Product');
// const Order = require('../models/Order');
// const User = require('../models/User'); // Add this line
// const authMiddleware = require('../middleware/authMiddleware');
// const adminMiddleware = require('../middleware/adminMiddleware');


// // Multer setup: Destination and filename for uploaded files
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads'); // Save uploaded files in 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });

// // Create multer upload instance with the storage settings
// const upload = multer({ storage: storage });

// // Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//     console.log("User Role:", req.user.role); // Debug log
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Access denied. Admins only.' });
//     }
//     next();
// };

// // Fetch All Users (admin only)
// router.get('/getallusers', [authMiddleware, adminMiddleware], async (req, res) => {
//     try {
//         const users = await User.find(); // Fetch all users from the database
//         if (!users || users.length === 0) {
//             return res.status(404).json({ message: 'No users found.' });
//         }
//         res.status(200).json({ users });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Fetch All Products
// router.get('/products', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json({ products });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


// // Add Product with file upload (using multer)
// router.post('/products/add', authMiddleware, isAdmin, upload.single('picture'), async (req, res) => {
//     const { name, quantity } = req.body;
//     const picture = req.file; // Multer attaches the uploaded file to req.file

//     if (!name || !quantity || !picture) {
//         return res.status(400).json({ error: 'All fields are required including picture' });
//     }

//     try {
//         const product = new Product({
//             name,
//             quantity,
//             picture: picture.path, // Save the file path in the database
//         });
//         await product.save();
//         res.status(201).json({ message: 'Product added successfully', product });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Edit Product
// router.put('/editproducts/:id', authMiddleware, isAdmin, async (req, res) => {
//     const { id } = req.params;
//     try {
//         const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
//         res.status(200).json({ message: 'Product updated successfully', product });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Delete Product
// router.delete('/deleteproducts/:id', authMiddleware, isAdmin, async (req, res) => {
//     const { id } = req.params;
//     try {
//         await Product.findByIdAndDelete(id);
//         res.status(200).json({ message: 'Product deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Fetch Orders
// router.get('/getorders', authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const orders = await Order.find().populate('product').populate('buyer');
//         res.status(200).json({ orders });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Update Order Status (Only for Admin to update order status)
// router.put('/editorders/:id', authMiddleware, isAdmin, async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body; // Expected values for status could be 'shipped', 'delivered', etc.
    
//     try {
//         const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.status(200).json({ message: 'Order status updated successfully', order });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
// module.exports = router;













// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');
// const Order = require('../models/Order');
// const User = require('../models/User');  // Add this line
// const authMiddleware = require('../middleware/authMiddleware');
// const adminMiddleware = require('../middleware/adminMiddleware'); 


// // Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//     console.log("User Role:", req.user.role); // Debug log
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Access denied. Admins only.' });
//     }
//     next();
// };

// // Fetch All Users (admin only)
// router.get('/getallusers', [authMiddleware, adminMiddleware], async (req, res) => {
//     try {
//         const users = await User.find(); // Fetch all users from the database
//         if (!users || users.length === 0) {
//             return res.status(404).json({ message: 'No users found.' });
//         }
//         res.status(200).json({ users });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Fetch All Products
// router.get('/products', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json({ products });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Add Product
// router.post('/products/add', authMiddleware, isAdmin, async (req, res) => {
//     const { name, picture, quantity } = req.body;
//     try {
//         const product = new Product({ name, picture, quantity });
//         await product.save();
//         res.status(201).json({ message: 'Product added successfully', product });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Edit Product
// router.put('/editproducts/:id', authMiddleware, isAdmin, async (req, res) => {
//     const { id } = req.params;
//     try {
//         const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
//         res.status(200).json({ message: 'Product updated successfully', product });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Delete Product
// router.delete('/deleteproducts/:id', authMiddleware, isAdmin, async (req, res) => {
//     const { id } = req.params;
//     try {
//         await Product.findByIdAndDelete(id);
//         res.status(200).json({ message: 'Product deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Fetch Orders
// router.get('/getorders', authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const orders = await Order.find().populate('product').populate('buyer');
//         res.status(200).json({ orders });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Update Order Status (Only for Admin to update order status)
// router.put('/editorders/:id', authMiddleware, isAdmin, async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body; // Expected values for status could be 'shipped', 'delivered', etc.
    
//     try {
//         const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.status(200).json({ message: 'Order status updated successfully', order });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
// module.exports = router;