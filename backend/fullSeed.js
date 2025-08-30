const mongoose = require('mongoose');
const User = require('./models/user');
const Blog = require('./models/blog');

async function fullSeed() {
  try {
    console.log('🚀 Starting comprehensive database seeding...');
    
    // Use the working connection string
    await mongoose.connect('mongodb://127.0.0.1:27017/devnovate-blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Create demo users
    const demoUsers = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        bio: 'Platform administrator',
        role: 'admin'
      },
      {
        username: 'alice_dev',
        email: 'alice@demo.com',
        password: 'demopass123',
        bio: 'Full-stack developer passionate about React and Node.js'
      },
      {
        username: 'bob_designer',
        email: 'bob@demo.com', 
        password: 'demopass123',
        bio: 'UI/UX designer with a love for clean, modern interfaces'
      },
      {
        username: 'charlie_data',
        email: 'charlie@demo.com',
        password: 'demopass123',
        bio: 'Data scientist exploring the intersection of AI and web development'
      },
      {
        username: 'debuguser2',
        email: 'debuguser2@test.com',
        password: 'testpass123',
        bio: 'Debug test user',
        role: 'admin'
      }
    ];
    
    const createdUsers = {};
    
    for (const userData of demoUsers) {
      let user = await User.findOne({ username: userData.username });
      if (!user) {
        user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.username} (${userData.role || 'user'})`);
      } else {
        console.log(`✅ User ${userData.username} already exists`);
      }
      createdUsers[userData.username] = user;
    }
    
    // Create demo blogs
    const demoBlogs = [
      {
        title: 'Advanced React Patterns for 2024',
        content: 'Explore the latest React patterns including Custom Hooks, Compound Components, and Render Props. This comprehensive guide covers modern React development techniques that will make your applications more maintainable and performant. We\'ll dive deep into real-world examples and best practices that every React developer should know.',
        excerpt: 'Modern React patterns and best practices for 2024',
        author: createdUsers.alice_dev._id,
        category: 'Web Development',
        tags: ['React', 'JavaScript', 'Frontend', 'Patterns'],
        status: 'approved',
        publishedAt: new Date(),
        likes: [createdUsers.bob_designer._id, createdUsers.charlie_data._id],
        views: 150
      },
      {
        title: 'Design Systems: Building Consistent UIs',
        content: 'Learn how to create and maintain design systems that scale across teams and projects. We\'ll cover component libraries, design tokens, documentation strategies, and tools like Storybook. A well-designed system ensures consistency and speeds up development while maintaining brand integrity.',
        excerpt: 'Guide to creating scalable design systems',
        author: createdUsers.bob_designer._id,
        category: 'Design',
        tags: ['Design System', 'UI/UX', 'Components', 'Storybook'],
        status: 'approved',
        publishedAt: new Date(),
        likes: [createdUsers.alice_dev._id],
        views: 89
      },
      {
        title: 'Machine Learning for Web Developers',
        content: 'Discover how to integrate machine learning into web applications. We\'ll explore TensorFlow.js, practical use cases, and step-by-step implementation guides. From image recognition to natural language processing, ML is becoming more accessible to web developers than ever before.',
        excerpt: 'Integrating ML into web applications',
        author: createdUsers.charlie_data._id,
        category: 'Technology',
        tags: ['Machine Learning', 'TensorFlow', 'AI', 'JavaScript'],
        status: 'approved',
        publishedAt: new Date(),
        likes: [createdUsers.alice_dev._id, createdUsers.bob_designer._id],
        views: 203
      },
      {
        title: 'Node.js Performance Optimization',
        content: 'Deep dive into Node.js performance optimization techniques. Learn about event loop management, memory optimization, caching strategies, and profiling tools. These techniques will help you build scalable and efficient backend applications.',
        excerpt: 'Optimize your Node.js applications for better performance',
        author: createdUsers.alice_dev._id,
        category: 'Programming',
        tags: ['Node.js', 'Performance', 'Backend', 'Optimization'],
        status: 'approved',
        publishedAt: new Date(),
        likes: [createdUsers.charlie_data._id],
        views: 120
      },
      {
        title: 'Getting Started with DevNovate',
        content: 'Welcome to DevNovate, the premier platform for developers to share knowledge, collaborate, and grow together. This guide will walk you through all the features available on our platform and how to make the most of your experience.',
        excerpt: 'Your guide to using the DevNovate platform',
        author: createdUsers.admin._id,
        category: 'Technology',
        tags: ['DevNovate', 'Platform', 'Guide'],
        status: 'approved',
        publishedAt: new Date(),
        likes: [],
        views: 45
      }
    ];
    
    for (const blogData of demoBlogs) {
      let blog = await Blog.findOne({ title: blogData.title });
      if (!blog) {
        blog = new Blog(blogData);
        await blog.save();
        console.log(`✅ Created blog: "${blogData.title}"`);
        
        // Add demo comments
        const comments = [
          {
            user: createdUsers.alice_dev._id,
            text: 'Great article! Very informative and well-written.',
            createdAt: new Date()
          },
          {
            user: createdUsers.bob_designer._id,
            text: 'Thanks for sharing this. Really helpful insights!',
            createdAt: new Date()
          }
        ];
        
        blog.comments.push(...comments);
        await blog.save();
        console.log(`  ↳ Added ${comments.length} comments`);
      } else {
        console.log(`✅ Blog "${blogData.title}" already exists`);
      }
    }
    
    // Get final stats
    const userCount = await User.countDocuments();
    const blogCount = await Blog.countDocuments();
    const approvedBlogs = await Blog.countDocuments({ status: 'approved' });
    const pendingBlogs = await Blog.countDocuments({ status: 'pending' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    console.log('\n📊 Final Database Stats:');
    console.log(`👥 Total Users: ${userCount} (${adminCount} admin, ${userCount - adminCount} regular)`);
    console.log(`📝 Total Blogs: ${blogCount}`);
    console.log(`✅ Approved Blogs: ${approvedBlogs}`);
    console.log(`⏳ Pending Blogs: ${pendingBlogs}`);
    
    await mongoose.disconnect();
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n🔐 Test Accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Admin: debuguser2@test.com / testpass123');
    console.log('User: alice@demo.com / demopass123');
    console.log('User: bob@demo.com / demopass123');
    console.log('User: charlie@demo.com / demopass123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

fullSeed();
