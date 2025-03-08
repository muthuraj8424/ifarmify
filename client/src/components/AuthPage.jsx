import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        if (profilePic) {
            formData.append('profilePic', profilePic);
        }

        try {
            await axios.post('http://localhost:5000/auth/signup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            handleLogin(e);
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">{isSignup ? 'Signup' : 'Login'}</h2>
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
                    {isSignup && (
                        <>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfilePic(e.target.files[0])}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {isSignup && (
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                        {isSignup ? 'Signup' : 'Login'}
                    </button>
                </form>
                <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="w-full mt-4 text-blue-600 hover:underline text-sm"
                >
                    {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AuthPage = () => {
//     const [isSignup, setIsSignup] = useState(false);
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('customer');
//     const [profilePic, setProfilePic] = useState(null); // State to store the selected file
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     // Check if the user is already logged in
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             navigate('/home'); // Redirect to home if already logged in
//         }
//     }, [navigate]);

//     // Handle login
//     const handleLogin = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:5000/auth/login', {
//                 email,
//                 password,
//             });

//             // Store token, role, and user in localStorage
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('role', response.data.user.role);
//             localStorage.setItem('user', JSON.stringify(response.data.user));

//             navigate('/home'); // Redirect to home after login
//         } catch (err) {
//             setError(err.response?.data?.error || 'Login failed');
//         }
//     };

//     // Handle signup
//     const handleSignup = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('email', email);
//         formData.append('password', password);
//         formData.append('role', role);
//         if (profilePic) {
//             formData.append('profilePic', profilePic); // Add profile picture file
//         }

//         try {
//             const response = await axios.post('http://localhost:5000/auth/signup', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             // On successful signup, automatically log in the user
//             const loginResponse = await axios.post('http://localhost:5000/auth/login', {
//                 email,
//                 password,
//             });

//             // Store token, role, and user in localStorage
//             localStorage.setItem('token', loginResponse.data.token);
//             localStorage.setItem('role', loginResponse.data.user.role);
//             localStorage.setItem('user', JSON.stringify(loginResponse.data.user));

//             navigate('/home'); // Redirect to home after signup
//         } catch (err) {
//             setError(err.response?.data?.error || 'Signup failed');
//         }
//     };

//     return (
//         <div>
//             <h2>{isSignup ? 'Signup' : 'Login'}</h2>
//             <form onSubmit={isSignup ? handleSignup : handleLogin}>
//                 {isSignup && (
//                     <>
//                         <input
//                             type="text"
//                             placeholder="Name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             required
//                         />
//                         {/* Profile picture upload */}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setProfilePic(e.target.files[0])}
//                         />
//                     </>
//                 )}
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 {isSignup && (
//                     <select value={role} onChange={(e) => setRole(e.target.value)}>
//                         <option value="customer">Customer</option>
//                         <option value="admin">Admin</option>
//                     </select>
//                 )}
//                 {error && <p>{error}</p>}
//                 <button type="submit">{isSignup ? 'Signup' : 'Login'}</button>
//             </form>
//             <button onClick={() => setIsSignup(!isSignup)}>
//                 {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
//             </button>
//         </div>
//     );
// };

// export default AuthPage;








// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AuthPage = () => {
//     const [isSignup, setIsSignup] = useState(false);
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('customer');
//     const [profilePic, setProfilePic] = useState(null); // State to store the selected file
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     // Handle login
//     const handleLogin = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:5000/auth/login', {
//                 email,
//                 password,
//             });

//             // Store token, role, and user in localStorage
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('role', response.data.user.role);
//             localStorage.setItem('user', JSON.stringify(response.data.user));

//             navigate('/home'); // Redirect to home after login
//         } catch (err) {
//             setError(err.response?.data?.error || 'Login failed');
//         }
//     };

//     // Handle signup
//     const handleSignup = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('email', email);
//         formData.append('password', password);
//         formData.append('role', role);
//         if (profilePic) {
//             formData.append('profilePic', profilePic); // Add profile picture file
//         }

//         try {
//             const response = await axios.post('http://localhost:5000/auth/signup', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             // On successful signup, automatically log in the user
//             const loginResponse = await axios.post('http://localhost:5000/auth/login', {
//                 email,
//                 password,
//             });

//             // Store token, role, and user in localStorage
//             localStorage.setItem('token', loginResponse.data.token);
//             localStorage.setItem('role', loginResponse.data.user.role);
//             localStorage.setItem('user', JSON.stringify(loginResponse.data.user));

//             navigate('/home'); // Redirect to home after signup
//         } catch (err) {
//             setError(err.response?.data?.error || 'Signup failed');
//         }
//     };

//     return (
//         <div>
//             <h2>{isSignup ? 'Signup' : 'Login'}</h2>
//             <form onSubmit={isSignup ? handleSignup : handleLogin}>
//                 {isSignup && (
//                     <>
//                         <input
//                             type="text"
//                             placeholder="Name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             required
//                         />
//                         {/* Profile picture upload */}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setProfilePic(e.target.files[0])}
//                         />
//                     </>
//                 )}
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 {isSignup && (
//                     <select value={role} onChange={(e) => setRole(e.target.value)}>
//                         <option value="customer">Customer</option>
//                         <option value="admin">Admin</option>
//                     </select>
//                 )}
//                 {error && <p>{error}</p>}
//                 <button type="submit">{isSignup ? 'Signup' : 'Login'}</button>
//             </form>
//             <button onClick={() => setIsSignup(!isSignup)}>
//                 {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
//             </button>
//         </div>
//     );
// };

// export default AuthPage;
