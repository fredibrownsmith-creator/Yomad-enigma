require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const routes = require('./routes');
const initSocket = require('./sockets/initSocket');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
initSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🧘 YogaNomad server running on port ${PORT}`));
