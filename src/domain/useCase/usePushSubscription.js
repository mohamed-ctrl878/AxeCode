import { useCallback } from 'react';
import { notificationRepository } from '@infrastructure/repository/NotificationRepository';
import { PushSubscriptionRequest } from '@infrastructure/DTO/Request/NotificationRequest';

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const usePushSubscription = () => {
    const subscribeToWebPush = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push messaging is not supported.');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Notification permission denied.');
                return false;
            }

            const registration = await navigator.serviceWorker.ready;
            
            const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
            
            if (!vapidPublicKey) {
                console.error('VAPID Public Key not found in environment. Add VITE_VAPID_PUBLIC_KEY to .env');
                return false;
            }

            const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
            
            let subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                });
            }

            const subData = JSON.parse(JSON.stringify(subscription));
            
            const req = new PushSubscriptionRequest({
                endpoint: subData.endpoint,
                p256dh: subData.keys.p256dh,
                auth: subData.keys.auth,
                browserType: navigator.userAgent
            });

            await notificationRepository.subscribeToPush(req);
            console.log('Successfully subscribed to Web Push');
            return true;

        } catch (error) {
            console.error('Error during push subscription:', error);
            return false;
        }
    }, []);

    return { subscribeToWebPush };
};
