import React, { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LOGO_URL } from '../data/initialData';

type LoginProps = {
  onSuccess: () => void;
  onClose?: () => void;
};

type Role = 'admin' | 'organizer' | 'sponsor';

export default function Login({
  onSuccess,
  onClose,
}: LoginProps) {

  // ==================================================
  // FORM STATE
  // ==================================================

  const [mode, setMode] =
    useState<'login' | 'signup'>('login');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [name, setName] =
    useState('');

  // Public signup is ALWAYS sponsor.
  const role: Role = 'sponsor';

  const [busy, setBusy] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  // ==================================================
  // CLEAR MESSAGES
  // ==================================================

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  // ==================================================
  // LOGIN / SIGNUP
  // ==================================================

  const submit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setBusy(true);
    clearMessages();

    try {

      const cleanEmail =
        email.trim().toLowerCase();

      const cleanPassword =
        password;

      // ==================================================
      // LOGIN
      // ==================================================

      if (mode === 'login') {

        console.log(
          'Attempting login:',
          cleanEmail
        );

        const {
          data,
          error: signInError,
        } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });

        if (signInError) {
          throw signInError;
        }

        if (!data.user) {
          throw new Error(
            'Login failed. No user account was returned.'
          );
        }

        console.log(
          'Login successful:',
          data.user.email
        );

        /*
         * AuthContext listens for the Supabase
         * authentication event and loads the
         * user's role from the profiles table.
         *
         * We do NOT determine the role here.
         */

        onSuccess();

        return;
      }

      // ==================================================
      // SIGN UP
      // ==================================================

      console.log(
        'Creating sponsor account:',
        cleanEmail
      );

      if (!name.trim()) {
        throw new Error(
          'Please enter your full name.'
        );
      }

      if (cleanPassword.length < 6) {
        throw new Error(
          'Password must contain at least 6 characters.'
        );
      }

      /*
       * IMPORTANT:
       *
       * Public signup is ALWAYS a SPONSOR.
       *
       * Users cannot choose:
       * - Admin
       * - Organizer
       *
       * Admin creates organizer accounts separately.
       */

      const {
        data,
        error: signUpError,
      } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,

          options: {
            data: {
              full_name:
                name.trim(),

              role: 'sponsor',
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      console.log(
        'Signup response:',
        data
      );

      // ==================================================
      // USER CREATED + SESSION AVAILABLE
      // ==================================================

      if (data.session && data.user) {

        console.log(
          'Sponsor account created and logged in:',
          data.user.email
        );

        setMessage(
          'Sponsor account created successfully.'
        );

        /*
         * AuthContext will receive the authentication
         * event and load the role from profiles.
         */

        onSuccess();

        return;
      }

      // ==================================================
      // EMAIL CONFIRMATION REQUIRED
      // ==================================================

      setMessage(
        'Account created successfully. Please check your email to confirm your account, then log in.'
      );

      setMode('login');

      setPassword('');

    } catch (err: any) {

      console.error(
        'Authentication error:',
        err
      );

      let errorMessage =
        'Authentication failed. Please try again.';

      if (
        err?.message
      ) {
        errorMessage =
          err.message;
      }

      // More user-friendly Supabase messages

      if (
        errorMessage
          .toLowerCase()
          .includes('invalid login credentials')
      ) {
        errorMessage =
          'Invalid email or password. Please check your credentials and try again.';
      }

      if (
        errorMessage
          .toLowerCase()
          .includes('email not confirmed')
      ) {
        errorMessage =
          'Your email has not been confirmed yet. Please check your inbox and confirm your email first.';
      }

      if (
        errorMessage
          .toLowerCase()
          .includes('user already registered')
      ) {
        errorMessage =
          'An account with this email already exists. Please log in instead.';
      }

      setError(
        errorMessage
      );

    } finally {

      setBusy(false);

    }
  };

  // ==================================================
  // SWITCH TO LOGIN
  // ==================================================

  const switchToLogin = () => {

    setMode('login');

    clearMessages();

  };

  // ==================================================
  // SWITCH TO SIGNUP
  // ==================================================

  const switchToSignup = () => {

    setMode('signup');

    clearMessages();

  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#fbf8ff]
        flex
        items-center
        justify-center
        px-4
        py-8
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-slate-200
          overflow-hidden
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            bg-gradient-to-br
            from-[#0040e0]
            to-[#2e5bff]
            px-8
            py-8
            text-center
          "
        >

          {/* LOGO */}

          <div
            className="
              flex
              justify-center
              mb-5
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-2xl
                bg-white
                flex
                items-center
                justify-center
                shadow-lg
                overflow-hidden
              "
            >

              <img
                src={LOGO_URL}
                alt="PCTE Campus Bridge"
                className="
                  w-full
                  h-full
                  object-contain
                  p-2
                "
              />

            </div>

          </div>

          <h1
            className="
              text-2xl
              font-extrabold
              text-white
            "
          >
            PCTE Campus Bridge
          </h1>

          <p
            className="
              text-blue-100
              text-sm
              mt-2
            "
          >
            {mode === 'login'
              ? 'Sign in to access your portal'
              : 'Create your Sponsor account'}
          </p>

        </div>

        {/* ==================================================
            FORM AREA
        ================================================== */}

        <div className="px-8 pt-7">

          {/* ==================================================
              LOGIN / SIGNUP TABS
          ================================================== */}

          <div
            className="
              grid
              grid-cols-2
              p-1
              bg-slate-100
              rounded-xl
              mb-6
            "
          >

            <button
              type="button"
              onClick={switchToLogin}
              className={`
                py-2.5
                rounded-lg
                text-sm
                font-bold
                transition-all
                ${
                  mode === 'login'
                    ? 'bg-white text-[#0040e0] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              Login
            </button>

            <button
              type="button"
              onClick={switchToSignup}
              className={`
                py-2.5
                rounded-lg
                text-sm
                font-bold
                transition-all
                ${
                  mode === 'signup'
                    ? 'bg-white text-[#0040e0] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              Sign Up
            </button>

          </div>

          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={submit}
            className="
              space-y-4
              pb-8
            "
          >

            {/* ==================================================
                FULL NAME
            ================================================== */}

            {mode === 'signup' && (

              <label className="block">

                <span
                  className="
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Full name
                </span>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  autoComplete="name"
                  className="
                    mt-1.5
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-[#0040e0]
                    focus:ring-2
                    focus:ring-blue-100
                  "
                  placeholder="Your full name"
                />

              </label>

            )}

            {/* ==================================================
                ACCOUNT TYPE
            ================================================== */}

            {mode === 'signup' && (

              <div
                className="
                  rounded-xl
                  bg-blue-50
                  border
                  border-blue-200
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    text-sm
                    font-bold
                    text-blue-800
                  "
                >
                  Account type
                </div>

                <div
                  className="
                    text-sm
                    text-blue-700
                    mt-1
                  "
                >
                  Sponsor
                </div>

                <p
                  className="
                    text-xs
                    text-blue-600
                    mt-1
                  "
                >
                  Public registration is available
                  only for sponsors. Organizer and
                  Admin accounts are created by an
                  administrator.
                </p>

              </div>

            )}

            {/* ==================================================
                EMAIL
            ================================================== */}

            <label className="block">

              <span
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Email
              </span>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
                className="
                  mt-1.5
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-[#0040e0]
                  focus:ring-2
                  focus:ring-blue-100
                "
                placeholder="you@example.com"
              />

            </label>

            {/* ==================================================
                PASSWORD
            ================================================== */}

            <label className="block">

              <span
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                minLength={6}
                autoComplete={
                  mode === 'login'
                    ? 'current-password'
                    : 'new-password'
                }
                className="
                  mt-1.5
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-[#0040e0]
                  focus:ring-2
                  focus:ring-blue-100
                "
                placeholder="Minimum 6 characters"
              />

            </label>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

              <div
                className="
                  rounded-xl
                  bg-red-50
                  border
                  border-red-200
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>

            )}

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {message && (

              <div
                className="
                  rounded-xl
                  bg-emerald-50
                  border
                  border-emerald-200
                  px-4
                  py-3
                  text-sm
                  text-emerald-700
                "
              >
                {message}
              </div>

            )}

            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={busy}
              className="
                w-full
                rounded-xl
                bg-[#0040e0]
                hover:bg-[#2e5bff]
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-white
                font-bold
                py-3.5
                transition-colors
                shadow-sm
              "
            >

              {busy
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Login'
                  : 'Create Sponsor Account'}

            </button>

            {/* ==================================================
                CLOSE
            ================================================== */}

            {onClose && (

              <button
                type="button"
                onClick={onClose}
                className="
                  w-full
                  py-2
                  text-sm
                  font-semibold
                  text-slate-500
                  hover:text-slate-800
                  transition-colors
                "
              >
                Back to public site
              </button>

            )}

          </form>

        </div>

      </div>

    </div>
  );
}