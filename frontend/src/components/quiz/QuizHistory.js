import React, { useState, useEffect } from 'react';
import { quizAPI } from '../../services/api';
import './QuizHistory.css';

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const response = await quizAPI.getHistory();
      if (response.success) {
        setHistory(response.history);
      }
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return <div className="loading">Loading quiz history...</div>;
  }

  return (
    <div className="quiz-history">
      <h2>📊 Your Quiz History</h2>
      
      {history.length === 0 ? (
        <div className="no-history">
          <p>You haven't taken any quizzes yet.</p>
          <button 
            onClick={() => window.location.href = '/quiz'}
            className="btn btn-primary"
          >
            Take Your First Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="history-stats">
            <div className="stat-card">
              <span className="stat-number">{history.length}</span>
              <span className="stat-label">Total Attempts</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {Math.round(history.reduce((acc, quiz) => acc + (quiz.score || 0), 0) / history.length)}%
              </span>
              <span className="stat-label">Average Score</span>
            </div>
          </div>

          <div className="history-list">
            {history.map((quiz, index) => (
              <div 
                key={quiz._id} 
                className="quiz-item"
                onClick={() => setSelectedQuiz(quiz)}
              >
                <div className="quiz-header">
                  <h3>Attempt #{history.length - index}</h3>
                  <span className="quiz-date">
                    {formatDate(quiz.completedAt)}
                  </span>
                </div>
                <div className="quiz-details">
                  <span className="personality-type">
                    {quiz.results?.personalityType}
                  </span>
                  <span className="quiz-score">
                    Score: {quiz.score}%
                  </span>
                  <span className="quiz-time">
                    Time: {formatTime(quiz.timeSpent)}
                  </span>
                </div>
                <div className="career-count">
                  {quiz.results?.careerRecommendations?.length || 0} career recommendations
                </div>
              </div>
            ))}
          </div>

          {selectedQuiz && (
            <div className="quiz-detail-modal">
              <div className="modal-content">
                <button 
                  className="close-btn"
                  onClick={() => setSelectedQuiz(null)}
                >
                  ×
                </button>
                <h3>Quiz Details - {formatDate(selectedQuiz.completedAt)}</h3>
                <div className="detail-section">
                  <h4>Personality Type</h4>
                  <p>{selectedQuiz.results?.personalityType}</p>
                </div>
                <div className="detail-section">
                  <h4>Career Recommendations</h4>
                  <div className="career-list">
                    {selectedQuiz.results?.careerRecommendations?.map((career, index) => (
                      <div key={index} className="career-item">
                        <strong>{career.role}</strong> in {career.field}
                        <span className="match-percentage">
                          {career.matchPercentage}% match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Strengths</h4>
                  <div className="tags">
                    {selectedQuiz.results?.strengths?.map((strength, index) => (
                      <span key={index} className="tag">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizHistory;