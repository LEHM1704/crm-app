// frontend/src/components/InteractionList.jsx

import React, { useState, useEffect } from "react";
import {
  getInteractions,
  deleteInteraction,
} from "../services/customerService"; // Usaremos estas funciones

function InteractionList({ customerId, refreshKey }) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInteractions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInteractions(customerId);
        setInteractions(data);
      } catch (err) {
        console.error(
          "Error al obtener interacciones:",
          err.response ? err.response.data : err.message
        );
        setError("No se pudieron cargar las interacciones. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, [customerId, refreshKey]); // Depende del customerId y del refreshKey para recargar

  const handleDeleteInteraction = async (interactionId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta interacción?")
    ) {
      setLoading(true);
      try {
        await deleteInteraction(customerId, interactionId); // Usa customerId para la ruta anidada
        alert("Interacción eliminada exitosamente!");
        // Refrescar la lista después de eliminar
        setInteractions((prevInteractions) =>
          prevInteractions.filter((int) => int.id !== interactionId)
        );
      } catch (err) {
        console.error(
          "Error al eliminar interacción:",
          err.response ? err.response.data : err.message
        );
        setError("Error al eliminar la interacción. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center p-2 text-gray-600">
        Cargando interacciones...
      </div>
    );
  if (error) return <div className="text-center p-2 text-red-600">{error}</div>;

  if (interactions.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        Este cliente aún no tiene interacciones registradas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div
          key={interaction.id}
          className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold text-blue-700 text-lg">
                {interaction.interaction_type_display}
              </span>
              <span className="text-sm text-gray-600 ml-3">
                {new Date(interaction.interaction_date).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => handleDeleteInteraction(interaction.id)}
              className="text-red-500 hover:text-red-700 text-sm font-semibold"
              title="Eliminar Interacción"
            >
              Eliminar
            </button>
          </div>
          <p className="text-gray-800 text-sm whitespace-pre-wrap">
            {interaction.notes || "No hay notas para esta interacción."}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Creado: {new Date(interaction.created_at).toLocaleString()} | Última
            Actualización: {new Date(interaction.updated_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default InteractionList;
