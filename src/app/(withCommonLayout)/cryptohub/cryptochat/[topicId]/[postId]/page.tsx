import PostDetailsPage from '@/components/Post/PostDetailsPage';
import React from 'react'

interface PageProps {
  params: {
    postId: string;
  }
}

const PostPage = ({ params: { postId } }: PageProps) => {
  return (
    <div>
      <PostDetailsPage postId={postId} />
    </div>
  )
}

export default PostPage
