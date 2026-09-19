let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Client registers their user ID room upon authentication
    socket.on('join_user_room', (userId) => {
      if (userId) {
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`[Socket] Socket ${socket.id} joined room: ${roomName}`);
      }
    });

    socket.on('leave_user_room', (userId) => {
      if (userId) {
        const roomName = `user_${userId}`;
        socket.leave(roomName);
        console.log(`[Socket] Socket ${socket.id} left room: ${roomName}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};

export const broadcastToUser = (userId, event, payload) => {
  if (ioInstance && userId) {
    const roomName = `user_${userId}`;
    ioInstance.to(roomName).emit(event, payload);
    console.log(`[Socket Broadcast] Emitted '${event}' to room '${roomName}'`);
  }
};
