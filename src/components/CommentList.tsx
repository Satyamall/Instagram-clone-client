import { useState } from 'react';
import { InstagramComment } from '../types';
import { API_URL } from '../config';

interface CommentListProps {
  comments: InstagramComment[];
  token: string;
  mediaId: string;
}

const CommentList = ({ comments, token, mediaId }: CommentListProps) => {
  const [activeReplies, setActiveReplies] = useState<Record<string, boolean>>({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const toggleReply = (commentId: string) => {
    setActiveReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleReplyChange = (commentId: string, text: string) => {
    setReplyTexts(prev => ({
      ...prev,
      [commentId]: text
    }));
  };

  const postReply = async (commentId: string) => {
    if (!replyTexts[commentId]?.trim()) return;

    try {
      setLoadingStates(prev => ({ ...prev, [commentId]: true }));
      
      const response = await fetch(`${API_URL}/api/comments/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          commentId,
          message: replyTexts[commentId]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post reply');
      }

      // Reset the reply input
      handleReplyChange(commentId, '');
      setActiveReplies(prev => ({ ...prev, [commentId]: false }));
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <div className="comments-container">
      {comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-header">
            <strong>{comment.username}</strong>
            <span className="comment-time">
              {new Date(comment.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="comment-text">{comment.text}</p>
          
          <button 
            className="reply-btn"
            onClick={() => toggleReply(comment.id)}
          >
            Reply
          </button>

          {activeReplies[comment.id] && (
            <div className="reply-form">
              <input
                type="text"
                value={replyTexts[comment.id] || ''}
                onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                placeholder="Write a reply..."
              />
              <button
                onClick={() => postReply(comment.id)}
                disabled={loadingStates[comment.id] || !replyTexts[comment.id]?.trim()}
              >
                {loadingStates[comment.id] ? 'Posting...' : 'Post'}
              </button>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="replies-list">
              {comment.replies.map(reply => (
                <div key={reply.id} className="reply-item">
                  <div className="comment-header">
                    <strong>{reply.username}</strong>
                    <span className="comment-time">
                      {new Date(reply.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-text">{reply.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;