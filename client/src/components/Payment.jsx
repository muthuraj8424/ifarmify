import React, { useState } from 'react';  
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Payment = () => {
    const navigate = useNavigate();
    const { userId, orderId } = useParams(); // Extract userId and orderId from URL
    
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [transactionId] = useState('txn_1234567890'); // Example transaction ID
    const [amount, setAmount] = useState(''); // Allow user to fill in the amount

    // Fetch the user's token
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must be logged in to make a payment.');
        navigate('/login'); // Redirect to login if no token is found
        return null;
    }

    const handlePayment = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const paymentDetails = {
            amount: parseFloat(amount), // Convert to number
            paymentMethod,
            transactionId
        };

        axios.post(`http://localhost:5000/payment/pay/${userId}/${orderId}`, paymentDetails, {
            headers: {
                Authorization: `Bearer ${token}` // Include token in Authorization header for payment
            }
        })
        .then(response => {
            alert('Payment processed successfully!');
            navigate(`/order-confirmation/${orderId}`);
        })
        .catch(error => {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
        });
    };

    return (
        <div>
            <h1>Payment Page</h1>
            <h2>Order ID: {orderId}</h2>

            {/* Amount input */}
            <div>
                <h3>Enter Payment Amount</h3>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="0.01" // Minimum value
                    step="0.01" // Decimal step
                    required
                />
            </div>

            <p>Total Price: ${amount}</p>

            {/* Payment Method Selection */}
            <div>
                <h3>Select Payment Method</h3>
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                    />
                    Credit Card
                </label>
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                    />
                    PayPal
                </label>
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                    />
                    Bank Transfer
                </label>
            </div>

            <button onClick={handlePayment}>Complete Payment</button>
        </div>
    );
};

export default Payment;











// import React, { useState } from 'react'; 
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';

// const Payment = () => {
//     const navigate = useNavigate();
//     const { userId, orderId } = useParams(); // Extract userId and orderId from URL
//     const [paymentMethod, setPaymentMethod] = useState('credit_card');
//     const [transactionId, setTransactionId] = useState('txn_1234567890'); // Example transaction ID
//     const [amount, setAmount] = useState(1000000000000000.00); // Set amount directly

//     // Fetch the user's token
//     const token = localStorage.getItem('token');

//     if (!token) {
//         alert('You must be logged in to make a payment.');
//         navigate('/login'); // Redirect to login if no token is found
//         return null;
//     }

//     const handlePayment = () => {
//         const paymentDetails = {
//             amount,
//             paymentMethod,
//             transactionId
//         };

//         axios.post(`http://localhost:5000/payment/pay/${userId}/${orderId}`, paymentDetails, {
//             headers: {
//                 Authorization: `Bearer ${token}` // Include token in Authorization header for payment
//             }
//         })
//         .then(response => {
//             alert('Payment processed successfully!');
//             navigate(`/order-confirmation/${orderId}`);
//         })
//         .catch(error => {
//             console.error('Error processing payment:', error);
//             alert('Payment failed. Please try again.');
//         });
//     };

//     return (
//         <div>
//             <h1>Payment Page</h1>
//             <h2>Order ID: {orderId}</h2>
//             <p>Total Price: ${amount}</p>

//             {/* Payment Form */}
//             <div>
//                 <h3>Select Payment Method</h3>
//                 <label>
//                     <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="credit_card"
//                         checked={paymentMethod === 'credit_card'}
//                         onChange={() => setPaymentMethod('credit_card')}
//                     />
//                     Credit Card
//                 </label>
//                 <label>
//                     <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="paypal"
//                         checked={paymentMethod === 'paypal'}
//                         onChange={() => setPaymentMethod('paypal')}
//                     />
//                     PayPal
//                 </label>
//                 <label>
//                     <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="bank_transfer"
//                         checked={paymentMethod === 'bank_transfer'}
//                         onChange={() => setPaymentMethod('bank_transfer')}
//                     />
//                     Bank Transfer
//                 </label>
//             {/* </div> */}

//             {/* Transaction ID - Mock */}
//             {paymentMethod === 'credit_card' && (
//                 <div>
//                     <h3>Enter Credit Card Details</h3>
//                     <input
//                         type="text"
//                         placeholder="Card Number"
//                         maxLength="16"
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="MM/YY Expiry Date"
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="CVV"
//                         maxLength="3"
//                         required
//                     />
//                 </div>
//             )}

//             <button onClick={handlePayment}>Complete Payment</button>
//         </div>
//     );
// };

// export default Payment;
