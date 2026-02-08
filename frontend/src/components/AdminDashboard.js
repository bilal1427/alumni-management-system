import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    eventType: 'Workshop'
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get('/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await API.put(`/admin/approve/${userId}`);
      alert('Alumni approved successfully');
      fetchUsers();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to reject this alumni?')) {
      try {
        await API.put(`/admin/reject/${userId}`);
        alert('Alumni rejected');
        fetchUsers();
        fetchStats();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to reject');
      }
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/events', eventForm);
      alert('Event created successfully');
      setEventForm({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        eventType: 'Workshop'
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const pendingAlumni = users.filter(u => u.role === 'alumni' && !u.isApproved);

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </nav>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalUsers || 0}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalAlumni || 0}</h3>
          <p>Approved Alumni</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalStudents || 0}</h3>
          <p>Students</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingApprovals || 0}</h3>
          <p>Pending Approvals</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          All Users
        </button>
        <button 
          className={activeTab === 'pending' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approvals ({pendingAlumni.length})
        </button>
        <button 
          className={activeTab === 'events' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('events')}
        >
          Create Event
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'users' && (
          <div className="users-list">
            <h3>All Users</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className="badge">{user.role}</span></td>
                      <td>
                        {user.role === 'alumni' ? (
                          user.isApproved ? 
                            <span className="badge badge-success">Approved</span> : 
                            <span className="badge badge-warning">Pending</span>
                        ) : (
                          <span className="badge badge-success">Active</span>
                        )}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="pending-approvals">
            <h3>Pending Alumni Approvals</h3>
            {pendingAlumni.length === 0 ? (
              <p>No pending approvals</p>
            ) : (
              <div className="approval-cards">
                {pendingAlumni.map(user => (
                  <div key={user._id} className="approval-card">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <p className="text-muted">Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <div className="approval-actions">
                      <button 
                        onClick={() => handleApprove(user._id)} 
                        className="btn btn-success btn-sm"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(user._id)} 
                        className="btn btn-danger btn-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="create-event">
            <h3>Create New Event</h3>
            <form onSubmit={handleEventSubmit} className="event-form">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({...eventForm, eventDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Event Time</label>
                  <input
                    type="time"
                    value={eventForm.eventTime}
                    onChange={(e) => setEventForm({...eventForm, eventTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Event Type</label>
                  <select
                    value={eventForm.eventType}
                    onChange={(e) => setEventForm({...eventForm, eventType: e.target.value})}
                  >
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Webinar</option>
                    <option>Networking</option>
                    <option>Alumni Meet</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create Event</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
