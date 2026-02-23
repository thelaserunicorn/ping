import fs from 'fs';
import path from 'path';
import { Service, ServiceInput, ServiceUpdate } from './types.js';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data', 'services.json');
const MAX_HISTORY = 100;

function ensureDataDir(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadServices(): Service[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveServices(services: Service[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(services, null, 2));
}

export function getAllServices(): Service[] {
  return loadServices();
}

export function getServiceById(id: string): Service | undefined {
  const services = loadServices();
  return services.find(s => s.id === id);
}

export function createService(input: ServiceInput): Service {
  const services = loadServices();
  const newService: Service = {
    id: uuidv4(),
    name: input.name,
    url: input.url,
    interval: input.interval || 10000,
    createdAt: new Date().toISOString(),
    history: []
  };
  services.push(newService);
  saveServices(services);
  return newService;
}

export function updateService(id: string, updates: ServiceUpdate): Service | null {
  const services = loadServices();
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  const service = services[index];
  if (updates.name !== undefined) service.name = updates.name;
  if (updates.url !== undefined) service.url = updates.url;
  if (updates.interval !== undefined) service.interval = updates.interval;
  
  services[index] = service;
  saveServices(services);
  return service;
}

export function deleteService(id: string): boolean {
  const services = loadServices();
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return false;
  
  services.splice(index, 1);
  saveServices(services);
  return true;
}

export function updateServiceHealth(id: string, result: { status: string; latency: number; error?: string }): Service | null {
  const services = loadServices();
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  const service = services[index];
  const healthResult = {
    status: result.status as 'healthy' | 'down' | 'slow',
    latency: result.latency,
    timestamp: new Date().toISOString(),
    error: result.error
  };
  
  service.lastCheck = healthResult;
  service.history = [...service.history, healthResult].slice(-MAX_HISTORY);
  
  services[index] = service;
  saveServices(services);
  return service;
}

export { MAX_HISTORY };
