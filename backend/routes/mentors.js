const express = require('express');
const router = express.Router();

// Get all mentors - simple static data for now
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching mentors...');
    
    const mentors = [
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
      }
    ];

    console.log(`✅ Returning ${mentors.length} mentors`);

    res.json({
      success: true,
      mentors: mentors,
      total: mentors.length
    });

  } catch (error) {
    console.error('❌ Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentors',
      error: error.message
    });
  }
});

// Get specific mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Fetching mentor with ID: ${id}`);
    
    // For now, return a mock mentor
    const mentor = {
      id: parseInt(id),
      name: 'Sample Mentor',
      title: 'Senior Developer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      experience: '5 years',
      rating: 4.5,
      sessions: 100,
      specialization: ['JavaScript', 'React'],
      bio: 'This is a sample mentor profile.',
      availability: 'Available',
      company: 'Tech Company',
      platform: 'LinkedIn',
      hourlyRate: '$100',
      domain: 'technology'
    };

    res.json({
      success: true,
      mentor: mentor
    });

  } catch (error) {
    console.error('❌ Error fetching mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentor',
      error: error.message
    });
  }
});

module.exports = router;