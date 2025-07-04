import React, { useEffect, useState } from 'react';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch users
    fetch('/api/auth/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data));
    // Fetch products
    fetch('/api/products/admin/all')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <div className="bg-white shadow rounded p-4 mb-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">ID</th>
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Email</th>
                <th className="px-2 py-1">Role</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-2 py-1">{user.id}</td>
                  <td className="px-2 py-1">{user.firstName} {user.lastName}</td>
                  <td className="px-2 py-1">{user.email}</td>
                  <td className="px-2 py-1">{user.role}</td>
                  <td className="px-2 py-1 space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-yellow-600 hover:underline">Reset Password</button>
                    <button className="text-green-600 hover:underline">Change Role</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
        <div className="bg-white shadow rounded p-4 mb-4">
          <button className="mb-2 px-4 py-2 bg-blue-600 text-white rounded">Add Product</button>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">ID</th>
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-2 py-1">{product.id}</td>
                  <td className="px-2 py-1">{product.name}</td>
                  <td className="px-2 py-1">${product.price}</td>
                  <td className="px-2 py-1 space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 