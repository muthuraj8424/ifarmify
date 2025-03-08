// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//     quantity: { type: Number, required: true },
//     address: {
//         taluk: { type: String, required: true },
//         district: { type: String, required: true },
//         pincode: { type: String, required: true },
//         villageTown: { type: String, required: true }
//     },
//     status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
//     buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// });

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    address: {
        taluk: { type: String, required: true },
        district: { type: String, required: true },
        pincode: { type: String, required: true },
        villageTown: { type: String, required: true }
    },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
