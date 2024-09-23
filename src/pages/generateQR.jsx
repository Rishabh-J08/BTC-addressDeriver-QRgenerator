import { useEffect, useState, useRef } from 'react';
import { getAuth } from "firebase/auth";
import { QRCodeSVG } from 'qrcode.react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const GenerateQR = () => {
  const auth = getAuth();
  const [address, setAddress] = useState("");
  const [xpubType, setXpubType] = useState("p2pkh");
  const [isGenerating, setIsGenerating] = useState(false); 
  const [isQRGenerated, setIsQRGenerated] = useState(false);
  const navigate = useNavigate();
  const qrRef = useRef(null); 

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
    }
  }, [auth, navigate]);

  const handleGenerateRandomAddress = async () => {
    const keys = JSON.parse(localStorage.getItem("publicKeys")) || {};
    const xpub = keys.Xpub || keys.Zpub;

    if (xpub) {
      setIsGenerating(true);
      
      const randomIndex = Math.floor(Math.random() * 10000000);
      const derivationPath = `m/0/${randomIndex}`; // Construct the derivation path

      try {
        const response = await axios.post('https://btc-addressderivation-backend.onrender.com/api/derive-addresses', {
          xpub,
          numberOfAddresses: 1, 
          derivationPath,
          xpubType,
        });



        const addresses = response.data.addresses;
        if (addresses && addresses.length > 0 && addresses[0].address) {
          setAddress(addresses[0].address); 
        } else {
          console.error("No valid address returned from the API.");
        }
      } catch (error) {
        console.error("Error generating addresses:", error);
      } finally {
        setIsGenerating(false);
        setIsQRGenerated(false);
      }
    }
  };

  const handleGenerateQR = () => {
    setIsQRGenerated(true);
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'btc-address-qr.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center bg-gray-700">
      <h1 className="text-2xl">Generate QR Code</h1>
      <button
        onClick={handleGenerateRandomAddress}
        className={`mt-4 p-2 ${isGenerating ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition`}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Random Address'}
      </button>

      <div className="mt-4">
        <label className="mr-2">Xpub Type:</label>
        <select
          value={xpubType}
          onChange={(e) => setXpubType(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="p2pkh">p2pkh</option>
          <option value="p2wpkh">p2wpkh</option>
        
        </select>
      </div>

      {address && (
        <button
          onClick={handleGenerateQR}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Generate QR
        </button>
      )}

      {isQRGenerated && address && (
        <>
          <div ref={qrRef} className="mt-4">
            <QRCodeSVG value={`bitcoin:${address}`} size={256} />
          </div>
          <p className="mt-4 text-lg text-white">Send BTC to: {address}</p>
          <button
            onClick={handleDownloadQR}
            className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Download QR
          </button>
        </>
      )}
    </div>
  );
};

export default GenerateQR;
