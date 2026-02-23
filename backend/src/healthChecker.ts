import https from 'https';
import http from 'http';
import net from 'net';
import { URL } from 'url';
import { Service, HealthCheckResult } from './types.js';
import { getAllServices, updateServiceHealth } from './storage.js';

type WebSocketBroadcaster = (message: object) => void;

let broadcaster: WebSocketBroadcaster | null = null;
const intervals: Map<string, NodeJS.Timeout> = new Map();

export function setBroadcaster(fn: WebSocketBroadcaster): void {
  broadcaster = fn;
}

function determineStatus(latency: number, hasError: boolean): 'healthy' | 'slow' | 'down' {
  if (hasError) return 'down';
  if (latency > 1000) return 'slow';
  return 'healthy';
}

function isIPPort(target: string): boolean {
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/.test(target) ||
         /^localhost:\d+$/.test(target) ||
         /^[\w.-]+:\d+$/.test(target);
}

async function checkTCP(host: string, port: number): Promise<HealthCheckResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
      const latency = Date.now() - start;
      socket.destroy();
      resolve({
        status: determineStatus(latency, false),
        latency,
        timestamp: new Date().toISOString()
      });
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      const latency = Date.now() - start;
      resolve({
        status: 'down',
        latency,
        timestamp: new Date().toISOString(),
        error: 'Connection timeout'
      });
    });
    
    socket.on('error', (error) => {
      const latency = Date.now() - start;
      resolve({
        status: 'down',
        latency,
        timestamp: new Date().toISOString(),
        error: error.message
      });
    });
    
    socket.connect(port, host);
  });
}

async function checkHTTP(url: string): Promise<HealthCheckResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = protocol.get(url, { timeout: 5000 }, (res) => {
        const latency = Date.now() - start;
        resolve({
          status: determineStatus(latency, false),
          latency,
          timestamp: new Date().toISOString()
        });
      });
      
      req.on('error', (error) => {
        const latency = Date.now() - start;
        resolve({
          status: 'down',
          latency,
          timestamp: new Date().toISOString(),
          error: error.message
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        const latency = Date.now() - start;
        resolve({
          status: 'down',
          latency,
          timestamp: new Date().toISOString(),
          error: 'Request timeout'
        });
      });
    } catch (error) {
      const latency = Date.now() - start;
      resolve({
        status: 'down',
        latency,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

async function checkServiceHealth(service: Service): Promise<HealthCheckResult> {
  const target = service.url.trim();
  
  if (isIPPort(target)) {
    const [host, portStr] = target.split(':');
    const port = parseInt(portStr, 10);
    return checkTCP(host, port);
  }
  
  return checkHTTP(target);
}

async function checkAndUpdateService(service: Service): Promise<void> {
  const result = await checkServiceHealth(service);
  const updated = updateServiceHealth(service.id, result);
  
  if (updated && broadcaster) {
    broadcaster({ type: 'health_update', payload: updated });
  }
}

export function startHealthChecker(): void {
  const services = getAllServices();
  
  services.forEach(service => {
    scheduleCheck(service);
  });
}

export function scheduleCheck(service: Service): void {
  if (intervals.has(service.id)) {
    clearInterval(intervals.get(service.id)!);
  }
  
  checkAndUpdateService(service);
  
  const interval = setInterval(() => {
    checkAndUpdateService(service);
  }, service.interval);
  
  intervals.set(service.id, interval);
}

export function stopHealthChecker(serviceId: string): void {
  if (intervals.has(serviceId)) {
    clearInterval(intervals.get(serviceId)!);
    intervals.delete(serviceId);
  }
}

export function stopAllHealthCheckers(): void {
  intervals.forEach(interval => clearInterval(interval));
  intervals.clear();
}
