import { useState, useEffect } from 'react';
import { signInWithEmailLink, sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../config/firebaseConfig.js'; // Ensure this is your correct path
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const EmailLogin = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setDisabled(email.trim() === "" || !email.includes("@") || !email.includes("."));
  }, [email]);

  const handleSendLink = async () => {
    const actionCodeSettings = {
      url: import.meta.env.VITE_REDIRECT_LOGIN_URL, // After login, redirect to this URL
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email); // Save email locally
      setEmailSent(true);
      alert("Verification link sent to your email");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send verification email");
    }
  };

  const handleLogin = async () => {
    const emailForSignIn = window.localStorage.getItem("emailForSignIn");
    if (signInWithEmailLink(auth, emailForSignIn, window.location.href)) {
      window.localStorage.removeItem("emailForSignIn");
      alert("Login successful");
      navigate('/home'); // Redirect after successful login
    } else {
      alert("Invalid sign-in link");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Welcome ${user.displayName}!`);
      navigate('/home'); // Redirect to /home after successful login
    } catch (error) {
      console.error("Error with Google sign-in:", error);
      alert("Failed to sign in with Google");
    }
  };

  useEffect(() => {
    // Check if this page is accessed via a sign-in link
    const emailForSignIn = window.localStorage.getItem("emailForSignIn");
    if (emailForSignIn && signInWithEmailLink(auth, emailForSignIn, window.location.href)) {
      handleLogin();
    }
  }, []); // Runs on component mount

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray p-4 bg-[#3c3c3c]'>
      <h1 className='text-white font-bold text-2xl'>
        Welcome to my BTC APP
      </h1>
      <div className='bg-white shadow-2xl rounded-lg p-6 w-full max-w-md'>
        {!emailSent ? (
          <div>
            <h2 className='text-2xl font-bold mb-4 text-center text-gray-500'>Email Verification Login</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border border-gray-300 rounded-lg p-2 mb-4 w-full text-gray-400'
            />
            <button
              onClick={handleSendLink}
              disabled={disabled}
              className={`bg-blue-600 text-white font-semibold rounded-lg p-2 w-full flex items-center justify-center 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition duration-200'}`}
            >
              Send Link
            </button>
            <p className='text-center my-4 text-gray-500'>Or</p>
            <button
              onClick={handleGoogleLogin}
              className='bg-green-700 text-white font-semibold rounded-lg p-2 w-full flex items-center justify-center hover:bg-red-700 transition duration-200'
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
    <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
</svg>
              Sign in with Google
            </button>
          </div>
        ) : (
          <div>
            <h2 className='text-xl font-semibold mb-2 text-center'>Check your email for the link.</h2>
            <p className='text-gray-600 text-center'>If you don’t see it, check your spam folder.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailLogin;
