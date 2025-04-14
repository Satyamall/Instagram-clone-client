import { API_URL } from '../config';
import './Login.css';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/instagram`;
  };

  return (
    <div className="login-container">
      <h1>Instagram Integration</h1>
      <button className="instagram-login-btn" onClick={handleLogin}>
        <span className="instagram-icon"></span>
        Login with Instagram
      </button>
      <p className="disclaimer">
        This will redirect you to Instagram's official login page
      </p>
    </div>
  );
};

export default LoginPage;