import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSignInAlt } from "react-icons/fa";
import {
  SignInFailure,
  SignInStart,
  SignInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIp() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SignInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      console.log(data);
      if (data.success === false) {
        dispatch(SignInFailure(data.message));
        return;
      }

      dispatch(SignInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(SignInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don&apos;t have an account? </p>
        <Link to="/sign-up" className="text-blue-700">
          <span>Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
