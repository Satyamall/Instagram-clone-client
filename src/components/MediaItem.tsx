import { useState } from 'react';
import CommentList from './CommentList';
import { InstagramComment, InstagramMedia } from '../types';
import { API_URL } from '../config';

interface MediaItemProps {
  media: InstagramMedia;
  token: string;
}

const MediaItem = ({ media, token }: MediaItemProps) => {
  const [comments, setComments] = useState<InstagramComment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/api/comments?token=${token}&mediaId=${media.id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  return (
    <div className="media-card">
      {media.media_type === 'IMAGE' ? (
        <img 
          src={media.media_url} 
          alt={media.caption || 'Instagram post'} 
          className="media-content"
        />
      ) : (
        <video controls className="media-content">
          <source src={media.media_url} type="video/mp4" />
        </video>
      )}
      
      <div className="media-details">
        {media.caption && <p className="media-caption">{media.caption}</p>}
        <p className="media-date">
          Posted on: {new Date(media.timestamp).toLocaleDateString()}
        </p>
        
        <div className="media-actions">
          <button 
            onClick={toggleComments}
            className="comments-toggle"
            disabled={loading}
          >
            {loading ? 'Loading...' : 
             `${showComments ? 'Hide' : 'Show'} Comments (${media.comments_count || 0})`}
          </button>
          
          <a 
            href={media.permalink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-on-ig"
          >
            View on Instagram
          </a>
        </div>

        {error && <p className="error-message">{error}</p>}
        
        {showComments && (
          <div className="comments-section">
            {comments.length > 0 ? (
              <CommentList 
                comments={comments} 
                token={token} 
                mediaId={media.id} 
              />
            ) : (
              <p className="no-comments">No comments yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaItem;