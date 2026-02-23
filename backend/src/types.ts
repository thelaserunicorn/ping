export type ServiceStatus = 'healthy' | 'down' | 'slow';

export interface HealthCheckResult {
  status: ServiceStatus;
  latency: number;
  timestamp: string;
  error?: string;
}

export interface Service {
  id: string;
  name: string;
  url: string;
  interval: number;
  createdAt: string;
  lastCheck?: HealthCheckResult;
  history: HealthCheckResult[];
}

export interface ServiceInput {
  name: string;
  url: string;
  interval?: number;
}

export interface ServiceUpdate {
  name?: string;
  url?: string;
  interval?: number;
}

export interface WebSocketMessage {
  type: 'health_update' | 'service_added' | 'service_updated' | 'service_deleted';
  payload: Service | string;
}
