// frontend/src/components/InteractionForm.jsx

import React, { useState } from "react";
import { createInteraction } from "../services/customerService";
import { toast } from "react-toastify";

// Define los tipos de interacción disponibles
const INTERACTION_TYPES = [
  { value: "Call", label: "Llamada" },
  { value: "Email", label: "Correo Electrónico" },
  { value: "SMS", label: "SMS" },
  { value: "Facebook", label: "Facebook Messenger" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Meeting", label: "Reunión" },
  { value: "Other", label: "Otro" },
];

function InteractionForm({ customerId, onInteractionAdded }) {
  const [interactionData, setInteractionData] = useState({
    interaction_type: "Call", // Valor por defecto
    interaction_date: new Date().toISOString().slice(0, 16), // Fecha y hora actuales
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInteractionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // El customerId se pasa como prop y se usa para la URL de la API
      await createInteraction(customerId, interactionData);
      alert("Interacción registrada exitosamente!");
      setInteractionData({
        // Resetear el formulario
        interaction_type: "Call",
        interaction_date: new Date().toISOString().slice(0, 16),
        notes: "",
      });
      if (onInteractionAdded) {
        onInteractionAdded(); // Notifica al componente padre (CustomerDetail) para que refresque
      }
    } catch (err) {
      console.error(
        "Error al registrar interacción:",
        err.response ? err.response.data : err.message
      );
      let errorMessage = "Error al registrar la interacción. Intenta de nuevo.";
      if (err.response && err.response.data) {
        errorMessage += "\nDetalles: " + JSON.stringify(err.response.data);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-md shadow-sm"
    >
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <div>
        <label
          htmlFor="interaction_type"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de Interacción:
        </label>
        <select
          id="interaction_type"
          name="interaction_type"
          value={interactionData.interaction_type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        >
          {INTERACTION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="interaction_date"
          className="block text-sm font-medium text-gray-700"
        >
          Fecha y Hora:
        </label>
        <input
          type="datetime-local"
          id="interaction_date"
          name="interaction_date"
          value={interactionData.interaction_date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notas:
        </label>
        <textarea
          id="notes"
          name="notes"
          value={interactionData.notes}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registrando..." : "Registrar Interacción"}
      </button>
    </form>
  );
}

export default InteractionForm;
