export default function SignUp() {
  return (
    <div>
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="">
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
      </form>
    </div>
  )
}