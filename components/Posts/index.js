import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [user,setUser]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const limit = isSmallerDevice ? 5 : 10;
        const { data } = await axios.get('http://localhost:3000/api/v1/posts', {
          params: { start: (page - 1) * limit, limit },
        });
        const user=await axios.get("http://localhost:3000/api/v1/users")

        

        setUser(user)
        console.log("user",user)
        

        if (Array.isArray(data)) {
          setPosts((prevPosts) => [...prevPosts, ...data]);
          setHasMore(data.length === limit); // Set hasMore based on whether the number of posts returned equals the limit
        } else {
          console.error('Unexpected data format:', data);
          setHasMore(false);
        }
        
      } catch (error) {
        console.error('Error fetching posts:', error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, isSmallerDevice]);

  const handleClick = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map((post) => (
          <Post key={post.id} post={post} user={user} />
        ))}
      </PostListContainer>

      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
