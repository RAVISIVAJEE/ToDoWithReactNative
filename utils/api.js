import axios from 'axios';

const API_URL = 'http://192.168.8.137:5000';

// Function to get headers with the token
const getAuthHeaders = token => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const fetchTasks = async token => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    console.log('response is', response.ok);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    //console.error('Error fetching tasks:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export const addTask = async (token, task) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(task),
    });
    console.log('token is ', token);
    console.log('headers', getAuthHeaders(token));
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    const data = response.json();
    console.log('data is', data);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export const updateTask = async (task, token) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${task.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export const deleteTask = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
