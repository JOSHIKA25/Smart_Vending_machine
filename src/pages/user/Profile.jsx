export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <h3>Purchased Products</h3>
      {/* fetch and show transactions here */}
    </div>
  );
}