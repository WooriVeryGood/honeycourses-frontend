import axios from "axios";
import { Auth } from "aws-amplify";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getAuthHeaders() {
  try {
    const userSession = await Auth.currentSession();
    const jwtToken = userSession.getAccessToken().getJwtToken();

    return {
      Authorization: `Bearer ${jwtToken}`,
    };
  } catch (error) {
    console.error("Error fetching authentication headers:", error);
    throw error;
  }
}

export async function apiGet(endpoint: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiPost(endpoint: string, data: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${apiUrl}${endpoint}`, data, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiPut(endpoint: string, data:any) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(`${apiUrl}${endpoint}`, data, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiDelete(endpoint: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${apiUrl}${endpoint}`, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
}