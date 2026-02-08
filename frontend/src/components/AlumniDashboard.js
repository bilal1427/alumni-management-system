import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [profileForm, setProfileForm] = useState({
    graduationYear: '',
    degree: '',
    currentCompany: '',
    currentPosition: '',
    location: '',
    linkedIn: '',
    bio: '',
    skills: '',
    achievements: ''
  });
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    applicationLink: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    fetchEvents();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/alumni/profile/me');
      setProfile(response.data);
      setProfileForm({
        graduationYear: response.data.graduationYear || '',
        degree: response.data.degree || '',
        currentCompany: response.data.currentCompany || '',
        currentPosition: response.data.currentPosition || '',
        location: response.data.location || '',
        linkedIn: response.data.linkedIn || '',
        bio: response.data.bio || '',
        skills: response.data.skills?.join(', ') || '',
        achievements: response.data.achievements || ''
      });
    } catch (error) {
      console.log('No profile found');
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await API.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await API.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...profileForm,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await API.post('/alumni/profile', data);
      alert('Profile saved successfully');
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save profile');
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', jobForm);
      alert('Job posted successfully');
      setJobForm({
        title: '',
        company: '',
        location: '',
        jobType: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
        applicationLink: ''
      });
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post job');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2>Alumni Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </nav>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'profile' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
        <button 
          className={activeTab === 'postJob' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('postJob')}
        >
          Post Job
        </button>
        <button 
          className={activeTab === 'jobs' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('jobs')}
        >
          View Jobs
        </button>
        <button 
          className={activeTab === 'events' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h3>Update Your Profile</h3>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Graduation Year *</label>
                  <input
                    type="number"
                    value={profileForm.graduationYear}
                    onChange={(e) => setProfileForm({...profileForm, graduationYear: e.target.value})}
                    required
                    placeholder="e.g., 2020"
                  />
                </div>
                <div className="form-group">
                  <label>Degree *</label>
                  <input
                    type="text"
                    value={profileForm.degree}
                    onChange={(e) => setProfileForm({...profileForm, degree: e.target.value})}
                    required
                    placeholder="e.g., MCA"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Company</label>
                  <input
                    type="text"
                    value={profileForm.currentCompany}
                    onChange={(e) => setProfileForm({...profileForm, currentCompany: e.target.value})}
                    placeholder="e.g., Google"
                  />
                </div>
                <div className="form-group">
                  <label>Current Position</label>
                  <input
                    type="text"
                    value={profileForm.currentPosition}
                    onChange={(e) => setProfileForm({...profileForm, currentPosition: e.target.value})}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                    placeholder="e.g., Bangalore, India"
                  />
                </div>
                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <input
                    type="url"
                    value={profileForm.linkedIn}
                    onChange={(e) => setProfileForm({...profileForm, linkedIn: e.target.value})}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>

              <div className="form-group">
                <label>Achievements</label>
                <textarea
                  value={profileForm.achievements}
                  onChange={(e) => setProfileForm({...profileForm, achievements: e.target.value})}
                  placeholder="Share your achievements..."
                  rows="3"
                />
              </div>

              <button type="submit" className="btn btn-primary">Save Profile</button>
            </form>
          </div>
        )}

        {activeTab === 'postJob' && (
          <div className="post-job-section">
            <h3>Post a Job/Internship</h3>
            <form onSubmit={handleJobSubmit} className="job-form">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  required
                  placeholder="e.g., Frontend Developer"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    value={jobForm.company}
                    onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({...jobForm, jobType: e.target.value})}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                    placeholder="e.g., $80,000 - $100,000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Requirements</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Application Link *</label>
                <input
                  type="url"
                  value={jobForm.applicationLink}
                  onChange={(e) => setJobForm({...jobForm, applicationLink: e.target.value})}
                  required
                  placeholder="https://..."
                />
              </div>

              <button type="submit" className="btn btn-primary">Post Job</button>
            </form>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-list">
            <h3>Available Jobs</h3>
            {jobs.length === 0 ? (
              <p>No jobs available</p>
            ) : (
              <div className="job-cards">
                {jobs.map(job => (
                  <div key={job._id} className="job-card">
                    <h4>{job.title}</h4>
                    <p className="company">{job.company} • {job.location}</p>
                    <span className="badge">{job.jobType}</span>
                    <p className="description">{job.description}</p>
                    <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-list">
            <h3>Upcoming Events</h3>
            {events.length === 0 ? (
              <p>No events scheduled</p>
            ) : (
              <div className="event-cards">
                {events.map(event => (
                  <div key={event._id} className="event-card">
                    <h4>{event.title}</h4>
                    <p className="event-meta">
                      📅 {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}
                    </p>
                    <p className="event-meta">📍 {event.venue}</p>
                    <span className="badge">{event.eventType}</span>
                    <p className="description">{event.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDashboard;
