// frontend/src/services/customerService.js

import axios from "axios";

// URL base de tu API de Django
const API_BASE_URL = "http://localhost:8000/api";

/**
 * Obtiene una lista paginada y filtrada de clientes desde la API.
 * @param {Object} params - Objeto de parámetros de consulta.
 * @param {number} params.page - Número de página actual.
 * @param {string} params.search - Texto de búsqueda.
 * @param {string} params.birthday_filter - Filtro de cumpleaños ('today', 'this_week', 'this_month').
 * @param {string} params.ordering - Campo y orden para la clasificación (ej: 'full_name', '-company__name').
 * @returns {Promise<Object>} Un objeto que contiene los resultados de la paginación y el conteo total.
 */
export const getCustomers = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/`, { params });
    // DRF paginación: results contiene los datos, count el total
    // Asumimos que page_size es 10 según la configuración de tu backend
    const pageSize = 10; // Definido en StandardResultsSetPagination en Django
    return {
      results: response.data.results,
      count: response.data.count,
      totalPages: Math.ceil(response.data.count / pageSize), // Calculamos totalPages aquí
    };
  } catch (error) {
    console.error("Error en getCustomers:", error);
    // Propaga el error para que el componente pueda manejarlo
    throw error;
  }
};

/**
 * Crea un nuevo cliente.
 * @param {Object} customerData - Los datos del nuevo cliente.
 * @returns {Promise<Object>} El cliente recién creado.
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customers/create/`,
      customerData
    );
    return response.data;
  } catch (error) {
    console.error("Error en createCustomer:", error);
    throw error;
  }
};

/**
 * Obtiene los detalles de un cliente específico.
 * @param {string} id - El ID del cliente.
 * @returns {Promise<Object>} Los datos del cliente.
 */
export const getCustomerDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error en getCustomerDetail para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza un cliente existente.
 * @param {string} id - El ID del cliente a actualizar.
 * @param {Object} customerData - Los datos actualizados del cliente.
 * @returns {Promise<Object>} El cliente actualizado.
 */
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/customers/${id}/`,
      customerData
    );
    return response.data;
  } catch (error) {
    console.error(`Error en updateCustomer para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un cliente.
 * @param {string} id - El ID del cliente a eliminar.
 * @returns {Promise<void>}
 */
export const deleteCustomer = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/customers/${id}/`);
  } catch (error) {
    console.error(`Error en deleteCustomer para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene una lista de compañías (para el selector en el formulario de cliente).
 * @returns {Promise<Object>} Un objeto que contiene los resultados de las compañías.
 */
export const getCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies/`);
    return response.data; // Asume que la API de compañías devuelve un objeto con 'results' si está paginada
  } catch (error) {
    console.error("Error en getCompanies:", error);
    throw error;
  }
};

/**
 * Obtiene una lista de usuarios (representantes de ventas) para selectores.
 * @returns {Promise<Object[]>} Una lista de usuarios.
 */
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/`);
    // Asegúrate de que esto devuelve un array directamente si tu API no lo envuelve en 'results'
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error en getUsers:", error);
    throw error;
  }
};

/**
 * Obtiene las interacciones para un cliente específico.
 * @param {string} customerId - El ID del cliente.
 * @returns {Promise<Object[]>} Una lista de interacciones.
 */
export const getInteractions = async (customerId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/customers/${customerId}/interactions/`
    );
    return response.data; // Asume que devuelve directamente una lista
  } catch (error) {
    console.error(
      `Error en getInteractions para cliente ${customerId}:`,
      error
    );
    throw error;
  }
};

/**
 * Crea una nueva interacción para un cliente específico.
 * @param {string} customerId - El ID del cliente.
 * @param {Object} interactionData - Los datos de la nueva interacción.
 * @returns {Promise<Object>} La interacción recién creada.
 */
export const createInteraction = async (customerId, interactionData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customers/${customerId}/interactions/`,
      interactionData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error en createInteraction para cliente ${customerId}:`,
      error
    );
    throw error;
  }
};

/**
 * Elimina una interacción específica.
 * @param {string} customerId - El ID del cliente al que pertenece la interacción (para la ruta anidada).
 * @param {string} interactionId - El ID de la interacción a eliminar.
 * @returns {Promise<void>}
 */
export const deleteInteraction = async (customerId, interactionId) => {
  try {
    await axios.delete(
      `${API_BASE_URL}/customers/${customerId}/interactions/${interactionId}/`
    );
  } catch (error) {
    console.error(
      `Error en deleteInteraction para cliente ${customerId}, interacción ${interactionId}:`,
      error
    );
    throw error;
  }
};
