import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
} from "./authSlice";
import {
  getUserStart,
  getUserSuccess,
  getUserError,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserError,
} from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:3000/v1/auth/login", user);
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(loginFailed());
  }
};

// register
export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("http://localhost:3000/v1/auth/register", user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(registerFailed());
  }
};

// get all user
export const getAllUser = async (accessToken, dispatch) => {
  dispatch(getUserStart());
  try {
    const res = await axios.get("http://localhost:3000/v1/account", {
      headers: {
        token: accessToken,
      },
    });
    dispatch(getUserSuccess(res.data));
  } catch (error) {
    dispatch(getUserError());
  }
};

// delete user
export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
  dispatch(deleteUserStart);
  try {
    const res = await axiosJWT.delete(
      `http://localhost:3000/v1/account/${id}`,
      {
        headers: {
          token: accessToken,
        },
      }
    );
    dispatch(deleteUserSuccess(res?.data));
  } catch (error) {
    dispatch(deleteUserError(error.response?.data));
  }
};
