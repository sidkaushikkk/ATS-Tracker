import { useEffect } from "react";

export default function useBackendPing() {
  useEffect(() => {
    const ping = () => {
      fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => {});
    };

    ping();

    const interval = setInterval(ping, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}