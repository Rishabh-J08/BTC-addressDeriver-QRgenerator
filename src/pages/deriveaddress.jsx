import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeriveAddress = () => {
  const auth = getAuth();
  const [addresses, setAddresses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [numAddresses, setNumAddresses] = useState(10);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [xpubType, setXpubType] = useState('p2wpkh'); // Default xpub type
  const [derivationPath, setDerivationPath] = useState("m/49'/0'/0'/0"); // Default derivation path
  const addressesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/"); // Redirect to login if not logged in
    }
  }, [auth, navigate]);

  // Function to generate addresses based on user input
  const handleGenerateRandomAddresses = async () => {
    const keys = JSON.parse(localStorage.getItem("publicKeys")) || {};
    const xpubOrZpub = keys.Xpub || keys.Zpub;

    if (xpubOrZpub) {
      try {
        const response = await axios.post('https://btc-addressderivation-backend.onrender.com/api/derive-addresses', {
          xpub: xpubOrZpub,
          numberOfAddresses: numAddresses,
          xpubType: xpubType,
          derivationPath: derivationPath
        });

        const fetchedAddresses = response.data.addresses;
        setAddresses(fetchedAddresses);
        setTotalAddresses(fetchedAddresses.length);
        setCurrentPage(1);
        setCopiedIndex(null);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }
  };

  // Dropdown options
  const xpubTypes = ['p2pkh', 'p2wpkh', 'p2sh-p2wpkh'];
  const derivationPaths = [
    "m/44'/0'/0'/0", // BIP44
    "m/49'/0'/0'/0", // BIP49
    "m/84'/0'/0'/0", // BIP84
    "m/0'/0'/0'/0"   // Custom option
  ];

  // Pagination logic: Get addresses for the current page
  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;
  const currentAddresses = addresses.slice(indexOfFirstAddress, indexOfLastAddress);

  // Handle next and previous page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalAddresses / addressesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Copy the address to the clipboard
  const handleCopy = (address, idx) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-600">
      <h1 className="text-2xl">Derived Addresses</h1>
      
      <input
        type="number"
        value={numAddresses}
        onChange={(e) => setNumAddresses(parseInt(e.target.value))}
        className="mt-4 p-2 rounded border"
        placeholder="Enter number of addresses to generate"
      />

      {/* Dropdown for xpub type */}
      <select
        value={xpubType}
        onChange={(e) => setXpubType(e.target.value)}
        className="mt-2 p-2 rounded border"
      >
        {xpubTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      {/* Dropdown for derivation paths */}
      <select
        value={derivationPath}
        onChange={(e) => setDerivationPath(e.target.value)}
        className="mt-2 p-2 rounded border"
      >
        {derivationPaths.map((path) => (
          <option key={path} value={path}>{path}</option>
        ))}
      </select>

      <button
        onClick={handleGenerateRandomAddresses}
        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Generate Addresses
      </button>

      {currentAddresses.length > 0 ? (
        <>
          <table className="mt-4 text-white border-collapse border border-gray-500">
            <thead>
              <tr>
                <th className="border border-gray-500 p-2">Index</th>
                <th className="border border-gray-500 p-2">Address</th>
                <th className="border border-gray-500 p-2">Copy</th>
              </tr>
            </thead>
            <tbody>
              {currentAddresses.map(({ index, address }, idx) => (
                <tr key={index}>
                  <td className="border border-gray-500 p-2">{index + 1}</td>
                  <td className="border border-gray-500 p-2">{address}</td>
                  <td className="border border-gray-500 p-2">
                    <button
                      onClick={() => handleCopy(address, idx)}
                      className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      {copiedIndex === idx ? 'Copied!' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between w-full max-w-md">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 bg-blue-500 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(totalAddresses / addressesPerPage)}
              className={`p-2 bg-blue-500 text-white rounded ${currentPage === Math.ceil(totalAddresses / addressesPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              Next
            </button>
          </div>
          <p className="mt-2 text-lg text-white">Page {currentPage} of {Math.ceil(totalAddresses / addressesPerPage)}</p>
        </>
      ) : (
        <p className="mt-4 text-lg text-white">No addresses generated yet.</p>
      )}
    </div>
  );
};

export default DeriveAddress;
