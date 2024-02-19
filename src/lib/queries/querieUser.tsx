import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query {
    allUsers {
      id
      name
      username
      email
      password
      accessLevel
    }
  }
`;

export const GET_USER_BY_NAME = gql`
  query ($name: String!) {
    usersByName(name: $name) {
      id
      name
      username
      email
      password
      accessLevel
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($createUserObject: CreateUserInput!) {
    createUser(createUserObject: $createUserObject) {
      id
      name
      username
      email
      password
      accessLevel
    }
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($editUserObject: EditUserInput!) {
    editUser(editUserObject: $editUserObject) {
      id
      name
      username
      email
      password
      accessLevel
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($deleteUserId: String!) {
    deleteUser(id: $deleteUserId)
  }
`;
