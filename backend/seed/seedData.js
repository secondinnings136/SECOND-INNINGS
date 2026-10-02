const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Opportunity = require('../models/Opportunity');
const Testimonial = require('../models/Testimonial');
const Resource = require('../models/Resource');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const opportunities = [
  {
    name: "Tata Trusts Scholarships",
    category: "scholarships",
    bestFor: "Students pursuing higher education in India",
    eligibility: "Meritorious students across various disciplines",
    whatItOffers: "Financial assistance for tuition fee and other related expenses",
    locationMode: "physical",
    costFunding: "Scholarship",
    officialSource: "https://www.tatatrusts.org/",
    whyUseful: "Helps alleviate financial burden for deserving students",
    isFeatured: true
  },
  {
    name: "LAMP Fellowship",
    category: "fellowships",
    bestFor: "Young professionals interested in public policy",
    eligibility: "Undergraduate degree in any discipline, age below 25",
    whatItOffers: "Mentorship by a Member of Parliament, exposure to policy making",
    locationMode: "physical",
    location: "New Delhi",
    costFunding: "Stipend",
    officialSource: "https://prsindia.org/lamp",
    whyUseful: "Unparalleled exposure to the Indian legislative process",
    isFeatured: true
  },
  {
    name: "Ashoka Young Changemakers",
    category: "social-impact",
    bestFor: "Teenagers with a proven track record of social impact",
    eligibility: "Under 20 years of age, team player",
    whatItOffers: "Network, mentorship, and resources to scale impact",
    locationMode: "hybrid",
    costFunding: "Free",
    officialSource: "https://www.ashoka.org/en-in/program/ashoka-young-changemakers",
    whyUseful: "Connects young leaders with a global network of changemakers",
    isFeatured: true
  },
  {
    name: "IIM Bangalore - Digital Marketing for Entrepreneurs",
    category: "courses",
    bestFor: "Aspiring entrepreneurs and small business owners",
    eligibility: "Anyone interested in digital marketing",
    whatItOffers: "Comprehensive understanding of digital marketing strategies",
    locationMode: "online",
    costFunding: "Paid",
    officialSource: "https://iimbx.edu.in/",
    whyUseful: "Provides practical skills for growing a business online"
  },
  {
    name: "NITI Aayog Internship Scheme",
    category: "internships",
    bestFor: "Undergraduate/Postgraduate students",
    eligibility: "Pursuing/completed UG/PG degrees",
    whatItOffers: "Exposure to the Government of India's nodal agency",
    locationMode: "physical",
    location: "New Delhi",
    costFunding: "Unpaid",
    officialSource: "https://niti.gov.in/internship",
    whyUseful: "Great for understanding policy formulation and execution"
  },
  {
    name: "Young India Fellowship",
    category: "higher-education",
    bestFor: "Recent graduates seeking a multidisciplinary education",
    eligibility: "Undergraduate degree in any discipline",
    whatItOffers: "One-year postgraduate diploma in Liberal Studies",
    locationMode: "physical",
    location: "Sonipat, Haryana",
    costFunding: "Paid (Scholarships available)",
    officialSource: "https://www.ashoka.edu.in/yif",
    whyUseful: "Develops critical thinking and problem-solving skills"
  },
  {
    name: "Startup India Seed Fund Scheme",
    category: "entrepreneurship",
    bestFor: "Early-stage startups",
    eligibility: "DPIIT recognized startups",
    whatItOffers: "Financial assistance for proof of concept, prototype development",
    locationMode: "online",
    costFunding: "Funding",
    officialSource: "https://seedfund.startupindia.gov.in/",
    whyUseful: "Provides crucial early-stage capital for startups"
  },
  {
    name: "CII Young Indians (Yi)",
    category: "professional-exposure",
    bestFor: "Young professionals and entrepreneurs",
    eligibility: "Aged between 21 and 40",
    whatItOffers: "Platform to realize the dream of a developed nation",
    locationMode: "hybrid",
    costFunding: "Paid Membership",
    officialSource: "https://youngindians.net/",
    whyUseful: "Excellent networking and leadership development opportunities"
  }
];

// Testimonials from LinkedIn reflections in Second_Innings_Website_Copy_for_Aman.docx
const testimonials = [
  {
    name: "Priya Kaushik",
    role: "Project Manager | Business Analyst",
    quote: "You never just prepared students for university, you prepared us for life. You taught us to take ownership, stay disciplined, think independently, stand by our decisions, and never compromise on our values.",
    isApproved: true,
    isFeatured: true,
    order: 1
  },
  {
    name: "Bismanpreet Singh",
    role: "Startup Ecosystem Professional | Former Student Council President",
    quote: "You were the person who saw potential in me before I did. The confidence to take on opportunities, make difficult decisions, and lead people is something I owe to you.",
    isApproved: true,
    isFeatured: true,
    order: 2
  },
  {
    name: "Himangi Chaturvedi",
    role: "Associate Project Manager",
    quote: "Whenever I found myself unsure of the next step, your perspective helped me see possibilities I couldn't see on my own. Every student deserves to have a mentor like you.",
    isApproved: true,
    isFeatured: true,
    order: 3
  },
  {
    name: "Omprakash Kumawat",
    role: "Software Engineer",
    quote: "What I value most is that you never simply gave answers - you helped me learn how to find them myself.",
    isApproved: true,
    isFeatured: true,
    order: 4
  },
  {
    name: "Jia Soni",
    role: "HR Manager | Coaching & Mentoring",
    quote: "The professional world has made us realize exactly why you pushed us so hard. You didn't just teach us, you built our character and prepared us for reality.",
    isApproved: true,
    isFeatured: true,
    order: 5
  },
  {
    name: "Diya Garg",
    role: "Data Science Student",
    quote: "You've been more than a mentor - you've been a catalyst. Every conversation with you left me feeling clearer, stronger, and more capable.",
    isApproved: true,
    isFeatured: true,
    order: 6
  }
];

const resources = [
  {
    title: "Navigating Career Choices in the 21st Century",
    slug: "navigating-career-choices",
    category: "for-students",
    excerpt: "A guide for high school students to explore diverse career options.",
    content: "<p>The 21st century offers a plethora of career options that were unheard of a decade ago. This guide helps you navigate through them.</p>",
    readingTime: 5,
    isPublished: true,
    tags: ["career", "students", "future"]
  },
  {
    title: "Supporting Your Child's Ambitions",
    slug: "supporting-child-ambitions",
    category: "for-parents",
    excerpt: "How parents can be the wind beneath their child's wings without being overbearing.",
    content: "<p>Parenting teenagers requires a delicate balance of guidance and freedom. Learn how to support your child effectively.</p>",
    readingTime: 7,
    isPublished: true,
    tags: ["parenting", "support", "ambition"]
  },
  {
    title: "The IKIGAI Framework for Career Selection",
    slug: "ikigai-framework",
    category: "frameworks-tools",
    excerpt: "Using the Japanese concept of IKIGAI to find your life's purpose.",
    content: "<p>IKIGAI lies at the intersection of what you love, what you are good at, what the world needs, and what you can be paid for.</p>",
    readingTime: 4,
    isPublished: true,
    tags: ["ikigai", "framework", "purpose"]
  }
];

const seedData = async () => {
  try {
    await Opportunity.deleteMany();
    await Testimonial.deleteMany();
    await Resource.deleteMany();

    await Opportunity.insertMany(opportunities);
    await Testimonial.insertMany(testimonials);
    await Resource.insertMany(resources);

    console.log('Data Imported Successfully with Authentic LinkedIn Testimonials!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedData();
