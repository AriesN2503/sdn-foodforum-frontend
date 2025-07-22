import axios from './axiosClient';

export const upvotePost = (postId) =>
  axios.post(`/posts/${postId}/upvote`);

export const downvotePost = (postId) =>
  axios.post(`/posts/${postId}/downvote`);
