import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: null, 
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name") || "User";
    const profilePic = localStorage.getItem("profilePic"); // optional
    setUser({ name, email, profilePic });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        👤 Your Profile
      </h1>

      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-4">
              No Image
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-600 mt-1">{user.email}</p>

          <button
            onClick={handleLogout}
            className="mt-6 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
