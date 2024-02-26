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

export const CREATE_COURSE = gql`
  mutation CreateCourse($createCourseObject: CreateCourseInput!) {
    createCourse(createCourseObject: $createCourseObject) {
      id
      title
      slug
      description
      coverImage
    }
  }
`;

export const EDIT_COURSE = gql`
  mutation EditCourse($editCourseObject: EditCourseInput!) {
    editCourse(editCourseObject: $editCourseObject) {
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

export const DELETE_Course = gql`
  mutation deleteCourse($deleteCourseId: String!) {
    deleteCourse(id: $deleteCourseId)
  }
`;
