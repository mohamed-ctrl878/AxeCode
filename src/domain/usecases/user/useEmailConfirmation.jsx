import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useEmailConfirmation(core, token) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const nav = useNavigate();
  const isMounted = useRef(true);

  async function registerConfirmProcess() {
    setLoading(true);
    try {
      const data = await core.getContent(token);
      if (isMounted.current) {
        nav("/login");
        setData(data);
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    registerConfirmProcess();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { loading, error, data };
}
