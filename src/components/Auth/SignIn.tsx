import React, { useState } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green/10 to-primary-purple/10">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary-green to-primary-purple bg-clip-text text-transparent">
          Sign In
        </h2>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            required
          />
        </div>
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        <button type="submit" className="w-full mb-2">
          <Button variant="primary" className="w-full">
            Sign In
          </Button>
        </button>
        <div className="flex justify-between text-sm mt-2">
          <Link to="/signup" className="text-primary-green hover:underline">
            Create account
          </Link>
          <Link
            to="/forgot-password"
            className="text-primary-purple hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};
