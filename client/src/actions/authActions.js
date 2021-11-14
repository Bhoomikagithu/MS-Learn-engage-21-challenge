import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./Types";
import axios from "axios";
//register user action creator
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Login get user info

export const loginUser = (userData) => async (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      const { token } = res.data;
      //set token to local storage
      localStorage.setItem("jwtToken", token);
      //set token to auth header
      setAuthToken(token);
      //decode the token to get the user data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

//logout user
export const logoutUser = () => (dispatch) => {
  //remove token from local storage
  localStorage.removeItem("jwtToken");
  //remove token from header
  setAuthToken(false);
  //set current user to {}
  dispatch(setCurrentUser({}));
};
