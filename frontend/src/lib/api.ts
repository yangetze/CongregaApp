import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api';

export function useOrganizations() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/organizations`, {
      headers: {
        'Authorization': 'Bearer mock-token'
      }
    })
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useUsers() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': 'Bearer mock-token'
      }
    })
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useEvents(organizationId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = organizationId
        ? `${API_BASE_URL}/events?organizationId=${organizationId}`
        : `${API_BASE_URL}/events`;

    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [organizationId]);

  return { data, loading };
}
