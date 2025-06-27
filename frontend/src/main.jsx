// frontend/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import CustomerList from "./components/CustomerList.jsx";
import CustomerForm from "./components/CustomerForm.jsx";
import CustomerDetail from "./components/CustomerDetail.jsx";
import "./index.css";

// *** NUEVAS IMPORTACIONES PARA REACT-TOASTIFY ***
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ************************************************

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<CustomerList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/edit/:id" element={<CustomerForm />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
        </Route>
      </Routes>
    </Router>
    {/* *** AÑADE EL TOASTCONTAINER AQUÍ, FUERA DEL ROUTER PERO DENTRO DE React.StrictMode *** */}
    <ToastContainer
      position="top-right" // Puedes cambiar la posición (top-left, bottom-center, etc.)
      autoClose={5000} // Cierra automáticamente después de 5 segundos
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" // o "dark" o "colored"
    />
    {/* *********************************************************************************** */}
  </React.StrictMode>
);
