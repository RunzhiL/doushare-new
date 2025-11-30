import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
  });

  useEffect(() => {
    loadPendingItems();
    loadUsers();
    loadBorrows();
    loadStats();
  }, []);

  // Load Pending Items
  const loadPendingItems = async () => {
    const res = await fetch("http://localhost:3000/api/admin/pending-items", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setPendingItems(await res.json());
  };

  // Load All Users
  const loadUsers = async () => {
    const res = await fetch("http://localhost:3000/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(await res.json());
  };

  // Load Borrow List
  const loadBorrows = async () => {
    const res = await fetch("http://localhost:3000/api/admin/borrows", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setBorrows(await res.json());
  };

  // Load System Stats
  const loadStats = async () => {
    const res = await fetch("http://localhost:3000/api/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setStats(await res.json());
  };

  // Approve Item
  const approveItem = async (itemId) => {
    await fetch(`http://localhost:3000/api/admin/items/${itemId}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    loadPendingItems();
    alert("Item approved!");
  };

  // Delete User
  const removeUser = async (userId) => {
    await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    loadUsers();
    alert("User removed!");
  };

  // End Borrow Transaction
  const endTransaction = async (borrowId) => {
    await fetch(`http://localhost:3000/api/admin/borrows/${borrowId}/end`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    loadBorrows();
    alert("Borrow transaction ended!");
  };

  return (
    <div className="admin-dashboard">

      <h1>Admin Dashboard</h1>

      {/* Pending Item Approval */}
      <section>
        <h2>Pending Item Approval</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Owner</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingItems.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.owner_name}</td>
                <td>
                  <button onClick={() => approveItem(item._id)}>
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* User Management */}
      <section>
        <h2>User Management</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => removeUser(user._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Borrow Management */}
      <section>
        <h2>Borrow Transaction Management</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Borrower</th>
              <th>Status</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((b) => (
              <tr key={b._id}>
                <td>{b.item_title}</td>
                <td>{b.borrower_name}</td>
                <td>{b.state}</td>
                <td>
                  <button onClick={() => endTransaction(b._id)}>
                    End
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Reports */}
      <section className="reports-section">
        <h2>System Reports</h2>
        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Items: {stats.totalItems}</p>
        <p>Active Borrows: {stats.activeBorrows}</p>
        <p>Overdue Borrows: {stats.overdueBorrows}</p>

        <button>View Monthly Reports</button>
      </section>
    </div>
  );
};

export default AdminDashboard;
