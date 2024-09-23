import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmailLogin from './auth/EmailLogin';
import FinishLogin from './auth/FinishLogin';
import HomePage from './pages/homes';
import DeriveAddresses from './pages/deriveaddress';
import GenerateQR from './pages/generateQR';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmailLogin />} />
        <Route path="/finishLogin" element={<FinishLogin />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/addresses" element={<DeriveAddresses />} />
        <Route path="/home/generate-qr" element={<GenerateQR />} />
      </Routes>
    </Router>
  );
}

export default App;
