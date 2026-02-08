import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('alumni');
  const [alumni, setAlumni] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
    fetchJobs();
    fetchEvents();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await API.get('/alumni');
      setAlumni(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      setLoading(false);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2>Student Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </nav>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'alumni' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('alumni')}
        >
          Alumni Directory
        </button>
        <button 
          className={activeTab === 'jobs' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('jobs')}
        >
          Job Opportunities
        </button>
        <button 
          className={activeTab === 'events' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'alumni' && (
          <div className="alumni-directory">
            <h3>Alumni Directory</h3>
            <p className="subtitle">Connect with our alumni network</p>
            {loading ? (
              <p>Loading...</p>
            ) : alumni.length === 0 ? (
              <p>No alumni profiles available yet</p>
            ) : (
              <div className="alumni-grid">
                {alumni.map(alum => (
                  <div key={alum._id} className="alumni-card">
                    <div className="alumni-header">
                      <div className="alumni-avatar">
                        {alum.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{alum.user?.name}</h4>
                        <p className="text-muted">{alum.currentPosition || 'Alumni'}</p>
                      </div>
                    </div>
                    
                    <div className="alumni-details">
                      <p><strong>Company:</strong> {alum.currentCompany || 'N/A'}</p>
                      <p><strong>Location:</strong> {alum.location || 'N/A'}</p>
                      <p><strong>Graduated:</strong> {alum.graduationYear}</p>
                      <p><strong>Degree:</strong> {alum.degree}</p>
                      
                      {alum.bio && (
                        <p className="bio">{alum.bio}</p>
                      )}
                      
                      {alum.skills && alum.skills.length > 0 && (
                        <div className="skills">
                          {alum.skills.map((skill, idx) => (
                            <span key={idx} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      )}
                      
                      {alum.linkedIn && (
                        <a 
                          href={alum.linkedIn} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline"
                        >
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h3>Job Opportunities</h3>
            <p className="subtitle">Explore career opportunities posted by alumni</p>
            {jobs.length === 0 ? (
              <p>No job opportunities available yet</p>
            ) : (
              <div className="job-cards">
                {jobs.map(job => (
                  <div key={job._id} className="job-card">
                    <div className="job-header">
                      <h4>{job.title}</h4>
                      <span className="badge">{job.jobType}</span>
                    </div>
                    
                    <p className="company">
                      <strong>{job.company}</strong> • {job.location}
                    </p>
                    
                    {job.salary && job.salary !== 'Not disclosed' && (
                      <p className="salary">💰 {job.salary}</p>
                    )}
                    
                    <p className="description">{job.description}</p>
                    
                    {job.requirements && (
                      <div className="requirements">
                        <strong>Requirements:</strong>
                        <p>{job.requirements}</p>
                      </div>
                    )}
                    
                    <div className="job-footer">
                      <p className="posted-by">
                        Posted by: {job.postedBy?.name || 'Alumni'}
                      </p>
                      <a 
                        href={job.applicationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        Apply Now →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <h3>Upcoming Events</h3>
            <p className="subtitle">Join events organized by the institution</p>
            {events.length === 0 ? (
              <p>No upcoming events</p>
            ) : (
              <div className="event-cards">
                {events.map(event => (
                  <div key={event._id} className="event-card">
                    <div className="event-header">
                      <h4>{event.title}</h4>
                      <span className="badge">{event.eventType}</span>
                    </div>
                    
                    <div className="event-meta">
                      <p>📅 {new Date(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      <p>🕐 {event.eventTime}</p>
                      <p>📍 {event.venue}</p>
                    </div>
                    
                    <p className="description">{event.description}</p>
                    
                    {event.maxParticipants > 0 && (
                      <p className="participants">
                        👥 Max Participants: {event.maxParticipants}
                      </p>
                    )}
                    
                    {event.registrationLink && (
                      <a 
                        href={event.registrationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        Register Now
                      </a>
                    )}
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

export default StudentDashboard;
