import React, { useState, Fragment } from "react";
import { User, Mail, Lock, Check, Facebook, Chrome } from "lucide-react";
import type { RegisterForm } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SocialLoginButton = () => (
  <Fragment>
    <button className="w-full flex justify-center items-center bg-blue-600 rounded py-3 px-5 mb-3">
      <Facebook className="text-white" />
      <span className="w-full text-center text-white">
        Continue with Facebook
      </span>
    </button>
    <button className="w-full flex justify-center items-center bg-red-500 rounded py-3 px-5 mb-3">
      <Chrome className="text-white" />
      <span className="w-full text-center text-white">
        Continue with Google
      </span>
    </button>
  </Fragment>
);

const SignUpForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { register, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    setError(null);

    const fullName = `${firstName} ${lastName}`.trim();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload: RegisterForm = {
      email,
      password,
      fullName,
      username,
      confirmPassword,
    };

    try {
      await register(payload);
      navigate("/");
    } catch (err: unknown) {
      const message = (err as Error)?.message ?? String(err);
      setError(message || "Registration failed");
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate("/");
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mb-6 mx-2">
            <label htmlFor="first-name" className="mb-2">
              First Name
            </label>
            <div className="flex items-center bg-blue-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-xl min-h-[54px] px-4">
              <User className="mr-3" />
              <input
                type="text"
                className="flex-1 bg-transparent focus:outline-none"
                id="first-name"
                placeholder="Your First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mb-6 mx-2">
            <label htmlFor="last-name" className="mb-2">
              Last Name
            </label>
            <div className="flex items-center bg-blue-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-xl min-h-[54px] px-4">
              <User className="mr-3" />
              <input
                type="text"
                className="flex-1 bg-transparent focus:outline-none"
                id="last-name"
                placeholder="Your Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col mb-6 mx-2">
            <label htmlFor="username" className="mb-2">
              Username
            </label>
            <div className="flex items-center bg-blue-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-xl min-h-[54px] px-4">
              <User className="mr-3" />
              <input
                type="text"
                className="flex-1 bg-transparent focus:outline-none"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Birth date removed — not required */}
        <div className="w-full">
          <div className="flex flex-col mb-6 mx-2">
            <label htmlFor="email" className="mb-2">
              Email
            </label>
            <div className="flex items-center bg-blue-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-xl min-h-[54px] px-4">
              <Mail className="mr-3" />
              <input
                type="email"
                className="flex-1 bg-transparent focus:outline-none"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mb-6 mx-2">
            <label htmlFor="password" className="mb-2">
              Password
            </label>
            <div className="flex items-center bg-blue-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-xl min-h-[54px] px-4">
              <Lock className="mr-3" />
              <input
                type="password"
                className="flex-1 bg-transparent focus:outline-none"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mb-6 mx-2">
            <label htmlFor="con-pass" className="mb-2">
              Confirm Password
            </label>
            <div className="flex items-center bg-blue-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-xl min-h-[54px] px-4">
              <Check className="mr-3" />
              <input
                type="password"
                className="flex-1 bg-transparent focus:outline-none"
                id="con-pass"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="form-check">
          <input className="rounded-lg" type="checkbox" value="" id="agree" />
          <label className="rounded-lg" htmlFor="agree">
            {" "}
            I accept to the{" "}
            <a href="#!" className="underline">
              terms & condition
            </a>
            ,
            <a href="#!" className="underline">
              privacy policy
            </a>
          </label>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      <button
        type="submit"
        className="bg-indigo-800 text-white px-7 py-3 rounded w-full"
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={handleGuest}
        className="mt-3 w-full border border-gray-300 dark:border-gray-700 rounded px-7 py-3 text-sm"
      >
        Continue as guest
      </button>

      <div className="relative">
        <hr className="my-6 md:my-12 border-gray-400" />
        <span className="px-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800">
          Or
        </span>
      </div>

      <SocialLoginButton />
    </form>
  );
};

const Register = () => {
  return (
    <section className="w-screen py-14 md:py-24 bg-white text-zinc-900 dark:text-white">
      <div className=" px-4 mx-auto">
        <div className="grid grid-cols-6 gap-6 h-full">
          <div className="col-span-6 md:col-span-2 lg:col-span-3">
            <img
              src="https://cdn.easyfrontend.com/pictures/sign-in-up/sign3.jpg"
              alt="sign up"
              className="bg-cover bg-center bg-no-repeat min-h-[150px] rounded-xl hidden md:block w-full md:w-[200%] lg:w-[150%] h-full object-cover"
            />
          </div>
          <div className="col-span-6 md:col-span-4 lg:col-span-3 py-12">
            <div className="flex items-center justify-center h-full w-full">
              <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-4 md:p-12">
                <div className="flex gap-2 items-center text-indigo-900 dark:text-white text-2xl font-bold mb-3">
                  <h2>Welcome to</h2>
                  <div className="text-3xl md:text-4xl font-bold">
                    <span className="text-black">DISCUSSI</span>
                    <span className="text-red-600">ON</span>
                  </div>
                </div>
                <div className="flex items-center mb-6 md:mb-12">
                  <p className="mb-0 mr-2 opacity-50">
                    Already have an account?
                  </p>
                  <a href="/auth/login">Sign In</a>
                </div>

                <SignUpForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
