import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import AuthInput from './AuthInput';

const LoginForm = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, rememberMe });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <AuthInput
        label="Email Address"
        type="email"
        placeholder="seller@glazed.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
      />

      <AuthInput
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={Lock}
      />

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#004D40] focus:ring-[#004D40]"
          />
          Remember me
        </label>
        <a href="#forgot" className="text-xs font-bold text-[#004D40] hover:underline">
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-press w-full bg-[#004D40] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#003d33] transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {isLoading ? 'Verifying Account...' : 'Sign In To Terminal'}
        {!isLoading && <ArrowRight size={16} />}
      </button>
    </form>
  );
};

export default LoginForm;