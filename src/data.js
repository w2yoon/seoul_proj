import axios from 'axios';

export const fetchData = async (name, gu_name) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/${name}/${gu_name}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}