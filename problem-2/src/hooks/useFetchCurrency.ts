import { useEffect, useState } from "react";

export const useFetchCurrency = (url: string) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDataCurrency = async (url: string) => {
    setIsLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        console.log(data);
        setData(data);
      })
      .catch((error) => setError(error));
  };

  useEffect(() => {
    getDataCurrency(url);
  }, [url]);

  return { data, isLoading, error };
};
