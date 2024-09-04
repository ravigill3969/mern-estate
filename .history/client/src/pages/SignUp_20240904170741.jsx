export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-lg my-2"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg my-2"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg my-2"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 "  >Sign up</button>
      </form>
    </div>
  );
}
