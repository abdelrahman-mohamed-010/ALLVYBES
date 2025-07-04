import React, { useState } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message);
      setMessage("");
    } else {
      setMessage("If this email exists, a reset link will be sent.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green/10 to-primary-purple/10">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary-green to-primary-purple bg-clip-text text-transparent">
          Forgot Password
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
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        {message && (
          <div className="text-green-600 mb-4 text-sm">{message}</div>
        )}
        <Button
          type="submit"
          variant="primary"
          className={`w-full flex items-center justify-center ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </Button>
        <div className="flex justify-between text-sm mt-2">
          <Link to="/login" className="text-primary-green hover:underline">
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};
