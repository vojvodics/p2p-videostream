import React from 'react';

import './Login.css';

const Login = ({ onSubmit, updateUsername }) => {
  return (
    <form className="Login" onSubmit={onSubmit}>
      <h1 className="Login-title">P2P videostream</h1>
      <input
        id="username"
        className="Login-input"
        placeholder="Your username..."
        onChange={e => updateUsername(e.target.value)}
      />
      <input className="Login-button" type="submit" placeholder="Submit" />
    </form>
  );
};

export default Login;
