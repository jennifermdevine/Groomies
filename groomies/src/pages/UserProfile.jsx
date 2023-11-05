import React, { useState } from "react";

const UserProfile = () => {
  // sample user
  const initialUser = {
    username: "JohnDoe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "https://placekitten.com/200/200",
  };

  // manage user info
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  // edit user info
  const handleEdit = () => {
    setIsEditing(true);
  };

  // save user info
  const handleSave = () => {
    setIsEditing(false);
    // unfinished
  };

  // delete user
  const handleDelete = () => {
    // unfinished
  };

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <img src={user.profilePicture} alt="Profile" />
      </div>
      {isEditing ? (
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <label>Full Name:</label>
          <input
            type="text"
            value={user.fullName}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
          />
          <label>Email:</label>
          <input
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p>Username: {user.username}</p>
          <p>Full Name: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default UserProfile;
