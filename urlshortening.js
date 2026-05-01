 const http = require('http');
const fs = require('fs');
const os = require('os');

const PORT = 3000;
const FILE = 'visitors.log';

const server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/updateUser') {
        const entry = `Visitor at: ${new Date().toISOString()}\n`;

        fs.appendFile(FILE, entry, (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error writing file');
            }
            res.end('User added');
        });
    }

    else if (req.method === 'GET' && req.url === '/viewLog') {
        fs.readFile(FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error reading file');
            }
            res.end(data);
        });
    }

    else if (req.method === 'POST' && req.url === '/backup') {
        fs.copyFile(FILE, 'backup.log', (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error creating backup');
            }
            res.end('Backup created');
        });
    }
    else if (req.method === 'GET' && req.url === '/clearLog') {
        fs.writeFile(FILE, '', (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error clearing log');
            }
            res.end('Log cleared');
        });
    }

    else if (req.method === 'GET' && req.url === '/serverInfo') {
        const info = {
            platform: os.platform(),
            architecture: os.arch(),
            cpuCores: os.cpus().length,
            uptime: os.uptime()
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(info));
    }

    else {
        res.writeHead(404);
        res.end('Route not found');
    }
});

server.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});