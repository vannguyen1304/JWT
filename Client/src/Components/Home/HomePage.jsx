import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllUser, deleteUser } from "../../redux/APIrequest";
import jwt_decode from "jwt-decode";
import axios from "axios";
import "./home.css";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.users.users?.allUsers);
  const user = useSelector((state) => state.auth.login.currentUser);
  const msg = useSelector((state) => state.users.msg);
  const axiosJWT = axios.create();

  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post("http://localhost:3000/v1/auth/refresh", {
        refreshToken: user.refreshToken,
      });
      console.log(res);
      return res?.data;
    } catch (error) {
      console.log(error);
    }
  };

  axiosJWT.interceptors.request.use(
    async (config) => {
      // Do something before request is sent
      let date = new Date();
      const decodedToken = jwt_decode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        // console.log("qua han, chay refresh data");
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        dispatch(loginSuccess(refreshUser));
        config.headers["token"] = data.accessToken;
      }
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!user?.accessToken) navigate("./login");
    getAllUser(user?.accessToken, dispatch, axiosJWT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">{`Your role is:  ${
        user?.admin ? "ADMIN" : "USER"
      }`}</div>

      <div className="home-userlist">
        {userData?.map((user) => {
          return (
            <div key={user._id} className="user-container">
              <div className="home-user">{user.name}</div>
              <div
                className="delete-user"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </div>
            </div>
          );
        })}
      </div>
      <span>{msg ? msg : ""}</span>
    </main>
  );
};

export default HomePage;
