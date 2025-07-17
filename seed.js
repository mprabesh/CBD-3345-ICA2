// Import required modules
const mongoose = require("mongoose");
const User = require("./models/user");
const Blog = require("./models/blogs");
const { info } = require("./utils/logger");
const { mongoURL } = require("./utils/config");
const bcrypt = require("bcrypt");

info("Starting database seeding...");
info("Using MongoDB URL:", mongoURL);

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => info("Connected to MongoDB"))
.catch((err) => info("MongoDB connection error:", err));

// Dummy data for seeding
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});

    info("Cleared existing data.");

    // Create dummy users with proper password hashing
    const user1Hash = await bcrypt.hash("password123", 10);
    const user1 = new User({
      username: "johndoe",
      name: "John Doe",
      passwordHash: user1Hash,
    });
    const savedUser1 = await user1.save();

    const user2Hash = await bcrypt.hash("password456", 10);
    const user2 = new User({
      username: "janedoe",
      name: "Jane Doe",
      passwordHash: user2Hash,
    });
    const savedUser2 = await user2.save();

    const users = [savedUser1, savedUser2];

    info("Inserted users:", users);

    // Create dummy blogs
    const blogs = await Blog.insertMany([
      {
        title: "First Blog",
        author: "John Doe",
        url: "https://example.com/first-blog",
        likes: 10,
        user: users[0]._id,
      },
      {
        title: "Second Blog",
        author: "Jane Doe",
        url: "https://example.com/second-blog",
        likes: 15,
        user: users[1]._id,
      },
      {
        title: "Another Blog by John",
        author: "John Doe",
        url: "https://example.com/another-blog",
        likes: 8,
        user: users[0]._id,
      },
    ]);

    info("Inserted blogs:", blogs);

    // Close the connection
    mongoose.connection.close();
    info("Database seeded and connection closed.");
  } catch (err) {
    info("Error seeding database:", err);
    mongoose.connection.close();
  }
};

// Run the seed script
seedData();