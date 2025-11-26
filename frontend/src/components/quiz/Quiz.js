import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { quizAPI } from '../../services/api';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await quizAPI.getQuestions();
      if (response.success) {
        setQuestions(response.questions);
      } else {
        setError(response.message || 'Failed to load quiz questions');
      }
    } catch (err) {
      console.error('Fetch questions error:', err);
      setError(err.message || 'Error loading quiz. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    setError('');
  };

  const handleAnswer = (selectedOptions) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOptions;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  // Helper function to calculate personality type based on answers
  const calculatePersonalityType = (answers) => {
    // Count answers by category
    const categoryCount = {};
    
    answers.forEach((answer, index) => {
      const question = questions[index];
      if (question && question.category) {
        if (!categoryCount[question.category]) {
          categoryCount[question.category] = 0;
        }
        categoryCount[question.category] += answer ? answer.length : 0;
      }
    });

    // Determine dominant category
    let dominantCategory = '';
    let maxCount = 0;
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantCategory = category;
      }
    });

    // Map category to personality type
    const typeMap = {
      'technical': 'Analytical Innovator',
      'creative': 'Creative Visionary',
      'social': 'Social Connector',
      'organizational': 'Strategic Planner',
      'leadership': 'Inspiring Leader',
      'practical': 'Hands-On Problem Solver'
    };

    return typeMap[dominantCategory] || 'Balanced Professional';
  };

  // Helper function to generate career recommendations
  const generateCareerRecommendations = (personalityType) => {
    const recommendations = {
      'Analytical Innovator': [
        {
          field: 'Technology',
          role: 'Software Engineer',
          matchPercentage: 95,
          description: 'Develop innovative software solutions and applications',
          skillsRequired: ['Programming', 'Problem Solving', 'Algorithms'],
          growthProspects: 'High demand with excellent career progression'
        },
        {
          field: 'Data Science',
          role: 'Data Analyst',
          matchPercentage: 88,
          description: 'Analyze complex data to drive business decisions',
          skillsRequired: ['Statistics', 'Python', 'Data Visualization'],
          growthProspects: 'Rapidly growing field with diverse opportunities'
        }
      ],
      'Creative Visionary': [
        {
          field: 'Design',
          role: 'UX/UI Designer',
          matchPercentage: 92,
          description: 'Create intuitive and beautiful user experiences',
          skillsRequired: ['Design Thinking', 'Prototyping', 'User Research'],
          growthProspects: 'Essential in digital product development'
        },
        {
          field: 'Marketing',
          role: 'Content Strategist',
          matchPercentage: 85,
          description: 'Develop engaging content and marketing campaigns',
          skillsRequired: ['Writing', 'SEO', 'Social Media'],
          growthProspects: 'High demand across all industries'
        }
      ],
      'Social Connector': [
        {
          field: 'Human Resources',
          role: 'HR Specialist',
          matchPercentage: 90,
          description: 'Support employee development and organizational culture',
          skillsRequired: ['Communication', 'Empathy', 'Conflict Resolution'],
          growthProspects: 'Stable career with people-focused work'
        },
        {
          field: 'Education',
          role: 'Career Counselor',
          matchPercentage: 87,
          description: 'Guide individuals in their career development journey',
          skillsRequired: ['Mentoring', 'Assessment', 'Career Planning'],
          growthProspects: 'Rewarding career helping others'
        }
      ],
      'Strategic Planner': [
        {
          field: 'Business',
          role: 'Project Manager',
          matchPercentage: 93,
          description: 'Coordinate projects and ensure successful delivery',
          skillsRequired: ['Organization', 'Leadership', 'Risk Management'],
          growthProspects: 'Critical role in all organizations'
        },
        {
          field: 'Consulting',
          role: 'Business Analyst',
          matchPercentage: 89,
          description: 'Analyze business processes and recommend improvements',
          skillsRequired: ['Analysis', 'Communication', 'Process Modeling'],
          growthProspects: 'Excellent career progression opportunities'
        }
      ],
      'Inspiring Leader': [
        {
          field: 'Management',
          role: 'Team Lead',
          matchPercentage: 94,
          description: 'Lead and motivate teams to achieve organizational goals',
          skillsRequired: ['Leadership', 'Communication', 'Decision Making'],
          growthProspects: 'Path to executive leadership roles'
        },
        {
          field: 'Entrepreneurship',
          role: 'Startup Founder',
          matchPercentage: 82,
          description: 'Build and grow innovative business ventures',
          skillsRequired: ['Risk Taking', 'Vision', 'Resource Management'],
          growthProspects: 'High risk but potentially high reward'
        }
      ],
      'Hands-On Problem Solver': [
        {
          field: 'Engineering',
          role: 'Mechanical Engineer',
          matchPercentage: 91,
          description: 'Design and build mechanical systems and devices',
          skillsRequired: ['CAD', 'Physics', 'Technical Drawing'],
          growthProspects: 'Stable career in manufacturing and innovation'
        },
        {
          field: 'Healthcare',
          role: 'Physical Therapist',
          matchPercentage: 86,
          description: 'Help patients recover mobility and manage pain',
          skillsRequired: ['Anatomy', 'Patient Care', 'Rehabilitation'],
          growthProspects: 'Growing field with meaningful impact'
        }
      ],
      'Balanced Professional': [
        {
          field: 'Management',
          role: 'Operations Manager',
          matchPercentage: 88,
          description: 'Oversee daily operations and ensure efficiency',
          skillsRequired: ['Organization', 'Communication', 'Problem Solving'],
          growthProspects: 'Versatile role across many industries'
        },
        {
          field: 'Consulting',
          role: 'Management Consultant',
          matchPercentage: 85,
          description: 'Advise organizations on business strategy and operations',
          skillsRequired: ['Analysis', 'Communication', 'Strategic Thinking'],
          growthProspects: 'Prestigious career with global opportunities'
        }
      ]
    };

    return recommendations[personalityType] || recommendations['Balanced Professional'];
  };

  // Helper function to identify strengths
  const identifyStrengths = (answers) => {
    const strengths = [];
    const answerCount = {};

    // Count occurrences of each answer pattern
    answers.forEach(answerArray => {
      answerArray?.forEach(answer => {
        answerCount[answer] = (answerCount[answer] || 0) + 1;
      });
    });

    // Identify top strengths based on answer patterns
    if (answerCount['Problem Solving'] > 2) strengths.push('Analytical Thinking');
    if (answerCount['Creativity'] > 2) strengths.push('Creative Innovation');
    if (answerCount['Teamwork'] > 2) strengths.push('Collaboration');
    if (answerCount['Leadership'] > 2) strengths.push('Natural Leadership');
    if (answerCount['Detail Oriented'] > 2) strengths.push('Attention to Detail');
    if (answerCount['Communication'] > 2) strengths.push('Effective Communication');

    // Fallback strengths if none detected
    if (strengths.length === 0) {
      strengths.push('Adaptability', 'Willingness to Learn', 'Positive Attitude');
    }

    return strengths.slice(0, 5); // Return top 5 strengths
  };

  // Helper function to identify development areas
  const identifyDevelopmentAreas = (answers) => {
    const developmentAreas = [];
    const answerCount = {};

    // Count occurrences of each answer pattern
    answers.forEach(answerArray => {
      answerArray?.forEach(answer => {
        answerCount[answer] = (answerCount[answer] || 0) + 1;
      });
    });

    // Identify areas for development based on low-scoring patterns
    if ((answerCount['Public Speaking'] || 0) < 1) developmentAreas.push('Public Speaking');
    if ((answerCount['Risk Taking'] || 0) < 1) developmentAreas.push('Risk Management');
    if ((answerCount['Technical Skills'] || 0) < 2) developmentAreas.push('Technical Proficiency');
    if ((answerCount['Strategic Planning'] || 0) < 1) developmentAreas.push('Strategic Thinking');

    // Fallback development areas if none detected
    if (developmentAreas.length === 0) {
      developmentAreas.push('Advanced Technical Skills', 'Industry Specialization', 'Professional Networking');
    }

    return developmentAreas.slice(0, 3); // Return top 3 development areas
  };

  // Helper function to generate suggested skills
  const generateSuggestedSkills = (personalityType) => {
    const skillMap = {
      'Analytical Innovator': ['Python', 'Data Analysis', 'Machine Learning', 'SQL', 'Statistical Modeling'],
      'Creative Visionary': ['UI/UX Design', 'Graphic Design', 'Content Creation', 'Brand Strategy', 'Digital Marketing'],
      'Social Connector': ['Communication', 'Networking', 'Conflict Resolution', 'Team Building', 'Public Speaking'],
      'Strategic Planner': ['Project Management', 'Strategic Planning', 'Risk Assessment', 'Process Optimization', 'Budgeting'],
      'Inspiring Leader': ['Leadership', 'Decision Making', 'Team Management', 'Public Speaking', 'Strategic Vision'],
      'Hands-On Problem Solver': ['Technical Drawing', 'CAD', 'Troubleshooting', 'Quality Control', 'Equipment Operation'],
      'Balanced Professional': ['Project Management', 'Communication', 'Problem Solving', 'Adaptability', 'Time Management']
    };

    return skillMap[personalityType] || ['Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Time Management'];
  };

  // Helper function to calculate compatibility score
  const calculateCompatibilityScore = (answers) => {
    // Simple scoring based on answer completeness and consistency
    const totalAnswers = answers.reduce((count, answerArray) => {
      return count + (answerArray ? answerArray.length : 0);
    }, 0);
    
    const maxPossibleAnswers = questions.length * 3; // Assuming average 3 selections per question
    
    return Math.min(Math.round((totalAnswers / maxPossibleAnswers) * 100), 100);
  };

  const submitQuiz = async (quizAnswers) => {
    setSubmitting(true);
    setError('');
    try {
      console.log('Submitting quiz answers:', quizAnswers);
      
      // Calculate results using helper functions
      const personalityType = calculatePersonalityType(quizAnswers);
      const careerRecommendations = generateCareerRecommendations(personalityType);
      const strengths = identifyStrengths(quizAnswers);
      const areasForDevelopment = identifyDevelopmentAreas(quizAnswers);
      const suggestedSkills = generateSuggestedSkills(personalityType);
      const compatibilityScore = calculateCompatibilityScore(quizAnswers);
      
      const results = {
        personalityType,
        careerRecommendations,
        strengths,
        areasForDevelopment,
        suggestedSkills,
        compatibilityScore
      };

      // Prepare quiz data for saving
      const quizData = {
        answers: quizAnswers.map((answer, index) => ({
          questionId: questions[index]?.id || `q${index + 1}`,
          questionText: questions[index]?.text || `Question ${index + 1}`,
          answer: answer,
          category: questions[index]?.category || 'general'
        })),
        results: results,
        timeSpent: Math.floor((Date.now() - startTime) / 1000), // in seconds
        score: compatibilityScore
      };

      console.log('Saving quiz data:', quizData);

      // Save quiz results to database
      const saveResponse = await quizAPI.submitQuiz(quizData);
      
      if (saveResponse.success) {
        console.log('✅ Quiz saved successfully with ID:', saveResponse.quizId);
        
        // Store in localStorage for immediate access
        localStorage.setItem('last_quiz_results', JSON.stringify(results));
        localStorage.setItem('last_quiz_id', saveResponse.quizId);
        localStorage.setItem('quiz_completed', 'true');
        localStorage.setItem('quiz_taken', 'true');
        localStorage.setItem('last_quiz_time', new Date().toISOString());
        
        setResults(results);
        setShowResults(true);
      } else {
        setError(saveResponse.message || 'Failed to save quiz results');
      }
    } catch (err) {
      console.error('Submit quiz error:', err);
      setError(err.message || 'Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
    setQuizStarted(false);
    setError('');
    setStartTime(null);
  };

  if (!user) {
    return (
      <div className="quiz-container">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to take the career assessment quiz.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !quizStarted) {
    return (
      <div className="quiz-container">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            Loading quiz questions...
          </div>
        </div>
      </div>
    );
  }

  if (error && !quizStarted) {
    return (
      <div className="quiz-container">
        <div className="container">
          <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={fetchQuestions} className="btn btn-primary">
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-secondary"
              >
                Refresh Page
              </button>
            </div>
            <div className="debug-info">
              <p><strong>Debug Info:</strong> Make sure the backend server is running on port 5000 and MongoDB is started.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return <QuizResults results={results} onRetake={retakeQuiz} />;
  }

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="container">
          <div className="quiz-intro">
            <h1>Career Assessment Quiz</h1>
            <p className="quiz-description">
              Discover your ideal career path with our intelligent assessment. 
              Answer {questions.length} simple questions about your interests, skills, and preferences.
            </p>
            
            <div className="quiz-info">
              <div className="info-card">
                <h3>What to expect:</h3>
                <ul>
                  <li>⏱️ 5-7 minutes to complete</li>
                  <li>🎯 Personalized career matches</li>
                  <li>📚 Curated learning resources</li>
                  <li>💡 Actionable insights</li>
                  <li>💾 Results saved to your profile</li>
                  <li>🔘 Select multiple options that apply to you</li>
                </ul>
                
                <div className="quiz-stats">
                  <div className="stat">
                    <h4>{questions.length}</h4>
                    <p>Questions</p>
                  </div>
                  <div className="stat">
                    <h4>Multi</h4>
                    <p>Selection</p>
                  </div>
                  <div className="stat">
                    <h4>Instant</h4>
                    <p>Results</p>
                  </div>
                </div>
                
                <button 
                  onClick={startQuiz} 
                  className="btn btn-primary start-quiz-btn"
                  disabled={questions.length === 0}
                >
                  {questions.length === 0 ? 'Loading...' : 'Start Career Assessment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
        <span>Question {currentQuestion + 1} of {questions.length}</span>
      </div>

      {error && (
        <div className="quiz-error">
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
          <div className="error-actions">
            <button onClick={() => setError('')} className="btn btn-secondary">
              Dismiss
            </button>
            <button onClick={() => submitQuiz(answers)} className="btn btn-primary">
              Try Submitting Again
            </button>
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <QuizQuestion
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          selectedAnswers={answers[currentQuestion] || []}
          onBack={goBack}
          canGoBack={currentQuestion > 0}
          allowMultiple={questions[currentQuestion]?.allowMultiple || false}
        />
      )}

      {submitting && (
        <div className="quiz-loading-overlay">
          <div className="spinner"></div>
          <p>Processing your results...</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;