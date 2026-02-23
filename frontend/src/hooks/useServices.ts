import { useState, useEffect, useCallback, useRef } from 'react';
import { Service, ServiceInput, ServiceUpdate } from '../types';

const API_URL = '/api';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/services`);
      const data = await res.json();
      setServices(data.services);
      setError(null);
    } catch (err) {
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    
    intervalRef.current = window.setInterval(() => {
      fetchServices();
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchServices]);

  const addService = async (input: ServiceInput): Promise<Service | null> => {
    try {
      const res = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const data = await res.json();
      await fetchServices();
      return data.service;
    } catch {
      setError('Failed to add service');
      return null;
    }
  };

  const updateService = async (id: string, updates: ServiceUpdate): Promise<Service | null> => {
    try {
      const res = await fetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      await fetchServices();
      return data.service;
    } catch {
      setError('Failed to update service');
      return null;
    }
  };

  const deleteService = async (id: string): Promise<boolean> => {
    try {
      await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
      await fetchServices();
      return true;
    } catch {
      setError('Failed to delete service');
      return false;
    }
  };

  return { services, loading, error, addService, updateService, deleteService, refetch: fetchServices };
}
