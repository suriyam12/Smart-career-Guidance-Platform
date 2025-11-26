import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();

  const courseCategories = [
    'all',
    'technology',
    'business',
    'design',
    'data-science',
    'marketing',
    'healthcare',
    'finance',
    'engineering',
    'creative-arts',
    'education',
    'personal-development'
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const comprehensiveCourses = [
        // Technology Courses
        {
          id: 1,
          title: 'Complete Web Development Bootcamp',
          platform: 'Udemy',
          category: 'technology',
          duration: '40 hours',
          level: 'Beginner to Advanced',
          rating: 4.7,
          students: 1500000,
          price: '$89.99',
          originalPrice: '$189.99',
          image: 'https://img-c.udemycdn.com/course/240x135/1565838_e54e_16.jpg',
          link: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
          skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB']
        },
        {
          id: 2,
          title: 'Python for Everybody Specialization',
          platform: 'Coursera',
          category: 'technology',
          duration: '3 months',
          level: 'Beginner',
          rating: 4.8,
          students: 1200000,
          price: 'Free',
          originalPrice: '$49/month',
          image: 'https://img-c.udemycdn.com/course/240x135/903744_8eb2.jpg',
          link: 'https://www.coursera.org/specializations/python',
          skills: ['Python', 'Programming', 'Data Structures', 'APIs']
        },
        {
          id: 3,
          title: 'AWS Cloud Practitioner Essentials',
          platform: 'AWS Training',
          category: 'technology',
          duration: '6 hours',
          level: 'Beginner',
          rating: 4.6,
          students: 800000,
          price: 'Free',
          originalPrice: 'Free',
          image: 'https://img-c.udemycdn.com/course/240x135/3148696_4e81_3.jpg',
          link: 'https://www.aws.training/Details/eLearning?id=32143',
          skills: ['AWS', 'Cloud Computing', 'Infrastructure', 'Security']
        },

        // Data Science Courses
        {
          id: 4,
          title: 'Machine Learning Specialization',
          platform: 'Coursera',
          category: 'data-science',
          duration: '3 months',
          level: 'Intermediate',
          rating: 4.8,
          students: 500000,
          price: 'Free',
          originalPrice: '$49/month',
          image: 'https://img-c.udemycdn.com/course/240x135/950390_270f_3.jpg',
          link: 'https://www.coursera.org/specializations/machine-learning-introduction',
          skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis']
        },
        {
          id: 5,
          title: 'Data Science Professional Certificate',
          platform: 'edX',
          category: 'data-science',
          duration: '9 months',
          level: 'Intermediate',
          rating: 4.5,
          students: 300000,
          price: '$356',
          originalPrice: '$891',
          image: 'https://img-c.udemycdn.com/course/240x135/1754098_e0df_3.jpg',
          link: 'https://www.edx.org/professional-certificate/harvardx-data-science',
          skills: ['R', 'Statistics', 'Data Visualization', 'Machine Learning']
        },

        // Business Courses
        {
          id: 6,
          title: 'Business Foundations Specialization',
          platform: 'Coursera',
          category: 'business',
          duration: '6 months',
          level: 'Beginner',
          rating: 4.7,
          students: 400000,
          price: 'Free',
          originalPrice: '$49/month',
          image: 'https://img-c.udemycdn.com/course/240x135/3510304_8f5c_3.jpg',
          link: 'https://www.coursera.org/specializations/wharton-business-foundations',
          skills: ['Marketing', 'Accounting', 'Operations', 'Strategy']
        },
        {
          id: 7,
          title: 'Project Management Principles',
          platform: 'Google Career Certificates',
          category: 'business',
          duration: '6 months',
          level: 'Beginner',
          rating: 4.6,
          students: 600000,
          price: '$39/month',
          originalPrice: '$39/month',
          image: 'https://img-c.udemycdn.com/course/240x135/3968766_5d3a_4.jpg',
          link: 'https://grow.google/certificates/project-management/',
          skills: ['Project Planning', 'Risk Management', 'Stakeholder Management']
        },

        // Design Courses
        {
          id: 8,
          title: 'UI/UX Design Specialization',
          platform: 'Coursera',
          category: 'design',
          duration: '6 months',
          level: 'Beginner',
          rating: 4.6,
          students: 300000,
          price: 'Free',
          originalPrice: '$49/month',
          image: 'https://img-c.udemycdn.com/course/240x135/1650610_6654_3.jpg',
          link: 'https://www.coursera.org/specializations/ui-ux-design',
          skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping']
        },
        {
          id: 9,
          title: 'Graphic Design Masterclass',
          platform: 'Udemy',
          category: 'design',
          duration: '15 hours',
          level: 'Beginner to Advanced',
          rating: 4.7,
          students: 250000,
          price: '$84.99',
          originalPrice: '$189.99',
          image: 'https://img-c.udemycdn.com/course/240x135/1643044_299d_5.jpg',
          link: 'https://www.udemy.com/course/graphic-design-masterclass/',
          skills: ['Photoshop', 'Illustrator', 'Typography', 'Branding']
        },

        // Marketing Courses
        {
          id: 10,
          title: 'Digital Marketing Mastery',
          platform: 'Google Digital Garage',
          category: 'marketing',
          duration: '40 hours',
          level: 'Beginner',
          rating: 4.5,
          students: 800000,
          price: 'Free',
          originalPrice: 'Free',
          image: 'https://img-c.udemycdn.com/course/240x135/914296_3670_8.jpg',
          link: 'https://learndigital.withgoogle.com/digitalgarage',
          skills: ['SEO', 'Social Media', 'Google Analytics', 'Content Marketing']
        },
        {
          id: 11,
          title: 'Social Media Marketing Professional Certificate',
          platform: 'Meta',
          category: 'marketing',
          duration: '5 months',
          level: 'Beginner',
          rating: 4.6,
          students: 350000,
          price: 'Free',
          originalPrice: 'Free',
          image: 'https://img-c.udemycdn.com/course/240x135/4051320_3aa3_3.jpg',
          link: 'https://www.coursera.org/professional-certificates/facebook-social-media-marketing',
          skills: ['Facebook Ads', 'Instagram Marketing', 'Content Strategy']
        },

        // Healthcare Courses
        {
          id: 12,
          title: 'Introduction to Public Health',
          platform: 'Coursera',
          category: 'healthcare',
          duration: '15 hours',
          level: 'Beginner',
          rating: 4.7,
          students: 150000,
          price: 'Free',
          originalPrice: '$49',
          image: 'https://img-c.udemycdn.com/course/240x135/2480346_3023_3.jpg',
          link: 'https://www.coursera.org/learn/public-health',
          skills: ['Epidemiology', 'Health Policy', 'Community Health']
        },
        {
          id: 13,
          title: 'Anatomy & Physiology Specialization',
          platform: 'Coursera',
          category: 'healthcare',
          duration: '4 months',
          level: 'Beginner',
          rating: 4.8,
          students: 200000,
          price: 'Free',
          originalPrice: '$49/month',
          image: 'https://img-c.udemycdn.com/course/240x135/828006_0a25_5.jpg',
          link: 'https://www.coursera.org/specializations/anatomy-physiology',
          skills: ['Human Anatomy', 'Medical Terminology', 'Physiology']
        },

        // Finance Courses
        {
          id: 14,
          title: 'Financial Markets',
          platform: 'Coursera',
          category: 'finance',
          duration: '33 hours',
          level: 'Beginner',
          rating: 4.8,
          students: 400000,
          price: 'Free',
          originalPrice: '$79',
          image: 'https://img-c.udemycdn.com/course/240x135/1754002_6c0d_2.jpg',
          link: 'https://www.coursera.org/learn/financial-markets-global',
          skills: ['Investment', 'Risk Management', 'Financial Analysis']
        },
        {
          id: 15,
          title: 'Introduction to Corporate Finance',
          platform: 'edX',
          category: 'finance',
          duration: '6 weeks',
          level: 'Beginner',
          rating: 4.5,
          students: 180000,
          price: 'Free',
          originalPrice: '$199',
          image: 'https://img-c.udemycdn.com/course/240x135/1453444_00a9_3.jpg',
          link: 'https://www.edx.org/course/introduction-to-corporate-finance-2',
          skills: ['Financial Statements', 'Valuation', 'Capital Budgeting']
        },

        // Engineering Courses
        {
          id: 16,
          title: 'Mechanical Engineering and Electrical Engineering Explained',
          platform: 'Udemy',
          category: 'engineering',
          duration: '9 hours',
          level: 'Beginner',
          rating: 4.4,
          students: 120000,
          price: '$84.99',
          originalPrice: '$189.99',
          image: 'https://img-c.udemycdn.com/course/240x135/3147464_8f3e_4.jpg',
          link: 'https://www.udemy.com/course/mechanical-engineering-and-electrical-engineering-explained/',
          skills: ['Mechanical Systems', 'Electrical Circuits', 'Engineering Principles']
        },
        {
          id: 17,
          title: 'Civil Engineering: Structural Analysis',
          platform: 'edX',
          category: 'engineering',
          duration: '8 weeks',
          level: 'Intermediate',
          rating: 4.6,
          students: 90000,
          price: 'Free',
          originalPrice: '$149',
          image: 'https://img-c.udemycdn.com/course/240x135/1045092_8c2f_6.jpg',
          link: 'https://www.edx.org/course/structural-analysis',
          skills: ['Structural Design', 'Load Analysis', 'Building Codes']
        },

        // Creative Arts Courses
        {
          id: 18,
          title: 'Music Production Specialization',
          platform: 'Coursera',
          category: 'creative-arts',
          duration: '6 months',
          level: 'Beginner',
          rating: 4.7,
          students: 150000,
          price: 'Free',
          originalPrice: '$49/month',
          image: 'https://img-c.udemycdn.com/course/240x135/1327382_6a16_5.jpg',
          link: 'https://www.coursera.org/specializations/music-production',
          skills: ['Audio Engineering', 'Mixing', 'Mastering', 'DAW']
        },
        {
          id: 19,
          title: 'Photography Masterclass',
          platform: 'Udemy',
          category: 'creative-arts',
          duration: '22 hours',
          level: 'All Levels',
          rating: 4.7,
          students: 300000,
          price: '$84.99',
          originalPrice: '$194.99',
          image: 'https://img-c.udemycdn.com/course/240x135/751902_0e89_5.jpg',
          link: 'https://www.udemy.com/course/photography-masterclass/',
          skills: ['Composition', 'Lighting', 'Camera Settings', 'Editing']
        },

        // Education Courses
        {
          id: 20,
          title: 'Learning How to Learn',
          platform: 'Coursera',
          category: 'education',
          duration: '15 hours',
          level: 'Beginner',
          rating: 4.8,
          students: 3000000,
          price: 'Free',
          originalPrice: '$49',
          image: 'https://img-c.udemycdn.com/course/240x135/1362070_b8a1_2.jpg',
          link: 'https://www.coursera.org/learn/learning-how-to-learn',
          skills: ['Study Techniques', 'Memory', 'Procrastination', 'Learning Methods']
        },
        {
          id: 21,
          title: 'Teaching Character and Creating Positive Classrooms',
          platform: 'Coursera',
          category: 'education',
          duration: '12 hours',
          level: 'Beginner',
          rating: 4.7,
          students: 120000,
          price: 'Free',
          originalPrice: '$49',
          image: 'https://img-c.udemycdn.com/course/240x135/1576856_9aeb_4.jpg',
          link: 'https://www.coursera.org/learn/teaching-character',
          skills: ['Classroom Management', 'Student Engagement', 'Educational Psychology']
        },

        // Personal Development Courses
        {
          id: 22,
          title: 'The Science of Well-Being',
          platform: 'Coursera',
          category: 'personal-development',
          duration: '19 hours',
          level: 'Beginner',
          rating: 4.9,
          students: 3500000,
          price: 'Free',
          originalPrice: '$49',
          image: 'https://img-c.udemycdn.com/course/240x135/1906852_0c6e_5.jpg',
          link: 'https://www.coursera.org/learn/the-science-of-well-being',
          skills: ['Happiness', 'Mindfulness', 'Productivity', 'Mental Health']
        },
        {
          id: 23,
          title: 'Successful Negotiation: Essential Strategies and Skills',
          platform: 'Coursera',
          category: 'personal-development',
          duration: '17 hours',
          level: 'Beginner',
          rating: 4.8,
          students: 800000,
          price: 'Free',
          originalPrice: '$79',
          image: 'https://img-c.udemycdn.com/course/240x135/433126_3ec5_3.jpg',
          link: 'https://www.coursera.org/learn/negotiation-skills',
          skills: ['Communication', 'Conflict Resolution', 'Persuasion', 'Deal Making']
        }
      ];
      
      setCourses(comprehensiveCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const enrollCourse = (courseLink) => {
    window.open(courseLink, '_blank');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'technology': '💻',
      'business': '💼',
      'design': '🎨',
      'data-science': '📊',
      'marketing': '📱',
      'healthcare': '🏥',
      'finance': '💰',
      'engineering': '⚙️',
      'creative-arts': '🎭',
      'education': '📚',
      'personal-development': '🌟',
      'all': '📚'
    };
    return icons[category] || '📚';
  };

  if (!user) {
    return (
      <div className="courses-container">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to explore courses.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="courses-container">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading comprehensive course catalog...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="container">
        <div className="courses-header">
          <h1>📚 Comprehensive Course Catalog</h1>
          <p>Explore 1000+ courses across all domains to advance your career</p>
          <div className="courses-stats">
            <span>🎯 {courses.length}+ Courses</span>
            <span>🏆 12 Domains</span>
            <span>⭐ 4.5+ Average Rating</span>
          </div>
        </div>

        <div className="courses-filters">
          <h3>Filter by Domain:</h3>
          <div className="filter-buttons">
            {courseCategories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="courses-info">
          <p>
            Showing {filteredCourses.length} courses in 
            <strong> {selectedCategory === 'all' ? 'All Domains' : selectedCategory.replace('-', ' ')}</strong>
          </p>
        </div>

        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <span className="platform-badge">{course.platform}</span>
                <span className="category-badge">
                  {getCategoryIcon(course.category)} {course.category.replace('-', ' ')}
                </span>
              </div>
              
              <div className="course-content">
                <h3>{course.title}</h3>
                
                <div className="course-meta">
                  <span className="duration">⏱️ {course.duration}</span>
                  <span className="level">📊 {course.level}</span>
                  <span className="rating">⭐ {course.rating} ({course.students.toLocaleString()})</span>
                </div>

                <div className="course-skills">
                  <strong>Skills you'll learn:</strong>
                  <div className="skills-tags">
                    {course.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="course-pricing">
                  <span className="price">{course.price}</span>
                  {course.originalPrice && course.price !== course.originalPrice && (
                    <span className="original-price">{course.originalPrice}</span>
                  )}
                  {course.price === 'Free' && (
                    <span className="free-badge">🎁 Free</span>
                  )}
                </div>

                <button 
                  onClick={() => enrollCourse(course.link)}
                  className="btn btn-primary enroll-btn"
                >
                  Enroll Now on {course.platform}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="no-courses">
            <h3>No courses found in this category</h3>
            <p>Try selecting a different domain or check back later for new courses.</p>
          </div>
        )}

        <div className="courses-footer">
          <h3>💡 Need Help Choosing?</h3>
          <p>
            Take our <a href="/quiz">Career Assessment Quiz</a> to get personalized course recommendations 
            based on your skills and interests.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Courses;