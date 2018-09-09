import React from 'react';

import './Main.css';

const Main = ({ username, id, users, startStream }) => {
  return (
    <div className="Main">
      <h1>Hello {username}</h1>
      <p>Let's start a video call with</p>
      <div className="Main-users">
        {users.map(user => (
          <div
            key={user.id}
            className="Main-users-user"
            onClick={() => startStream(user.id)}
          >
            {user.username} {user.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
