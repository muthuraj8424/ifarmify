import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
    const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://ifarmify.onrender.com/admin/getallusers',{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                      }},
                );
                setUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Users List</h2>
            {/* <h3 className="text-xl font-medium text-gray-700 mt-8 mb-4">Users</h3> */}
    { loading && <>
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <img
                  src={`http://localhost:5000${user.profilePic}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border border-gray-300"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
          </>}
        {/* )} */}
        </div>
    );
};

export default UsersList;
