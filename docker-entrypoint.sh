#!/bin/bash

# Container entry script with database seeding
echo "🚀 Starting Blog Service Container..."

# Function to wait for MongoDB to be ready
wait_for_mongo() {
    echo "⏳ Waiting for MongoDB to be ready..."
    
    while ! node -e "
        const mongoose = require('mongoose');
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 2000
        }).then(() => {
            console.log('MongoDB is ready!');
            mongoose.connection.close();
            process.exit(0);
        }).catch(() => {
            process.exit(1);
        });
    " 2>/dev/null; do
        echo "⏳ MongoDB not ready yet, waiting 2 seconds..."
        sleep 2
    done
    
    echo "✅ MongoDB is ready!"
}

# Function to seed database
seed_database() {
    echo "🌱 Starting database seeding..."
    
    node -e "
        const mongoose = require('mongoose');
        const bcrypt = require('bcrypt');
        const User = require('./models/user');
        const Blog = require('./models/blogs');

        const MONGO_URL = process.env.MONGO_URL;
        console.log('📍 Using MongoDB URL:', MONGO_URL);

        (async () => {
            try {
                await mongoose.connect(MONGO_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    serverSelectionTimeoutMS: 5000
                });
                console.log('✅ Connected to MongoDB for seeding');
                
                // Check if data already exists
                const existingUsers = await User.countDocuments();
                if (existingUsers > 0) {
                    console.log('📊 Database already has data, skipping seeding');
                    await mongoose.connection.close();
                    process.exit(0);
                }
                
                console.log('🧹 Clearing existing data...');
                await User.deleteMany({});
                await Blog.deleteMany({});
                
                // Create users
                console.log('👤 Creating users...');
                const user1Hash = await bcrypt.hash('password123', 10);
                const user1 = new User({
                    username: 'johndoe',
                    name: 'John Doe',
                    passwordHash: user1Hash,
                });
                const savedUser1 = await user1.save();
                
                const user2Hash = await bcrypt.hash('password456', 10);
                const user2 = new User({
                    username: 'janedoe',
                    name: 'Jane Doe',
                    passwordHash: user2Hash,
                });
                const savedUser2 = await user2.save();
                
                // Create blogs
                console.log('📝 Creating blogs...');
                const blog1 = new Blog({
                    title: 'Getting Started with Node.js',
                    author: 'John Doe',
                    url: 'https://example.com/nodejs-tutorial',
                    likes: 25,
                    user: savedUser1._id,
                });
                await blog1.save();
                
                const blog2 = new Blog({
                    title: 'MongoDB Best Practices',
                    author: 'Jane Doe',
                    url: 'https://example.com/mongodb-best-practices',
                    likes: 40,
                    user: savedUser2._id,
                });
                await blog2.save();
                
                const blog3 = new Blog({
                    title: 'Docker for Developers',
                    author: 'John Doe',
                    url: 'https://example.com/docker-developers',
                    likes: 15,
                    user: savedUser1._id,
                });
                await blog3.save();
                
                // Update relationships
                await User.findByIdAndUpdate(savedUser1._id, { 
                    blogs: [blog1._id, blog3._id] 
                });
                await User.findByIdAndUpdate(savedUser2._id, { 
                    blogs: [blog2._id] 
                });
                
                const userCount = await User.countDocuments();
                const blogCount = await Blog.countDocuments();
                console.log(\`📊 Seeding completed: \${userCount} users, \${blogCount} blogs\`);
                
                await mongoose.connection.close();
                console.log('🎉 Database seeding completed successfully!');
                process.exit(0);
            } catch (error) {
                console.error('❌ Error seeding database:', error.message);
                await mongoose.connection.close();
                process.exit(1);
            }
        })();
    "
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeding completed successfully!"
    else
        echo "❌ Database seeding failed!"
        exit 1
    fi
}

# Main execution
echo "🔧 Environment: $NODE_ENV"

# Wait for MongoDB
wait_for_mongo

# Only seed in development and staging environments
if [ "$NODE_ENV" = "dev" ] || [ "$NODE_ENV" = "development" ] || [ "$NODE_ENV" = "staging" ]; then
    echo "🌱 Seeding database for $NODE_ENV environment..."
    seed_database
else
    echo "⏭️  Skipping database seeding for $NODE_ENV environment"
fi

# Start the application
echo "🚀 Starting Blog Service application..."
exec "$@"
