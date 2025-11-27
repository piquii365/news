import React, { useState, Fragment } from "react";
import { User, Lock, Facebook, Chrome, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { LoginForm } from "../../types";

const SocialLoginButton = () => (
  <Fragment>
    <button className="bg-blue-600 text-white py-3 px-6 rounded w-full flex items-center justify-center mt-4">
      <Facebook className="mr-2" />
      <span className="text-center">Continue with Facebook</span>
    </button>
    <button className="bg-red-500 text-white py-3 px-6 rounded w-full flex items-center justify-center mt-4">
      <Chrome className="mr-2" />
      <span className="text-center">Continue with Google</span>
    </button>
  </Fragment>
);

const SignInForm: React.FC = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const payload: LoginForm = { user, password };
    try {
      await login(payload);
      navigate("/");
    } catch (err: unknown) {
      const message = (err as Error)?.message ?? String(err);
      setError(message || "Login failed");
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate("/");
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2 font-normal" htmlFor="user">
          Email or Username
        </label>
        <div className="flex items-center bg-blue-50 dark:bg-slate-700 min-h-[48px] rounded-lg px-3">
          <User className="mr-2" />
          <input
            type="text"
            className="w-full bg-transparent leading-10 p-2 outline-none"
            id="user"
            placeholder="Enter Email or Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-normal" htmlFor="password">
          Password
        </label>
        <div className="flex items-center bg-blue-50 dark:bg-slate-700 min-h-[48px] rounded-lg px-3">
          <Lock className="mr-2" />
          <input
            type="password"
            className="w-full bg-transparent leading-10 p-2 outline-none"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <input
          type="checkbox"
          className="mr-2"
          id="remember-me"
          defaultChecked
        />
        <label className="font-normal" htmlFor="remember-me">
          Remember me
        </label>
      </div>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      <button className="bg-indigo-900 text-white py-3 px-6 rounded w-full font-bold flex items-center justify-center">
        Log In <ArrowRight className="ml-2" />
      </button>
      <button className="hover:text-blue-600 mt-3 font-medium py-2 px-4 rounded-lg w-full">
        Forget your password?
      </button>
      <button
        type="button"
        onClick={handleGuest}
        className="mt-3 w-full border border-gray-300 dark:border-gray-700 rounded px-7 py-3 text-sm"
      >
        Continue as guest
      </button>
      <div className="relative">
        <hr className="my-8 border-t border-gray-300" />
        <span className="px-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-100 dark:bg-slate-800">
          Or
        </span>
      </div>
      <SocialLoginButton />
    </form>
  );
};

const Login = () => {
  return (
    <section className="w-screen flex bg-white text-zinc-900 dark:text-white overflow-hidden">
      <div className="container px-4 mx-auto min-h-screen">
        <div className="grid grid-cols-12 h-full">
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 order-2">
            <img
              src="https://cdn.easyfrontend.com/pictures/sign-in-up/sign3.jpg"
              alt="sign in"
              className="hidden lg:block h-full w-full lg:w-[50vw] bg-cover bg-center bg-no-repeat float-left object-cover"
            />
          </div>
          <div className="col-span-12 lg:col-span-5 py-12">
            <div className="flex items-center justify-center h-full">
              <div className="w-full">
                <div className="bg-blue-100 bg-opacity-70 dark:bg-slate-800 shadow-xl rounded-2xl p-4 md:p-12">
                  <div className="flex gap-2 items-center text-indigo-900 dark:text-white text-2xl font-bold mb-3">
                    <h2>Welcome to</h2>
                    <div className="text-3xl md:text-4xl font-bold">
                      <span className="text-black">DISCUSSI</span>
                      <span className="text-red-600">ON</span>
                    </div>
                  </div>
                  <div className="flex items-center mb-6 md:mb-12">
                    <p className="mb-0 mr-2 opacity-50">
                      Don't have an account?
                    </p>
                    <a href="/auth/register">Create Account</a>
                  </div>

                  <SignInForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
