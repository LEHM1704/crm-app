// frontend/src/components/CustomerForm.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// <-- Vuelve a importar getUsers
import {
  createCustomer,
  getCustomerDetail,
  updateCustomer,
  getCompanies,
  getUsers,
} from "../services/customerService";

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
    company_id: "",
    sales_representative_id: "", // <-- Vuelve a añadir este estado
  });
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]); // <-- Vuelve a añadir este estado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const companiesData = await getCompanies();
        setCompanies(companiesData);

        const usersData = await getUsers(); // <-- Vuelve a llamar a getUsers
        setUsers(usersData);

        if (id) {
          setIsEditMode(true);
          const customer = await getCustomerDetail(id);
          setCustomerData({
            first_name: customer.first_name || "",
            last_name: customer.last_name || "",
            email: customer.email || "",
            phone_number: customer.phone_number || "",
            address: customer.address || "",
            date_of_birth: customer.date_of_birth || "",
            company_id: customer.company ? customer.company.id : "",
            // <-- Vuelve a añadir esta línea
            sales_representative_id: customer.sales_representative
              ? customer.sales_representative.id
              : "",
          });
        }
      } catch (err) {
        console.error(
          "Error al cargar datos del formulario:",
          err.response ? err.response.data : err.message
        );
        setError("No se pudieron cargar los datos. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSave = { ...customerData };
      if (dataToSave.company_id === "") {
        dataToSave.company_id = null;
      }
      // <-- Vuelve a añadir este bloque
      if (dataToSave.sales_representative_id === "") {
        dataToSave.sales_representative_id = null;
      }

      if (isEditMode) {
        await updateCustomer(id, dataToSave);
        toast.success("Cliente actualizado exitosamente!");
      } else {
        await createCustomer(dataToSave);
        toast.success("Cliente creado exitosamente!");
      }
      navigate("/customers");
    } catch (err) {
      console.error(
        "Error al guardar cliente:",
        err.response ? err.response.data : err.message
      );
      let errorMessage = "Error al guardar el cliente. Intenta de nuevo.";
      if (err.response && err.response.data) {
        const backendErrors = Object.values(err.response.data)
          .flat()
          .join("; ");
        errorMessage += `\nDetalles: ${backendErrors}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center p-4 text-xl font-semibold">
        Cargando formulario...
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
        {isEditMode ? "Editar Cliente" : "Nuevo Cliente"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={customerData.first_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
          >
            Apellido:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={customerData.last_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700"
          >
            Teléfono:
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={customerData.phone_number}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Dirección:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={customerData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label
            htmlFor="date_of_birth"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha de Nacimiento:
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={customerData.date_of_birth}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>

        {/* Selector de Compañía (sin cambios) */}
        <div>
          <label
            htmlFor="company_id"
            className="block text-sm font-medium text-gray-700"
          >
            Compañía:
          </label>
          <select
            id="company_id"
            name="company_id"
            value={customerData.company_id || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          >
            <option value="">-- Seleccionar Compañía --</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* <-- Vuelve a añadir todo el div del Selector de Representante de Ventas */}
        <div>
          <label
            htmlFor="sales_representative_id"
            className="block text-sm font-medium text-gray-700"
          >
            Representante de Ventas:
          </label>
          <select
            id="sales_representative_id"
            name="sales_representative_id"
            value={customerData.sales_representative_id || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          >
            <option value="">-- Seleccionar Representante --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Guardando..."
              : isEditMode
              ? "Actualizar Cliente"
              : "Crear Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
