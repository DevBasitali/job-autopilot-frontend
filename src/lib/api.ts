import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const parseResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/parse-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const findJobs = async (payload: { profile: any; job_title: string; location: string; min_score: number; max_jobs: number }) => {
  const response = await api.post('/find-jobs', payload);
  return response.data;
};

export const applyToJob = async (payload: { job: any; profile: any; platform: string }) => {
  const response = await api.post('/apply', payload);
  return response.data;
};

export const getApplications = async () => {
  const response = await api.get('/applications');
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get('/sessions');
  return response.data;
};

export const startSession = async (platform: string) => {
  const response = await api.post(`/start-session/${platform}`);
  return response.data;
};

export const finishSession = async () => {
  const response = await api.post('/finish-session');
  return response.data;
};
