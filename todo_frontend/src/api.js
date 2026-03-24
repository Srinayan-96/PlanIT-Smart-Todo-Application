import axios from "axios";



const API_URL = "http://localhost:3000/api/tasks";

export const getTasks = () => axios.get(API_URL);
export const addTask = (title) => axios.post(API_URL, { title });
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
export const toggleTask = (id) => axios.patch(`${API_URL}/${id}/toggle`);



