import { useEffect } from "react";

export default function useBackendPing() {
  useEffect(() => {
    const ping = () => {
const backendUrl = new URL(import.meta.env.VITE_API_URL).origin;

fetch(`${backendUrl}/health`).catch(() => {});    };

    ping();

    const interval = setInterval(ping, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}