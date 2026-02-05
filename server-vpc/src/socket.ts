import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

/**
 * Khởi tạo Socket.IO server, gắn vào HTTP server hiện tại.
 * Dùng namespace `/tickets` và room theo ticketId: `ticket:{id}`.
 */
export const initSocket = (server: HTTPServer) => {
  if (io) {
    return io;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: (origin, callback) => {
        // Cho phép cùng origin với API và các portal (đã kiểm soát bằng CORS HTTP)
        callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  });

  const ticketsNamespace = io.of('/tickets');

  ticketsNamespace.on('connection', (socket) => {
    // Client gửi join với ticketId để vào đúng room
    socket.on('join', (payload: { ticketId?: string } | string) => {
      let ticketId: string | undefined;
      if (typeof payload === 'string') {
        ticketId = payload;
      } else if (payload && typeof payload === 'object') {
        ticketId = payload.ticketId;
      }

      if (ticketId) {
        socket.join(`ticket:${ticketId}`);
      }
    });

    socket.on('leave', (payload: { ticketId?: string } | string) => {
      let ticketId: string | undefined;
      if (typeof payload === 'string') {
        ticketId = payload;
      } else if (payload && typeof payload === 'object') {
        ticketId = payload.ticketId;
      }

      if (ticketId) {
        socket.leave(`ticket:${ticketId}`);
      }
    });
  });

  return io;
};

/**
 * Lấy instance Socket.IO hiện tại.
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet');
  }
  return io;
};

