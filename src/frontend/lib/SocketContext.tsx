import * as React from 'react';
import type SocketIOClient from 'socket.io-client';

export interface ISocketContext {
  socket?: SocketIOClient.Socket;
}

export default React.createContext<ISocketContext>({});
