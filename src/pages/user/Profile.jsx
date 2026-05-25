import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Get logged-in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);

      // 🔥 Call loyalty API
      axios
        .get(`http://localhost:5000/api/user/${storedUser.id}/loyalty`)
        .then((res) => {
          setTotalSpent(res.data.totalSpent);
          setDiscount(res.data.discount);
        })
        .catch((err) => {
          console.error("Loyalty fetch error:", err);
        });
    }
  }, []);

  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>👤 Profile</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <hr />

      <h3>💰 Loyalty Details</h3>
      <p><strong>Total Spent:</strong> ₹{totalSpent}</p>

{discount > 0 ? (
  <div
    style={{
      backgroundColor: "#d4edda",
      padding: "10px",
      borderRadius: "5px",
      marginTop: "10px"
    }}
  >
    🎉 You unlocked {discount}% loyalty discount!
  </div>
) : (
  <div style={{ marginTop: "10px" }}>
    Buy 5 products in one order to get 10% discount.
  </div>
)}
    </div>
  );
};

export default Profile;