// useFetchData.js
import { useState, useEffect } from 'react';
import { fetchData } from './data.js';

export const useFetchData = (name, gu_name) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const response = await fetchData(name, gu_name);
      setData(response);
    };

    getData();
  }, [name, gu_name]);

  return data;
};
