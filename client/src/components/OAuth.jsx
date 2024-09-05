import { FaGoogle } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { SignInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      // Correct the signInWithPopup usage
      const result = await signInWithPopup(auth, provider);

      //   const credential = GoogleAuthProvider.credentialFromResult(result);
      //   const token = credential.accessToken;

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      console.log(data)

      dispatch(SignInSuccess(data))
      navigate("/")

    } catch (error) {
      console.error(error)
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 relative flex items-center justify-center space-x-2"
    >
      <FaGoogle className="text-lg " />
      <span>Continue with Google</span>
    </button>
  );
}

export default OAuth;
