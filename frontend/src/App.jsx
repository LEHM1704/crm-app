// frontend/src/App.jsx

import React from "react";
import { Outlet, Link } from "react-router-dom"; // Importa Outlet y Link

function App() {
  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      {" "}
      {/* Añadimos padding inferior */}
      <header className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
        <Link
          to="/customers"
          className="text-2xl font-bold hover:text-blue-200 transition-colors duration-200"
        >
          Mi CRM
        </Link>
        <nav>
          <Link
            to="/customers/new"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200"
          >
            + Nuevo Cliente
          </Link>
        </nav>
      </header>
      <main className="container mx-auto mt-6">
        <Outlet />{" "}
        {/* Aquí se renderizarán los componentes de las rutas hijas */}
      </main>
    </div>
  );
}

export default App;
