const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-network')
  .then(() => console.log('MongoDB connected for seeding posts'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedPosts = async () => {
  try {
    // Get some existing users to be post authors
    const users = await User.find().limit(10);
    
    if (users.length === 0) {
      console.log('No users found. Please create users first.');
      process.exit(1);
    }

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    const posts = [
      {
        author: users[0]._id,
        title: "We're Hiring: Senior Full-Stack Developer at TechCorp",
        content: "Exciting opportunity alert! 🚀\n\nMy company, TechCorp, is looking for a Senior Full-Stack Developer to join our growing team. We work with cutting-edge technologies including React, Node.js, and AWS.\n\nWhat we offer:\n- Competitive salary (₹20-30 LPA)\n- Remote-first culture\n- Stock options\n- Work on products used by millions\n\nIf you're interested or know someone who might be, feel free to reach out or apply directly through our careers page. Happy to answer any questions!\n\n#hiring #techjobs #fullstack",
        category: "Career Opportunities",
      },
      {
        author: users[1]._id,
        title: "Successfully Transitioned from Engineering to Product Management",
        content: "After 5 years as a software engineer, I made the leap to Product Management 6 months ago, and it's been an incredible journey!\n\nKey learnings:\n1. Technical background is a huge advantage in PM\n2. Communication skills matter more than you think\n3. Understanding user psychology is crucial\n4. Data-driven decision making is non-negotiable\n\nHappy to share more details about my transition journey. Feel free to ask questions or DM me if you're considering a similar move!",
        category: "Career Opportunities",
      },
      {
        author: users[2]._id,
        title: "Launched My AI SaaS Startup - Lessons Learned",
        content: "After 2 years of development and countless iterations, my team and I finally launched our AI-powered analytics platform! 🎉\n\nSome key lessons:\n- Start with a clear problem, not a solution\n- Early customer feedback is gold\n- Don't build in isolation - talk to users constantly\n- Technical excellence alone doesn't guarantee success\n- Building a strong team is everything\n\nCurrently at $50K MRR with 200+ paying customers. The journey has been challenging but incredibly rewarding. Would love to connect with other founders!",
        category: "Startup Ideas",
      },
      {
        author: users[3]._id,
        title: "Python vs Go for Backend Development in 2024?",
        content: "I'm architecting a new microservices system and debating between Python (FastAPI) and Go.\n\nOur requirements:\n- High throughput (100k+ requests/min)\n- Real-time data processing\n- Team has more Python experience\n- Need to scale quickly\n\nWould love to hear experiences from folks who've made this decision. What would you choose and why?",
        category: "Tech Talk",
      },
      {
        author: users[4]._id,
        title: "Free AI/ML Workshop This Weekend - Register Now!",
        content: "Hey everyone! 👋\n\nI'm conducting a free workshop on 'Building Production-Ready ML Models' this Saturday from 10 AM to 4 PM.\n\nTopics covered:\n- ML model deployment strategies\n- MLOps best practices\n- Monitoring and maintenance\n- Real-world case studies\n\nOpen to all skill levels. Limited seats available - register at the link in my profile. See you there!",
        category: "Events",
      },
      {
        author: users[0]._id,
        title: "Looking for a Mentor in Cloud Architecture",
        content: "I'm a mid-level backend engineer looking to transition into cloud architecture and DevOps.\n\nCurrent skills:\n- 4 years Node.js/Python backend development\n- Basic AWS knowledge (EC2, S3, RDS)\n- Docker basics\n\nLooking for:\n- Guidance on cloud architecture patterns\n- AWS certification path advice\n- Career growth strategy\n\nWould love to connect with experienced cloud architects who'd be willing to mentor. Can offer:\n- Backend development insights in return\n- Commitment to regular meetings\n- Eagerness to learn!\n\nDM me if interested! 🙏",
        category: "Mentorship",
      },
      {
        author: users[1]._id,
        title: "How I Got Into FAANG After 3 Years in Service-Based Company",
        content: "Got my offer from Google last month! Wanted to share my journey as many asked how I prepared.\n\nBackground: 3 years in TCS, mostly maintenance work\n\nPreparation strategy:\n- 6 months dedicated DSA practice (LeetCode)\n- Built 2 side projects showcasing problem-solving\n- Practiced system design extensively\n- Mock interviews with peers\n\nKey insight: Consistency beats intensity. 2 hours daily is better than weekend cramming.\n\nHappy to answer specific questions!",
        category: "Alumni Stories",
      },
      {
        author: users[2]._id,
        title: "Tech Meetup in Bangalore Next Friday - Who's In?",
        content: "Organizing an informal tech meetup at Koramangala next Friday (7 PM)!\n\nAgenda:\n- Networking over coffee\n- Lightning talks (5 min each, optional)\n- Discussion on latest tech trends\n- Collaboration opportunities\n\nNo formal structure, just good conversations with fellow alumni. Reply if you're interested, will share exact venue details!",
        category: "Networking",
      },
      {
        author: users[3]._id,
        title: "Should I Join a Startup or Stay in a Product Company?",
        content: "At a crossroads and would love the community's input.\n\nCurrent: Senior Engineer at a stable product company\n- Good pay (₹25 LPA)\n- Work-life balance\n- Limited learning opportunities\n- Clear career path\n\nOffer: Early-stage startup (Series A)\n- Lower pay (₹18 LPA + equity)\n- Huge learning curve\n- High risk\n- Founding team member role\n\nI'm 28, no major financial commitments. What would you do?",
        category: "General",
      },
      {
        author: users[4]._id,
        title: "Best Resources for Learning System Design?",
        content: "Preparing for senior engineer interviews and system design is my weak point.\n\nWhat resources helped you the most? Looking for:\n- Books\n- Online courses\n- Practice platforms\n- YouTube channels\n\nSo far I've started with 'Designing Data-Intensive Applications'. What else should be on my list?",
        category: "Tech Talk",
      },
      {
        author: users[0]._id,
        title: "Remote Work Tips for New Grads",
        content: "Been working remotely for 3 years now. Seeing many new grads struggling with WFH, so here are my top tips:\n\n1. Create a dedicated workspace\n2. Maintain strict work hours\n3. Over-communicate with your team\n4. Take regular breaks (Pomodoro technique works!)\n5. Build social connections deliberately\n6. Invest in good equipment (chair, desk, monitor)\n\nRemote work is awesome but requires discipline. What are your remote work hacks?",
        category: "General",
      },
      {
        author: users[1]._id,
        title: "Freelancing While Working Full-Time - Is It Worth It?",
        content: "Considering taking up freelance projects on weekends to build extra income and learn new technologies.\n\nConcerns:\n- Burnout risk\n- Impact on primary job\n- Legal/contract implications\n- Tax complications\n\nBenefits:\n- Extra income\n- Skill diversification\n- Potential future business\n\nAnyone doing this successfully? How do you manage?",
        category: "Career Opportunities",
      },
    ];

    // Insert posts with some having likes and replies
    const createdPosts = await Post.insertMany(posts);
    console.log(`Created ${createdPosts.length} posts`);

    // Add some likes to posts
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      const numLikes = Math.floor(Math.random() * 50) + 5; // 5-55 likes
      const likers = users.slice(0, Math.min(numLikes, users.length));
      post.likes = likers.map(u => u._id);
      await post.save();
    }

    // Add some replies to posts
    const postsToReply = createdPosts.slice(0, 6);
    for (const post of postsToReply) {
      const numReplies = Math.floor(Math.random() * 5) + 1; // 1-5 replies
      for (let i = 0; i < numReplies; i++) {
        const replier = users[i % users.length];
        post.replies.push({
          author: replier._id,
          content: `Great post! This is very helpful information. Thanks for sharing your experience with the community.`,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 3), // Random time in last 3 days
        });
      }
      await post.save();
    }

    console.log('Added likes and replies to posts');
    console.log('Post seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
};

seedPosts();
