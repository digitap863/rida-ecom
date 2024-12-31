import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/req";


const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = { email, password };
    
      try {
        const response = await adminLogin(data);
  
        if (response) {
          localStorage.setItem("adminToken", JSON.stringify(response.token));
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
    const handleTogglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        {/* <img className="w-auto  mr-2" src={logo} alt="logo" /> */}
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter your Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={() => setError("")}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={() => setError("")}
                />
                <button
                  type="button"
                  className="absolute  top-2.5 right-3"
                  onClick={handleTogglePasswordVisibility}
                >
                  {" "}
                  {isPasswordVisible ? (
                    <IoMdEye size={25} />
                  ) : (
                    <IoMdEyeOff size={25} />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-600 font-lexend text-[0.8rem]">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full text-white bg-[#39964B] hover:bg-[#39964B]/60 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Login