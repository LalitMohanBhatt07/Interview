const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const axios=require('axios')

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await fetchPosts();
  console.log('Fetched Posts:', posts);

  const postsWithImages = await Promise.all(posts.map(async post => {
    try{
    // TODO use this route to fetch photos for each post
    const {data:images}=await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
    console.log(images)
    
    const postImages = images.map((img) => ({
      url: img.url,
      alt: img.title
    }));

    return {
      ...post,
      images: postImages
    };
    }
    catch (err) {
      console.error(`Error fetching images for post ${post.id}:`, err);
      return {
        ...post,
        images: [] 
      };
    }
  }));

  res.json(postsWithImages);
});

module.exports = router;
