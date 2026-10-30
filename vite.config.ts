import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

function serverApiPlugin(): Plugin {
  return {
    name: 'server-api-plugin',
    configureServer(server) {
      // 1. IMAGE UPLOAD API
      server.middlewares.use('/api/upload', (req, res) => {
        // Set CORS headers just in case
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          });

          req.on('end', () => {
            try {
              const body = Buffer.concat(chunks).toString('utf-8');
              const { image, name } = JSON.parse(body);

              if (!image) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'No image data provided' }));
                return;
              }

              // Match base64 data: data:image/jpeg;base64,....
              const matches = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
              let ext = 'jpg';
              let base64Data = image;

              if (matches && matches.length === 3) {
                const mime = matches[1].toLowerCase();
                ext = mime === 'jpeg' ? 'jpg' : mime === 'svg+xml' ? 'svg' : mime;
                base64Data = matches[2];
              }

              const buffer = Buffer.from(base64Data, 'base64');
              
              // Ensure public/uploads directory exists
              const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              // Sanitize filename
              const rawName = (name || 'image')
                .replace(/\.[^/.]+$/, '') // remove extension
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_')
                .slice(0, 30);
              
              const filename = `${rawName}_${Date.now()}.${ext}`;
              const filePath = path.join(uploadsDir, filename);

              fs.writeFileSync(filePath, buffer);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                url: `/uploads/${filename}`,
                filename,
                path: filePath
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Upload failed' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      // 2. SHOWROOM SETTINGS & EMAIL CONFIG API (Shared across LAN)
      server.middlewares.use('/api/settings', (req, res) => {
        const settingsPath = path.resolve(process.cwd(), 'public/site-settings.json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'GET') {
          if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Settings not initialized yet' }));
          }
          return;
        }

        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          });
          req.on('end', () => {
            try {
              const body = Buffer.concat(chunks).toString('utf-8');
              fs.writeFileSync(settingsPath, body, 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
      });

      // 3. CENTRALIZED LEADS API (Sync leads from all phones & browsers to PC disk)
      server.middlewares.use('/api/leads', (req, res) => {
        const leadsPath = path.resolve(process.cwd(), 'public/leads.json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'GET') {
          if (fs.existsSync(leadsPath)) {
            const data = fs.readFileSync(leadsPath, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end('[]');
          }
          return;
        }

        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          });
          req.on('end', () => {
            try {
              const body = Buffer.concat(chunks).toString('utf-8');
              const newLead = JSON.parse(body);
              let existingLeads: any[] = [];
              if (fs.existsSync(leadsPath)) {
                try {
                  existingLeads = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));
                } catch {
                  existingLeads = [];
                }
              }
              // Prevent duplicates by id
              existingLeads = existingLeads.filter(l => l.id !== newLead.id);
              existingLeads.unshift(newLead);
              fs.writeFileSync(leadsPath, JSON.stringify(existingLeads, null, 2), 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serverApiPlugin()],
  server: {
    host: true, // Mở cho mạng LAN (0.0.0.0)
    port: 5173,
  },
})
