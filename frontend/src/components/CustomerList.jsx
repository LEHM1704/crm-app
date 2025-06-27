// frontend/src/components/CustomerList.jsx

import React, { useState, useEffect, useRef } from "react";
import { getCustomers, deleteCustomer } from "../services/customerService"; // Importa deleteCustomer
import { useNavigate } from "react-router-dom"; // Importa useNavigate

function CustomerList() {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [inputSearchValue, setInputSearchValue] = useState("");

  const [birthdayFilter, setBirthdayFilter] = useState("");
  const [sortField, setSortField] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const debounceTimeoutRef = useRef(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        search: searchQuery,
        birthday_filter: birthdayFilter,
        ordering: `${sortOrder === "desc" ? "-" : ""}${sortField}`,
      };

      const data = await getCustomers(params);

      setCustomers(data.results);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error al obtener los clientes:", err);
      setError(
        "No se pudieron cargar los clientes. Intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchQuery, birthdayFilter, sortField, sortOrder]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setSearchQuery(inputSearchValue);
      setCurrentPage(1);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [inputSearchValue]);

  const handleInputChange = (e) => {
    setInputSearchValue(e.target.value);
  };

  const handleBirthdayFilterChange = (e) => {
    setBirthdayFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getSortIndicator = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  const handleDelete = async (customerId, customerName) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar a ${customerName}? Esta acción es irreversible y eliminará también todas sus interacciones.`
      )
    ) {
      setLoading(true);
      try {
        await deleteCustomer(customerId);
        alert("Cliente eliminado exitosamente!");
        // Refrescar la lista de clientes después de eliminar
        fetchCustomers();
      } catch (err) {
        console.error(
          "Error al eliminar cliente:",
          err.response ? err.response.data : err.message
        );
        setError("Error al eliminar el cliente. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center p-4 text-xl font-semibold">
        Cargando clientes...
      </div>
    );
  if (error)
    return (
      <div className="text-center p-4 text-xl font-semibold text-red-600">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
        Lista de Clientes
      </h2>

      {/* Filtros y Búsqueda */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-grow">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Buscar por nombre o empresa:
          </label>
          <input
            type="text"
            id="search"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Ej. Juan Pérez o ABC Corp"
            value={inputSearchValue}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label
            htmlFor="birthdayFilter"
            className="block text-sm font-medium text-gray-700"
          >
            Cumpleaños:
          </label>
          <select
            id="birthdayFilter"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={birthdayFilter}
            onChange={handleBirthdayFilterChange}
          >
            <option value="">Todos</option>
            <option value="today">Hoy</option>
            <option value="this_week">Esta Semana</option>
            <option value="this_month">Este Mes</option>
          </select>
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSortChange("full_name")}
              >
                Nombre Completo {getSortIndicator("full_name")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSortChange("company__name")}
              >
                Compañía {getSortIndicator("company__name")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSortChange("date_of_birth")}
              >
                Cumpleaños {getSortIndicator("date_of_birth")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSortChange("last_interaction_date")}
              >
                Última Interacción {getSortIndicator("last_interaction_date")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No se encontraron clientes que coincidan con los criterios.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.company ? customer.company.name : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.birthday_formatted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.latest_interaction
                      ? `${customer.latest_interaction.time_ago} (${customer.latest_interaction.type})`
                      : "Ninguna"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/customers/${customer.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver Detalles"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/customers/edit/${customer.id}`)
                        }
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editar Cliente"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(customer.id, customer.full_name)
                        }
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar Cliente"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex justify-between items-center px-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="text-gray-700 text-lg font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default CustomerList;
