import { gql } from "@apollo/client";

export const GET_COURSES = gql`
  query {
    allCourses {
      id
      title
      slug
      description
      coverImage
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($createPostObject: CreatePostInput!) {
    createPost(createPostObject: $createPostObject) {
      id
      title
      slug
      description
      coverImage
    }
  }
`;

export const EDIT_POST = gql`
  mutation EditPost($editPostObject: EditPostInput!) {
    editPost(editPostObject: $editPostObject) {
      id
      title
      author
      tags
      coverImage
      content
      note
      status
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($deletePostId: String!) {
    deletePost(id: $deletePostId)
  }
`;
