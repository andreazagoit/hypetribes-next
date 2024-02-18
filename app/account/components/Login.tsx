"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const LOGIN_USER = gql`
  mutation LoginWithCredentials($email: String!, $password: String!) {
    loginWithCredentials(email: $email, password: $password) {
      id
      name
      email
      token
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("andreazago1997@gmail.com");
  const [password, setPassword] = useState("passwordtest!");

  const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    try {
      const { data } = await loginUser({
        variables: { email, password },
      });

      // Extract token from loginWithCredentials response
      const token = data.loginWithCredentials.token;

      // Set token in sessionStorage
      localStorage.setItem("token", token);

      // Redirect to dashboard or perform any other action
      // window.location.href = "/dashboard"; // Example redirect

      console.log("Login successful");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Login;
