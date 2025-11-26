import React, { useState } from 'react';
import './QuizQuestion.css';

const QuizQuestion = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  selectedAnswers = [], 
  onBack, 
  canGoBack,
  allowMultiple = false
}) => {
  const [currentSelections, setCurrentSelections] = useState(selectedAnswers);

  const handleOptionClick = (optionIndex) => {
    let newSelections;
    
    if (allowMultiple) {
      // Toggle selection for multiple choice
      if (currentSelections.includes(optionIndex)) {
        newSelections = currentSelections.filter(idx => idx !== optionIndex);
      } else {
        newSelections = [...currentSelections, optionIndex];
      }
    } else {
      // Single selection
      newSelections = [optionIndex];
    }
    
    setCurrentSelections(newSelections);
  };

  const handleNext = () => {
    if (currentSelections.length > 0) {
      onAnswer(currentSelections);
      setCurrentSelections([]);
    }
  };

  const isNextDisabled = currentSelections.length === 0;

  return (
    <div className="quiz-question-container">
      <div className="quiz-question">
        <div className="question-header">
          <h2>Question {questionNumber}/{totalQuestions}</h2>
          <div className="question-meta">
            <p className="question-category">{question.category}</p>
            {allowMultiple && (
              <span className="multiple-selection-badge">
                🔘 Select all that apply
              </span>
            )}
          </div>
        </div>
        
        <p className="question-text">{question.question}</p>
        
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                currentSelections.includes(index) ? 'selected' : ''
              } ${allowMultiple ? 'multiple' : 'single'}`}
              onClick={() => handleOptionClick(index)}
            >
              {allowMultiple ? (
                <div className="option-checkbox">
                  <div className={`checkbox ${currentSelections.includes(index) ? 'checked' : ''}`}>
                    {currentSelections.includes(index) && '✓'}
                  </div>
                </div>
              ) : (
                <span className="option-number">{index + 1}</span>
              )}
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        <div className="navigation-buttons">
          <div className="nav-left">
            {canGoBack && (
              <button className="btn btn-secondary back-btn" onClick={onBack}>
                ← Previous Question
              </button>
            )}
          </div>
          
          <div className="nav-center">
            <div className="selection-info">
              {allowMultiple ? (
                <span>
                  {currentSelections.length} option{currentSelections.length !== 1 ? 's' : ''} selected
                </span>
              ) : (
                <span>
                  {currentSelections.length > 0 ? 'Option selected' : 'Select an option'}
                </span>
              )}
            </div>
          </div>

          <div className="nav-right">
            <button 
              className="btn btn-primary next-btn" 
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              {questionNumber === totalQuestions ? 'See Results' : 'Next Question'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;