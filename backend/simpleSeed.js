const mongoose = require('mongoose');
const User = require('./models/user');
const Blog = require('./models/blog');

async function simpleSeed() {
  try {
    console.log('Starting simple seed...');
    
    // Use the working connection string
    const connectionString = 'mongodb://127.0.0.1:27017/devnovate-blog';
    console.log('Connecting to:', connectionString);
    
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Create a simple test user
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123',
      bio: 'Test user for demo'
    };
    
    // Check if user exists
    let user = await User.findOne({ username: 'testuser' });
    if (!user) {
      user = new User(testUser);
      await user.save();
      console.log('✅ Created test user');
    } else {
      console.log('✅ Test user already exists');
    }
    
    // Create a simple test blog
    const testBlog = {
      title: 'Welcome to DevNovate Blog',
      content: 'This is a sample blog post created during setup. DevNovate is a platform for developers to share their knowledge and experiences.',
      excerpt: 'Welcome to our developer blog platform',
      author: user._id,
      category: 'Technology',
      tags: ['Welcome', 'DevNovate', 'Blog'],
      status: 'approved',
      publishedAt: new Date(),
      views: 10
    };
    
    // Check if blog exists
    let blog = await Blog.findOne({ title: testBlog.title });
    if (!blog) {
      blog = new Blog(testBlog);
      await blog.save();
      console.log('✅ Created test blog');
    } else {
      console.log('✅ Test blog already exists');
    }
    
    // Get stats
    const userCount = await User.countDocuments();
    const blogCount = await Blog.countDocuments();
    
    console.log(`\n📊 Database Stats:`);
    console.log(`Users: ${userCount}`);
    console.log(`Blogs: ${blogCount}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Simple seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Simple seed failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

simpleSeed();
