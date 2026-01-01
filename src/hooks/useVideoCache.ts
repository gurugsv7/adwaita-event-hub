import { useState, useEffect } from 'react';

const VIDEO_CACHE_NAME = 'adwaita-video-cache-v1';

export function useVideoCache(videoUrl: string) {
  const [cachedUrl, setCachedUrl] = useState<string>(videoUrl);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function cacheVideo() {
      try {
        // Check if Cache API is supported
        if (!('caches' in window)) {
          setIsLoading(false);
          return;
        }

        const cache = await caches.open(VIDEO_CACHE_NAME);
        const cachedResponse = await cache.match(videoUrl);

        if (cachedResponse) {
          // Video is cached, use the cached version
          const blob = await cachedResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          setCachedUrl(blobUrl);
          setIsLoading(false);
        } else {
          // Fetch and cache the video
          const response = await fetch(videoUrl);
          
          if (response.ok) {
            // Clone response before consuming it
            const responseClone = response.clone();
            
            // Cache the response
            await cache.put(videoUrl, responseClone);
            
            // Create blob URL from the original response
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setCachedUrl(blobUrl);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Video caching error:', error);
        setIsLoading(false);
      }
    }

    cacheVideo();

    // Cleanup blob URL on unmount
    return () => {
      if (cachedUrl !== videoUrl && cachedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(cachedUrl);
      }
    };
  }, [videoUrl]);

  return { cachedUrl, isLoading };
}
