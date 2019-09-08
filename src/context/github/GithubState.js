import React, { useReducer } from "react";
import axios from "axios";
import GithubContext from "./githubContext";
import githubReducer from "./githubReducer";
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS
} from "../types";
let githubClientId;
let githubClinetSerect;
if (process.env.NODE_ENV !== "production") {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClinetSerect = process.env.REACT_APP_GITHUB_CLIENT_SECRECT;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClinetSerect = process.env.GITHUB_CLIENT_SECRECT;
}
const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  };
  const [state, dispatch] = useReducer(githubReducer, initialState);

  //search user
  const searchUsers = async text => {
    if (text) {
      setLoading();
      const res = await axios.get(
        `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secrect=${githubClinetSerect}`
      );
      dispatch({ type: SEARCH_USERS, payload: res.data.items });
    }
  };

  // get user
  const getUser = async username => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${githubClientId}&client_secrect=${githubClinetSerect}`
    );
    dispatch({ type: GET_USER, payload: res.data });
  };

  //get Repos
  const getUserRepos = async username => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=crate:ascd&client_id=${githubClientId}&client_secrect=${githubClinetSerect}`
    );
    dispatch({ type: GET_REPOS, payload: res.data });
  };

  //clear user
  const clearUsers = () => dispatch({ type: CLEAR_USERS });
  //set loading
  const setLoading = () => dispatch({ type: SET_LOADING });
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};
export default GithubState;
