import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { 
  getAllServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} from './storage.js';
import { startHealthChecker, stopHealthChecker, scheduleCheck, setBroadcaster, stopAllHealthCheckers } from './healthChecker.js';
import { ServiceInput, ServiceUpdate } from './types.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected. Total clients:', clients.size);
  
  const services = getAllServices();
  ws.send(JSON.stringify({ type: 'initial', payload: services }));
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });
});

function broadcast(message: object): void {
  const data = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

setBroadcaster(broadcast);

app.get('/api/services', (req, res) => {
  const services = getAllServices();
  res.json({ services });
});

app.get('/api/services/:id', (req, res) => {
  const service = getServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json({ service });
});

app.post('/api/services', (req, res) => {
  const { name, url, interval } = req.body as ServiceInput;
  
  if (!name || !url) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }
  
  try {
    const service = createService({ name, url, interval });
    scheduleCheck(service);
    broadcast({ type: 'service_added', payload: service });
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/services/:id', (req, res) => {
  const { name, url, interval } = req.body as ServiceUpdate;
  const updates: ServiceUpdate = {};
  
  if (name !== undefined) updates.name = name;
  if (url !== undefined) updates.url = url;
  if (interval !== undefined) updates.interval = interval;
  
  const service = updateService(req.params.id, updates);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  scheduleCheck(service);
  broadcast({ type: 'service_updated', payload: service });
  res.json({ success: true, service });
});

app.delete('/api/services/:id', (req, res) => {
  const success = deleteService(req.params.id);
  
  if (!success) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  stopHealthChecker(req.params.id);
  broadcast({ type: 'service_deleted', payload: req.params.id });
  res.json({ success: true });
});

app.get('/api/services/:id/history', (req, res) => {
  const service = getServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json({ history: service.history });
});

process.on('SIGINT', () => {
  stopAllHealthCheckers();
  process.exit();
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
  startHealthChecker();
});
