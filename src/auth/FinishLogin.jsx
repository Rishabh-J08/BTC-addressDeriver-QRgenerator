import { useEffect } from 'react';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const FinishLogin = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const emailForSignIn = window.localStorage.getItem("emailForSignIn");
    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (emailForSignIn) {
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then((result) => {
            console.log("Login successful!", result);
            window.localStorage.removeItem("emailForSignIn");
            navigate("/home"); 
          })
          .catch((error) => {
            console.error("Error completing login", error);
          });
      }
    }


    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <div>
      <h2>Logging you in...</h2>
    </div>
  );
};

export default FinishLogin;
