import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

export const useNotificationSocket = (onNotificationNew) => {
    const socketRef = useRef(null);
    const { user, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (!isAuthenticated || !user?.documentId) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:1338';
        
        // Remove trailing API path if it exists to just point to the host
        const baseURL = API_URL.replace('/api', '');

        socketRef.current = io(baseURL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socketRef.current.on('connect', () => {
            console.debug('[Notification Socket] connected');
            socketRef.current.emit('auth:join', user.documentId);
        });

        socketRef.current.on('notification:new', (payload) => {
            console.debug('[Notification Socket] Incoming notification:', payload);
            if (onNotificationNew) {
                onNotificationNew(payload);
            }
        });

        socketRef.current.on('connect_error', (err) => {
            console.debug('[Notification Socket] connection error:', err.message);
        });

        return () => {
            if (socketRef.current) {
                 socketRef.current.disconnect();
            }
        };
    }, [isAuthenticated, user?.documentId, onNotificationNew]);

    return socketRef.current;
};
