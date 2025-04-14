import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaItem from '../components/MediaItem';
import { InstagramProfile, InstagramMedia } from '../types';
import './Dashboard.css';
import { API_URL } from '../config';

const Dashboard = () => {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('user_id');

    if (!token || !userId) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, mediaRes] = await Promise.all([
          fetch(`${API_URL}/api/profile?token=${token}&user_id=${userId}`),
          fetch(`${API_URL}/api/media?token=${token}&user_id=${userId}`)
        ]);

        if (!profileRes.ok || !mediaRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const profileData = await profileRes.json();
        const mediaData = await mediaRes.json();

        setProfile(profileData);
        setMedia(mediaData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your Instagram data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleLogout} className="logout-btn">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="profile-info">
          <h1>{profile?.username}'s Instagram</h1>
          <p>Account Type: {profile?.account_type}</p>
          <p>Total Posts: {profile?.media_count}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <main className="media-grid">
        {media.length > 0 ? (
          media.map(item => (
            <MediaItem 
              key={item.id} 
              media={item} 
              token={new URLSearchParams(window.location.search).get('token') || ''} 
            />
          ))
        ) : (
          <p className="no-media">No posts found</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;