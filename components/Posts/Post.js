import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  bottom: 0,
  top:'50%',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;
const UserInfo = styled.div(() => ({
  padding: '10px',
  backgroundColor: '#f9f9f9',
  borderTop: '1px solid #ddd',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const UserName = styled.div(() => ({
  fontWeight: 'bold',
}));

const UserEmail = styled.div(() => ({
  fontSize: '0.9em',
  color: '#555',
}));

const Post = ({ post,user }) => {
  const carouselRef = useRef(null);
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [page,setPage]=useState(0)

  console.log("post post :",post)
  

  const userInitials = user.name
  ? user.name.split(' ').map(name => name[0]).join('')
  : '';


  const handleNextClick = () => {
    if (carouselRef.current) {
     const itemWidth=carouselRef.current.clientWidth
     const scrollLeft=carouselRef.current.scrollLeft
     carouselRef.current.scrollTo({
      left: scrollLeft + itemWidth,
      behavior: 'smooth',
    });
    }
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      const itemWidth=carouselRef.current.clientWidth
      const scrollLeft=carouselRef.current.scrollLeft
      carouselRef.current.scrollTo({
        left:scrollLeft-itemWidth,
        behavior:'smooth'
      })
    }
  };

  return (
    <PostContainer>
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={image?.url}>
              <Image src={image?.url} alt={image?.title} />
            </CarouselItem>
          ))}
        </Carousel>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
      <UserInfo>
        <UserName>{userInitials}</UserName>
        <UserEmail>{user?.data?.email}</UserEmail>
      </UserInfo>
      
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired, 
    body: PropTypes.string.isRequired, 
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired, 
        alt: PropTypes.string             
      })
    ).isRequired 
  }).isRequired, 
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};
export default Post;
