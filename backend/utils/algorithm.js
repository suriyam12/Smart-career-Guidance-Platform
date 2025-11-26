// Enhanced career database with more details
const careersDatabase = {
  technology: {
    field: "Technology",
    description: "Careers in software development, data science, and IT",
    careers: [
      {
        name: "Software Developer",
        description: "Design, develop, and maintain software applications",
        salary: "$70,000 - $120,000",
        demand: "High",
        skills: ["Programming", "Problem Solving", "Algorithms"]
      },
      {
        name: "Data Scientist",
        description: "Analyze and interpret complex data to help organizations make decisions",
        salary: "$80,000 - $130,000",
        demand: "Very High",
        skills: ["Statistics", "Machine Learning", "Python"]
      },
      {
        name: "UX/UI Designer",
        description: "Design user interfaces and experiences for digital products",
        salary: "$60,000 - $100,000",
        demand: "High",
        skills: ["Design Thinking", "User Research", "Prototyping"]
      },
      {
        name: "Cybersecurity Analyst",
        description: "Protect organizations from cyber threats and security breaches",
        salary: "$75,000 - $120,000",
        demand: "Very High",
        skills: ["Network Security", "Risk Assessment", "Incident Response"]
      }
    ],
    courses: [
      { 
        name: "Full Stack Web Development", 
        platform: "Coursera", 
        link: "https://coursera.org/specializations/full-stack-react",
        duration: "6 months",
        level: "Beginner",
        skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"]
      },
      { 
        name: "Machine Learning Specialization", 
        platform: "Udemy", 
        link: "https://udemy.com/course/machinelearning",
        duration: "3 months",
        level: "Intermediate",
        skills: ["Python", "TensorFlow", "Neural Networks"]
      },
      { 
        name: "Google UX Design Professional Certificate", 
        platform: "Coursera", 
        link: "https://coursera.org/professional-certificates/google-ux-design",
        duration: "6 months",
        level: "Beginner",
        skills: ["Figma", "User Research", "Wireframing"]
      }
    ]
  },
  business: {
    field: "Business",
    description: "Careers in management, marketing, and entrepreneurship",
    careers: [
      {
        name: "Business Analyst",
        description: "Analyze business processes and recommend improvements",
        salary: "$60,000 - $95,000",
        demand: "High",
        skills: ["Analytical Thinking", "Communication", "Requirements Gathering"]
      },
      {
        name: "Digital Marketing Manager",
        description: "Develop and execute online marketing strategies",
        salary: "$55,000 - $90,000",
        demand: "High",
        skills: ["SEO", "Social Media", "Content Strategy"]
      },
      {
        name: "Project Manager",
        description: "Lead projects from conception to completion",
        salary: "$70,000 - $110,000",
        demand: "High",
        skills: ["Leadership", "Planning", "Risk Management"]
      }
    ],
    courses: [
      { 
        name: "Business Analytics Specialization", 
        platform: "Coursera", 
        link: "https://coursera.org/specializations/business-analytics",
        duration: "5 months",
        level: "Beginner",
        skills: ["Excel", "SQL", "Data Analysis"]
      },
      { 
        name: "Digital Marketing Masterclass", 
        platform: "Udemy", 
        link: "https://udemy.com/course/digital-marketing-masterclass",
        duration: "4 months",
        level: "Beginner",
        skills: ["SEO", "Social Media", "Email Marketing"]
      }
    ]
  },
  healthcare: {
    field: "Healthcare",
    description: "Careers in medicine, nursing, and healthcare administration",
    careers: [
      {
        name: "Registered Nurse",
        description: "Provide patient care and support in healthcare settings",
        salary: "$60,000 - $90,000",
        demand: "Very High",
        skills: ["Patient Care", "Medical Knowledge", "Empathy"]
      },
      {
        name: "Medical Researcher",
        description: "Conduct research to advance medical knowledge",
        salary: "$70,000 - $110,000",
        demand: "High",
        skills: ["Research Methodology", "Data Analysis", "Scientific Writing"]
      }
    ],
    courses: [
      { 
        name: "Introduction to Healthcare", 
        platform: "Coursera", 
        link: "https://coursera.org/learn/healthcare",
        duration: "2 months",
        level: "Beginner",
        skills: ["Healthcare Systems", "Medical Terminology"]
      }
    ]
  },
  creative: {
    field: "Creative Arts",
    description: "Careers in design, content creation, and media",
    careers: [
      {
        name: "Graphic Designer",
        description: "Create visual content for various media",
        salary: "$45,000 - $75,000",
        demand: "Medium",
        skills: ["Adobe Creative Suite", "Typography", "Layout Design"]
      },
      {
        name: "Content Creator",
        description: "Develop engaging content for digital platforms",
        salary: "$40,000 - $80,000",
        demand: "High",
        skills: ["Writing", "Video Editing", "Social Media"]
      }
    ],
    courses: [
      { 
        name: "Graphic Design Masterclass", 
        platform: "Udemy", 
        link: "https://udemy.com/course/graphic-design-masterclass",
        duration: "3 months",
        level: "Beginner",
        skills: ["Photoshop", "Illustrator", "Design Principles"]
      }
    ]
  }
};

