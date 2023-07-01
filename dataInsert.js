const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  date: String,
  author: {
    name: String,
    about: String,
    description: String,
  },
});

const Product = mongoose.model('Product', productSchema);

const insertData = async () => {
  const products = [
    {
      title: 'Latest Updates',
      slug: 'latest-updates',
      content: 'Check out our latest updates and stay informed!',
      date: '2023-06-18',
      author: {
        name: 'John Doe',
        about: 'Experienced journalist passionate about technology',
        description: 'John Doe is a seasoned journalist with expertise in covering the latest technological advancements.',
      },
    },
    {
      title: 'Tech Trends',
      slug: 'tech-trends',
      content: 'Explore the emerging tech trends shaping the future.',
      date: '2023-06-15',
      author: {
        name: 'Jane Smith',
        about: 'Tech enthusiast and industry analyst',
        description: 'Jane Smith is a tech enthusiast and industry analyst, specializing in emerging technologies and their impact on society.',
      },
    },
    {
      title      : 'Product Spotlight',
      slug: 'product-spotlight',
      content: 'Discover our featured product of the month and its unique features.',
      date: '2023-06-10',
      author: {
        name: 'David Johnson',
        about: 'Product Manager with a passion for innovation',
        description: 'David Johnson is a dedicated product manager who strives to create innovative solutions that meet customer needs.',
      },
    },
  ];

  try {
    await Product.deleteMany(); // Clear existing data before inserting new data
    await Product.insertMany(products);
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
};

const getData = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

module.exports = {
  insertData,
  getData,
};

