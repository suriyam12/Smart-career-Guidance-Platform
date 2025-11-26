const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

// Get all mentors (backend API endpoint)
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching mentors from database...');
    
    // Try to get mentors from database first
    let mentors = await Mentor.find({ isActive: true });
    
    // If no mentors in database, return static data
    if (mentors.length === 0) {
      console.log('📝 No mentors in database, returning static data');
      mentors = [
        {
          _id: '1',
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
          _id: '2',
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
        }
        // Add more mentors as needed...
      ];
    }

    console.log(`✅ Found ${mentors.length} mentors`);

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
    
    const mentor = await Mentor.findById(id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

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

// Seed sample mentors (for development)
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Seeding sample mentors...');
    
    // Clear existing mentors
    await Mentor.deleteMany({});
    
    const sampleMentors = [
      {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        title: "Senior Software Engineer at Google",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        experience: "8 years",
        rating: 4.9,
        sessions: 245,
        specialization: ["Web Development", "JavaScript", "React", "Node.js"],
        bio: "Full-stack developer with expertise in modern web technologies. Passionate about mentoring junior developers.",
        availability: "Available",
        company: "Google",
        platform: "LinkedIn",
        hourlyRate: "$120",
        domain: "technology",
        isActive: true
      },
      {
        name: "Alex Rodriguez",
        email: "alex.rodriguez@example.com",
        title: "Lead DevOps Engineer at AWS",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        experience: "10 years",
        rating: 4.8,
        sessions: 189,
        specialization: ["Cloud Computing", "DevOps", "Kubernetes", "AWS"],
        bio: "Cloud infrastructure specialist helping teams scale their applications efficiently.",
        availability: "Limited",
        company: "Amazon Web Services",
        platform: "ADPList",
        hourlyRate: "$150",
        domain: "technology",
        isActive: true
      }
    ];

    await Mentor.insertMany(sampleMentors);
    
    console.log('✅ Sample mentors seeded successfully');
    
    res.json({
      success: true,
      message: 'Sample mentors added successfully',
      count: sampleMentors.length
    });

  } catch (error) {
    console.error('❌ Error seeding mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding mentors',
      error: error.message
    });
  }
});

module.exports = router;