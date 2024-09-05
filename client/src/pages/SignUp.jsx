import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { FaSignInAlt } from "react-icons/fa";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-lg my-2"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg my-2"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg my-2"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className={`bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 relative`}
        >
          <FaSignInAlt className="text-white absolute right-72 bottom-4" />
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Already have an account? </p>
        <Link to="/sign-in" className="text-blue-700">
          <span>Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
