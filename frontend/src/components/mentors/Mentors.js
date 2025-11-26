import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Mentors.css';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [requestLoading, setRequestLoading] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const domains = [
    'all', 'technology', 'business', 'design', 'data-science', 
    'marketing', 'healthcare', 'finance', 'engineering', 
    'creative-arts', 'education', 'entrepreneurship'
  ];

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const comprehensiveMentors = [
        {
          id: 1,
          name: 'Sarah Chen',
          title: 'Senior Software Engineer at Google',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          experience: '8 years',
          rating: 4.9,
          sessions: 245,
          specialization: ['Web Development', 'JavaScript', 'React', 'Node.js'],
          bio: 'Full-stack developer with expertise in modern web technologies. Passionate about mentoring junior developers.',
          availability: 'Available',
          company: 'Google',
          platform: 'LinkedIn',
          hourlyRate: '$120',
          domain: 'technology'
        },
        {
          id: 2,
          name: 'Alex Rodriguez',
          title: 'Lead DevOps Engineer at AWS',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          experience: '10 years',
          rating: 4.8,
          sessions: 189,
          specialization: ['Cloud Computing', 'DevOps', 'Kubernetes', 'AWS'],
          bio: 'Cloud infrastructure specialist helping teams scale their applications efficiently.',
          availability: 'Limited',
          company: 'Amazon Web Services',
          platform: 'ADPList',
          hourlyRate: '$150',
          domain: 'technology'
        },
        {
          id: 3,
          name: 'Priya Patel',
          title: 'Mobile Development Lead at Meta',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          experience: '7 years',
          rating: 4.7,
          sessions: 167,
          specialization: ['iOS Development', 'Swift', 'React Native', 'Mobile UI/UX'],
          bio: 'Mobile app developer focused on creating seamless user experiences across platforms.',
          availability: 'Available',
          company: 'Meta',
          platform: 'MentorCruise',
          hourlyRate: '$110',
          domain: 'technology'
        },
        {
          id: 4,
          name: 'Marcus Johnson',
          title: 'Cybersecurity Architect at Microsoft',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          experience: '12 years',
          rating: 4.9,
          sessions: 312,
          specialization: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Compliance'],
          bio: 'Security expert helping organizations protect their digital assets and maintain compliance.',
          availability: 'Available',
          company: 'Microsoft',
          platform: 'Springboard',
          hourlyRate: '$180',
          domain: 'technology'
        },
        {
          id: 5,
          name: 'Emily Watson',
          title: 'Product Manager at Salesforce',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          experience: '9 years',
          rating: 4.8,
          sessions: 198,
          specialization: ['Product Management', 'Agile', 'Roadmapping', 'Stakeholder Management'],
          bio: 'Product leader with experience in B2B SaaS products and cross-functional team leadership.',
          availability: 'Available',
          company: 'Salesforce',
          platform: 'Product Management',
          hourlyRate: '$130',
          domain: 'business'
        },
        {
          id: 6,
          name: 'David Kim',
          title: 'Management Consultant at McKinsey',
          avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
          experience: '11 years',
          rating: 4.9,
          sessions: 276,
          specialization: ['Strategy', 'Business Operations', 'Consulting', 'Leadership'],
          bio: 'Management consultant helping businesses optimize operations and drive growth.',
          availability: 'Limited',
          company: 'McKinsey & Company',
          platform: 'Consulting',
          hourlyRate: '$200',
          domain: 'business'
        },
        {
          id: 7,
          name: 'Lena Petrova',
          title: 'UX Director at Airbnb',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
          experience: '8 years',
          rating: 4.7,
          sessions: 154,
          specialization: ['UX Design', 'User Research', 'Design Systems', 'Prototyping'],
          bio: 'Design leader focused on creating user-centered products and building design teams.',
          availability: 'Available',
          company: 'Airbnb',
          platform: 'Dribbble',
          hourlyRate: '$125',
          domain: 'design'
        },
        {
          id: 8,
          name: 'Carlos Mendez',
          title: 'Creative Director at Netflix',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          experience: '15 years',
          rating: 4.9,
          sessions: 289,
          specialization: ['Brand Design', 'Visual Identity', 'Creative Direction', 'Motion Graphics'],
          bio: 'Award-winning creative director with extensive experience in entertainment and media.',
          availability: 'Limited',
          company: 'Netflix',
          platform: 'Behance',
          hourlyRate: '$160',
          domain: 'design'
        },
        {
          id: 9,
          name: 'Dr. Michael Zhang',
          title: 'Data Science Manager at Uber',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
          experience: '10 years',
          rating: 4.8,
          sessions: 223,
          specialization: ['Machine Learning', 'Python', 'Data Analysis', 'A/B Testing'],
          bio: 'PhD in Statistics with expertise in building machine learning models for business applications.',
          availability: 'Available',
          company: 'Uber',
          platform: 'Kaggle',
          hourlyRate: '$140',
          domain: 'data-science'
        },
        {
          id: 10,
          name: 'Nadia Williams',
          title: 'AI Research Scientist at OpenAI',
          avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
          experience: '6 years',
          rating: 4.9,
          sessions: 134,
          specialization: ['AI Research', 'Natural Language Processing', 'Deep Learning', 'Computer Vision'],
          bio: 'Research scientist working on cutting-edge AI technologies and their practical applications.',
          availability: 'Limited',
          company: 'OpenAI',
          platform: 'ResearchGate',
          hourlyRate: '$175',
          domain: 'data-science'
        },
        {
          id: 11,
          name: 'Sophie Martin',
          title: 'Head of Growth at Shopify',
          avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
          experience: '8 years',
          rating: 4.7,
          sessions: 187,
          specialization: ['Digital Marketing', 'Growth Hacking', 'SEO', 'Content Strategy'],
          bio: 'Growth marketing expert with proven track record in scaling e-commerce businesses.',
          availability: 'Available',
          company: 'Shopify',
          platform: 'Growth.org',
          hourlyRate: '$115',
          domain: 'marketing'
        },
        {
          id: 12,
          name: 'James Wilson',
          title: 'VP of Marketing at HubSpot',
          avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
          experience: '12 years',
          rating: 4.8,
          sessions: 245,
          specialization: ['B2B Marketing', 'Marketing Automation', 'CRM', 'Demand Generation'],
          bio: 'Marketing leader specializing in B2B SaaS marketing strategies and team building.',
          availability: 'Limited',
          company: 'HubSpot',
          platform: 'MarketingProfs',
          hourlyRate: '$155',
          domain: 'marketing'
        },
        {
          id: 13,
          name: 'Dr. Amanda Foster',
          title: 'Medical Director at Mayo Clinic',
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
          experience: '15 years',
          rating: 4.9,
          sessions: 198,
          specialization: ['Healthcare Management', 'Medical Research', 'Patient Care', 'Telemedicine'],
          bio: 'Board-certified physician with expertise in healthcare innovation and digital health.',
          availability: 'Available',
          company: 'Mayo Clinic',
          platform: 'Doximity',
          hourlyRate: '$190',
          domain: 'healthcare'
        },
        {
          id: 14,
          name: 'Robert Thompson',
          title: 'Investment Banker at Goldman Sachs',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
          experience: '14 years',
          rating: 4.8,
          sessions: 267,
          specialization: ['Investment Banking', 'Financial Modeling', 'M&A', 'Valuation'],
          bio: 'Senior investment banker with extensive experience in capital markets and corporate finance.',
          availability: 'Limited',
          company: 'Goldman Sachs',
          platform: 'Wall Street Oasis',
          hourlyRate: '$220',
          domain: 'finance'
        },
        {
          id: 15,
          name: 'Dr. Elena Popova',
          title: 'Principal Engineer at SpaceX',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
          experience: '16 years',
          rating: 4.9,
          sessions: 312,
          specialization: ['Aerospace Engineering', 'Mechanical Design', 'Systems Engineering', 'Project Management'],
          bio: 'Aerospace engineer leading innovative projects in space technology and propulsion systems.',
          availability: 'Limited',
          company: 'SpaceX',
          platform: 'Engineering.com',
          hourlyRate: '$185',
          domain: 'engineering'
        },
        {
          id: 16,
          name: 'Isabella Rossi',
          title: 'Creative Director at Pixar',
          avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
          experience: '18 years',
          rating: 4.9,
          sessions: 289,
          specialization: ['Animation', 'Storyboarding', 'Character Design', 'Visual Development'],
          bio: 'Award-winning animator and creative director with extensive experience in feature animation.',
          availability: 'Available',
          company: 'Pixar',
          platform: 'ArtStation',
          hourlyRate: '$165',
          domain: 'creative-arts'
        },
        {
          id: 17,
          name: 'Dr. Benjamin Carter',
          title: 'Professor at Stanford University',
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
          experience: '20 years',
          rating: 4.9,
          sessions: 345,
          specialization: ['Higher Education', 'Curriculum Development', 'Academic Research', 'Teaching Methods'],
          bio: 'Distinguished professor and education researcher focused on innovative teaching methodologies.',
          availability: 'Available',
          company: 'Stanford University',
          platform: 'Academic',
          hourlyRate: '$135',
          domain: 'education'
        },
        {
          id: 18,
          name: 'Jessica Lin',
          title: 'Founder & CEO at Tech Startup',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
          experience: '8 years',
          rating: 4.7,
          sessions: 176,
          specialization: ['Startup Funding', 'Product-Market Fit', 'Team Building', 'Scaling Businesses'],
          bio: 'Serial entrepreneur with multiple successful exits and expertise in venture capital fundraising.',
          availability: 'Available',
          company: 'Multiple Startups',
          platform: 'Y Combinator',
          hourlyRate: '$145',
          domain: 'entrepreneurship'
        }
      ];
      
      setMentors(comprehensiveMentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = selectedDomain === 'all' 
    ? mentors 
    : mentors.filter(mentor => mentor.domain === selectedDomain);

  // Send mentorship request to backend
  const requestMentorship = async (mentorId) => {
    if (!user) {
      alert('Please log in to request mentorship');
      navigate('/login');
      return;
    }

    setRequestLoading(mentorId);
    
    try {
      const mentor = mentors.find(m => m.id === mentorId);
      
      if (!mentor) {
        throw new Error('Mentor not found');
      }

      console.log('🚀 Sending mentorship request for:', mentor.name);

      const response = await fetch('http://localhost:5000/api/mentorship/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: mentor.id,
          mentorName: mentor.name,
          message: `I would like to request mentorship with ${mentor.name} regarding ${mentor.specialization.join(', ')} in the ${mentor.domain} domain.`,
          userId: user.id // Send user ID from auth context
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to send request: ${response.status}`);
      }

      if (data.success) {
        alert(`✅ Mentorship request sent to ${mentor.name}!\n\nYour request has been submitted and is now pending admin approval. The admin will review your request and update the status soon.`);
        console.log('✅ Request saved successfully:', data);
      } else {
        throw new Error(data.message || 'Failed to send request');
      }

    } catch (error) {
      console.error('❌ Error sending mentorship request:', error);
      
      if (error.message.includes('Failed to fetch')) {
        alert('❌ Cannot connect to server. Please make sure the backend is running on localhost:5000');
      } else if (error.message.includes('User not found')) {
        alert('❌ User session expired. Please log in again.');
        navigate('/login');
      } else {
        alert(`❌ Failed to send request: ${error.message}`);
      }
    } finally {
      setRequestLoading(null);
    }
  };

  const viewProfile = (mentor) => {
    navigate('/mentor-profile', { state: { mentor } });
  };

  const getDomainIcon = (domain) => {
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
      'entrepreneurship': '🚀',
      'all': '👥'
    };
    return icons[domain] || '👥';
  };

  if (!user) {
    return (
      <div className="mentors-container">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to explore mentors and request mentorship sessions.</p>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mentors-container">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading mentors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mentors-container">
      <div className="container">
        <div className="mentors-header">
          <h1>👥 Find Your Mentor</h1>
          <p>Connect with experienced professionals across various industries and platforms. Request mentorship and track your requests in the admin dashboard.</p>
        </div>

        <div className="mentors-filters">
          <h3>Filter by Domain:</h3>
          <div className="filter-buttons">
            {domains.map(domain => (
              <button
                key={domain}
                className={`filter-btn ${selectedDomain === domain ? 'active' : ''}`}
                onClick={() => setSelectedDomain(domain)}
              >
                {getDomainIcon(domain)} {domain.charAt(0).toUpperCase() + domain.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="mentors-counter">
          <span>{filteredMentors.length} mentors in {selectedDomain === 'all' ? 'All Domains' : selectedDomain.replace('-', ' ')}</span>
        </div>

        <div className="mentors-grid">
          {filteredMentors.map(mentor => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-header">
                <img src={mentor.avatar} alt={mentor.name} className="mentor-avatar" />
                <div className="mentor-info">
                  <h3>{mentor.name}</h3>
                  <div className="mentor-title">{mentor.title}</div>
                  <div className="mentor-stats">
                    <span>⭐ {mentor.rating} ({mentor.sessions} sessions)</span>
                    <span>💼 {mentor.platform}</span>
                  </div>
                </div>
              </div>

              <div className="mentor-details">
                <p className="mentor-bio">{mentor.bio}</p>
                
                <div className="mentor-specialization">
                  <strong>Specializations:</strong>
                  <div className="specialization-tags">
                    {mentor.specialization.map((skill, index) => (
                      <span key={index} className="specialization-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mentor-meta">
                <div className="mentor-details-left">
                  <span className="experience">📅 {mentor.experience}</span>
                  <span className="availability">{mentor.availability === 'Available' ? '✅ Available' : '🟡 Limited'}</span>
                </div>
                <div className="mentor-rate">
                  <span className="hourly-rate">{mentor.hourlyRate}/hr</span>
                </div>
              </div>

              <div className="mentor-actions">
                <button 
                  onClick={() => requestMentorship(mentor.id)}
                  className="btn btn-primary"
                  disabled={requestLoading === mentor.id}
                >
                  {requestLoading === mentor.id ? '🔄 Sending...' : 'Request Session'}
                </button>
                <button 
                  onClick={() => viewProfile(mentor)}
                  className="btn btn-outline"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="no-mentors">
            <h3>No mentors found in this domain</h3>
            <p>Try selecting a different domain or check back later for new mentors.</p>
          </div>
        )}

        <div className="mentorship-info">
          <h3>How Mentorship Works:</h3>
          <div className="info-steps">
            <div className="step">
              <span className="step-number">1</span>
              <p><strong>Request Session:</strong> Click "Request Session" on any mentor</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p><strong>Admin Review:</strong> Your request goes to admin for approval</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p><strong>Get Approved:</strong> Admin will accept and connect you with the mentor</p>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <p><strong>Start Session:</strong> Begin your mentorship journey!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;