const careerMatchingAlgorithm = (answers) => {
  console.log('Algorithm received answers:', answers);
  
  let scores = {
    technology: 0,
    business: 0,
    healthcare: 0,
    creative: 0
  };

  // Enhanced scoring based on answers
  answers.forEach((answer, index) => {
    console.log(`Processing answer ${index}: ${answer}`);
    
    switch (index) {
      case 0: // Interests
        if (answer === 0) scores.technology += 4;
        if (answer === 1) scores.healthcare += 4;
        if (answer === 2) scores.creative += 4;
        if (answer === 3) scores.business += 4;
        if (answer === 4) scores.technology += 3;
        break;
      case 1: // Skills
        if (answer === 0) scores.technology += 4;
        if (answer === 1) scores.business += 4;
        if (answer === 2) scores.creative += 4;
        if (answer === 3) {
          scores.technology += 2;
          scores.business += 2;
        }
        if (answer === 4) {
          scores.healthcare += 3;
          scores.technology += 1;
        }
        break;
      case 2: // Preferences
        if (answer === 0) scores.business += 3;
        if (answer === 1) scores.technology += 3;
        if (answer === 2) scores.creative += 4;
        if (answer === 3) scores.healthcare += 3;
        if (answer === 4) {
          scores.business += 2;
          scores.technology += 2;
        }
        break;
      case 3: // Academic
        if (answer === 0) scores.technology += 4;
        if (answer === 1) scores.business += 4;
        if (answer === 2) scores.creative += 4;
        if (answer === 3) {
          scores.healthcare += 3;
          scores.technology += 1;
        }
        if (answer === 4) scores.healthcare += 4;
        break;
      case 4: // Learning style
        if (answer === 0) scores.technology += 3;
        if (answer === 1) {
          scores.healthcare += 2;
          scores.business += 1;
        }
        if (answer === 2) scores.creative += 3;
        if (answer === 3) scores.business += 3;
        if (answer === 4) scores.business += 2;
        break;
      default:
        console.log(`Unknown question index: ${index}`);
    }
  });

  console.log('Final scores:', scores);

  // Find top career field
  const topField = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  const maxScore = Math.max(...Object.values(scores));
  const totalPossibleScore = 20;
  
  const scorePercentage = Math.round((maxScore / totalPossibleScore) * 100);
  
  const fieldData = careersDatabase[topField];
  
  if (!fieldData) {
    throw new Error(`No field data found for: ${topField}`);
  }

  // Generate strengths based on answers
  const strengths = generateStrengths(answers);
  
  // Generate personalized recommendations
  const recommendations = generateRecommendations(topField, strengths);

  console.log('Algorithm results:', {
    score: scorePercentage,
    field: fieldData.field,
    careersCount: fieldData.careers.length,
    coursesCount: fieldData.courses.length
  });

  return {
    score: scorePercentage,
    careers: fieldData.careers,
    courses: fieldData.courses,
    field: fieldData.field,
    fieldDescription: fieldData.description,
    strengths: strengths,
    recommendations: recommendations,
    detailedScores: scores
  };
};

const generateStrengths = (answers) => {
  const strengthMapping = {
    0: ["Analytical Thinking", "Problem Solving"],
    1: ["Communication", "Empathy", "Teaching"],
    2: ["Creativity", "Visual Thinking", "Innovation"],
    3: ["Organization", "Planning", "Leadership"],
    4: ["Technical Aptitude", "Adaptability"]
  };

  const strengths = new Set();
  answers.forEach(answer => {
    if (strengthMapping[answer]) {
      strengthMapping[answer].forEach(strength => strengths.add(strength));
    }
  });

  return Array.from(strengths).slice(0, 5);
};

const generateRecommendations = (topField, strengths) => {
  const recommendations = {
    technology: `Based on your strong ${strengths.join(', ')}, you show excellent potential in technology careers. Consider focusing on software development or data science roles where your analytical skills will shine.`,
    business: `Your strengths in ${strengths.join(', ')} make you well-suited for business roles. Consider careers in management, marketing, or entrepreneurship where your communication skills will be valuable.`,
    healthcare: `With your ${strengths.join(', ')}, you would excel in healthcare professions. Your empathy and analytical thinking are perfect for patient care or medical research.`,
    creative: `Your creative abilities in ${strengths.join(', ')} are ideal for design and media careers. Consider roles in graphic design, content creation, or UX design.`
  };

  return recommendations[topField] || "Based on your assessment, you have a diverse skill set that could excel in multiple career paths.";
};

module.exports = { careerMatchingAlgorithm, careersDatabase };