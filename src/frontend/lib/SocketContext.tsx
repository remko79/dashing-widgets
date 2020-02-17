import * as React from 'react';

export interface ISocketContext {
  socket?: SocketIOClient.Socket;
}

export default React.createContext<ISocketContext>({});
