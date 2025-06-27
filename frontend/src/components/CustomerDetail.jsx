// frontend/src/components/CustomerDetail.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerDetail, deleteCustomer } from "../services/customerService";
import InteractionForm from "./InteractionForm";
import InteractionList from "./InteractionList";
import { toast } from "react-toastify";

function CustomerDetail() {
  const { id } = useParams(); // Obtiene el ID del cliente de la URL
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInteractionForm, setShowInteractionForm] = useState(false); // Para mostrar/ocultar el formulario de interacción
  const [refreshInteractions, setRefreshInteractions] = useState(0); // Para refrescar la lista de interacciones

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCustomerDetail(id);
        setCustomer(data);
      } catch (err) {
        console.error(
          "Error al obtener el detalle del cliente:",
          err.response ? err.response.data : err.message
        );
        setError("No se pudo cargar el detalle del cliente. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]); // Dependencia: se ejecuta cuando el ID del cliente en la URL cambia

  const handleDelete = async () => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar a ${customer.full_name}?`
      )
    ) {
      setLoading(true);
      try {
        await deleteCustomer(id);
        toast.success("Cliente eliminado exitosamente!");
        navigate("/customers"); // Redirige a la lista de clientes
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

  const handleInteractionAdded = () => {
    setShowInteractionForm(false); // Oculta el formulario
    setRefreshInteractions((prev) => prev + 1); // Incrementa para forzar el refresco de InteractionList
  };

  if (loading)
    return (
      <div className="text-center p-4 text-xl font-semibold">
        Cargando detalles del cliente...
      </div>
    );
  if (error)
    return (
      <div className="text-center p-4 text-xl font-semibold text-red-600">
        {error}
      </div>
    );
  if (!customer)
    return (
      <div className="text-center p-4 text-xl font-semibold text-gray-500">
        Cliente no encontrado.
      </div>
    );

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
        Detalles de {customer.full_name}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
            Información Básica
          </h3>
          <p className="text-gray-700">
            <span className="font-semibold">Nombre:</span> {customer.first_name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Apellido:</span>{" "}
            {customer.last_name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span>{" "}
            {customer.email || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Teléfono:</span>{" "}
            {customer.phone_number || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Dirección:</span>{" "}
            {customer.address || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Cumpleaños:</span>{" "}
            {customer.birthday_formatted || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Compañía:</span>{" "}
            {customer.company ? customer.company.name : "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Representante de Ventas:</span>{" "}
            {customer.sales_representative_full_name ||
              customer.sales_representative_username ||
              "N/A"}
          </p>
          <p className="text-gray-700 text-xs mt-2">
            <span className="font-semibold">Creado:</span>{" "}
            {new Date(customer.created_at).toLocaleString()}
          </p>
          <p className="text-gray-700 text-xs">
            <span className="font-semibold">Última Actualización:</span>{" "}
            {new Date(customer.updated_at).toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
            Acciones
          </h3>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate(`/customers/edit/${customer.id}`)}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
            >
              Editar Cliente
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Eliminar Cliente
            </button>
            <button
              onClick={() => setShowInteractionForm(!showInteractionForm)}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              {showInteractionForm
                ? "Ocultar Formulario de Interacción"
                : "Añadir Nueva Interacción"}
            </button>
            <button
              onClick={() => navigate("/customers")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Volver a la Lista
            </button>
          </div>
        </div>
      </div>

      {showInteractionForm && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">
            Registrar Nueva Interacción
          </h3>
          <InteractionForm
            customerId={customer.id}
            onInteractionAdded={handleInteractionAdded}
          />
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Historial de Interacciones
        </h3>
        <InteractionList
          customerId={customer.id}
          refreshKey={refreshInteractions}
        />
      </div>
    </div>
  );
}

export default CustomerDetail;
