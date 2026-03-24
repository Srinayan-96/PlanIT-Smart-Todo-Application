import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks";

export const fetchTasks = ({ completed = "all", search = "" }) => {
  const params = {};
  if (completed !== "all") {
    params.completed = completed;
  }
  if (search.trim()) {
    params.search = search.trim();
  }
  return axios.get(API_URL, { params });
};

export const fetchTaskStats = () => axios.get(`${API_URL}/stats`);

export const fetchAlerts = () => axios.get(`${API_URL}/alerts`);
export const fetchActivityTrend = () => axios.get(`${API_URL}/activity-trend`);

export const createTask = (payload) => axios.post(API_URL, payload);

export const toggleTaskStatus = (id) => axios.patch(`${API_URL}/${id}/toggle`);

export const removeTask = (id) => axios.delete(`${API_URL}/${id}`);
