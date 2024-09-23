import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const auth = getAuth();
  const [email, setEmail] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedType, setSelectedType] = useState("Xpub"); // Only allow "Xpub"
  const [keyInput, setKeyInput] = useState("");
  const [currentKey, setCurrentKey] = useState(null);
  const [isKeySet, setIsKeySet] = useState(false);
  const [showGenerateOptions, setShowGenerateOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
      const keys = JSON.parse(localStorage.getItem("publicKeys")) || {};
      setCurrentKey(keys.Xpub || null); // Only consider "Xpub" for now, will add later functions MOVING FORWARD
      setIsKeySet(!!keys.Xpub);
    } else {
      navigate("/"); // Redirect to login if not logged in
    }
  }, [auth, navigate]);

  const handleButtonClick = () => {
    setShowOptions(true);
     setShowGenerateOptions(false);
  };

  const handleSetKey = () => {
    const keys = JSON.parse(localStorage.getItem("publicKeys")) || {};
    keys[selectedType] = keyInput;
    localStorage.setItem("publicKeys", JSON.stringify(keys));
    setCurrentKey(keys[selectedType]);
    setIsKeySet(true);
    setKeyInput(""); // Clear the input
  };

  const handleChangeKey = () => {
    const keys = JSON.parse(localStorage.getItem("publicKeys")) || {};
    delete keys[selectedType];
    localStorage.setItem("publicKeys", JSON.stringify(keys));
    setCurrentKey(null);
    setIsKeySet(false);
    setShowOptions(false);
    setSelectedType("Xpub"); // Reset selected type to Xpub
  };

  const handleGenerateOptions = () => {
    setShowGenerateOptions(true);
  };

  const handleDeriveAddresses = () => {
    navigate("/home/addresses"); // Route to derive addresses
  };

  const handleGenerateQR = () => {
    navigate("/home/generate-qr"); // Route to generate QR code
  };

  return (
    <div className="flex flex-col md:flex-row bg-slate-700 h-screen">
      <div className="md:w-1/4 w-full p-4 bg-gray-500 h-full flex flex-col justify-between">
        <h2 className="font-bold mb-4 text-lg text-center">Options</h2>
        <div className="flex-grow flex flex-col items-center">
          <button className="mb-2 p-2 w-3/4 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={handleButtonClick}>
            Set Xpub
          </button>
          <button 
            className={`p-2 w-3/4 ${isKeySet ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded hover:${isKeySet ? 'bg-blue-600' : 'bg-gray-400'} transition`} 
            disabled={!isKeySet} 
            onClick={handleGenerateOptions}
          >
            Generate QR/Address
          </button>
        </div>
      </div>
      <div className="md:w-3/4 w-full p-4 flex items-center justify-center">
        {showGenerateOptions ? (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl text-white">Choose an option:</h1>
            <button className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition" onClick={handleDeriveAddresses}>
              <div className='flex'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>      
                Derive Addresses
              </div> 
            </button>
            <button className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition" onClick={handleGenerateQR}>
              <div className='flex'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                </svg>         
                Generate QR
              </div>
            </button>
          </div>
        ) : (
          showOptions ? (
            currentKey ? (
              <div className="flex flex-col items-center">
                <h1 className="text-2xl text-white">Current {selectedType} Address:</h1>
                {/* Display the Xpub inside a textarea */}
                <textarea
                  className="p-2 w-3/4 h-24 rounded border"
                  value={currentKey}
                  readOnly
                />
                <button className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={handleChangeKey}>
                  Change {selectedType}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h1 className="text-2xl text-white">Enter {selectedType}:</h1>
                <input
                  className="p-2 rounded border"
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                />
                <button className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition" onClick={handleSetKey}>
                  Set {selectedType}
                </button>
              </div>
            )
          ) : (
            <div className="text-white text-lg">You are logged in as {email}
            <div className=' text-green-800'>
                <h1>Dont have BIP 32 root key(xpub)?</h1>
                <ul>Generate Mnemonic  <strong>(WIP)</strong></ul>
                <ul>Get you BIP32 root key <strong>(WIP)</strong> </ul>
            </div>
            
            </div>

            
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;
