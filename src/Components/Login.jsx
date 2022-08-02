import React, { useRef, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthProvider";

import { Axios } from "../Axios/Axios";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState("");

  //FOCUS ON FIRST INPUT WHEN COMPONENT LOADS//
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //CLEAR ERROR MESSAGE//
  useEffect(() => {
    setErrMessage("");
  }, [user, password]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({user,password, roles, accessToken})
      setUser("");
      setPassword("");
      setSuccess(true);
    } catch (err) {
        if (!err?.response) {
            setErrMessage('NO SERVER RESPONSE')
        } else if(err.response?.status===400) {
            setErrMessage('MISSING USERNAME OR PASSWORD');
        } else if(err.response.status===401) {
            setErrMessage('UNAUTHORIZED')
        } else {
            setErrMessage('LOGIN FAIL')
        }
        errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>LOGGED IN!</h1>
          <br />
          <p>
            <a href="#">HOME PAGE</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMessage ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMessage}
          </p>

          <h1>SIGN IN</h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username : </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(evt) => setUser(evt.target.value)}
              value={user}
              required
            />
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              id="password"
              onChange={(evt) => setPassword(evt.target.value)}
              value={password}
              required
            />
            <button>SIGN IN</button>
          </form>
          <p>
            Need An Account?
            <br />
            <span className="line">
              {/*ROUTER LINK HERE*/}
              <a href="#">Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
