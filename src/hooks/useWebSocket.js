import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config'; // Importa la URL del socket

export const useWebSocket = (userId) => {
  const [playlists, setPlaylists] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.log('useWebSocket: No userId provided, skipping connection');
      setConnectionStatus('no-user');
      return;
    }

    console.log('useWebSocket: Connecting to Socket.IO with userId:', userId);
    setConnectionStatus('connecting');

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5,
      forceNew: false,
      withCredentials: true // Añadido para soportar credenciales
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connected successfully:', newSocket.id);
      setIsConnected(true);
      setConnectionStatus('connected');

      newSocket.emit('joinUserRoom', userId);

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');

      if (reason !== 'io client disconnect') {
        console.log('Attempting to reconnect in 3 seconds...');
        setConnectionStatus('reconnecting');
        reconnectTimeoutRef.current = setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            socketRef.current.connect();
          }
        }, 3000);
      }
    });

    newSocket.on('playlistsInit', (playlists) => {
      console.log('Initial playlists loaded:', playlists);
      setPlaylists(playlists);
    });

    newSocket.on('playlistCreated', (playlist) => {
      console.log('Playlist created:', playlist);
      setPlaylists((prev) => [...prev, playlist]);
    });

    newSocket.on('playlistsUpdated', (playlists) => {
      console.log('All playlists updated:', playlists);
      setPlaylists(playlists);
    });

    newSocket.on('playlistUpdated', ({ playlistId, songId, action, playlist }) => {
      console.log('Playlist updated:', { playlistId, songId, action });
      setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? playlist : p)));
    });

    newSocket.on('playlistDeleted', (playlistId) => {
      console.log('Playlist deleted:', playlistId);
      setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId));
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      setIsConnected(false);
      setConnectionStatus('error');
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket.IO error:', error);
    });

    newSocket.on('reconnect', () => setConnectionStatus('connected'));
    newSocket.on('reconnect_attempt', () => setConnectionStatus('reconnecting'));
    newSocket.on('reconnect_error', () => setConnectionStatus('error'));
    newSocket.on('reconnect_failed', () => setConnectionStatus('failed'));

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up Socket.IO connection');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, [userId]);

  const createPlaylist = (playlist) => {
    if (!userId) {
      alert('Error: Usuario no identificado. Por favor, inicia sesión nuevamente.');
      return;
    }
    if (!socket || !isConnected) {
      alert(`Error: No hay conexión con el servidor (${connectionStatus})`);
      if (socket && !socket.connected) socket.connect();
      return;
    }
    socket.emit('createPlaylist', { userId, playlist });
  };

  const updatePlaylist = (playlistId, songId, action) => {
    if (!userId || !socket || !isConnected) return;
    socket.emit('updatePlaylist', { userId, playlistId, songId, action });
  };

  const deletePlaylist = (playlistId) => {
    if (!userId || !socket || !isConnected) return;
    socket.emit('deletePlaylist', { userId, playlistId });
  };

  return {
    playlists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    isConnected,
    connectionStatus,
    socket: !!socket
  };
};
