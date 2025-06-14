import axios from "axios";
const INT_BASE_URL = "https://productsapi2024.vercel.app/api/products";
const EXT_BASE_URL = "https://real-time-product-search.p.rapidapi.com";

export const fetchDataFromInternalAPI = async (category="") => {
  try {
    const response = await axios.get(INT_BASE_URL, {
      params: category ? { category } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }
};

//fetch data from external API
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "3be0e33758msh9fd930a8a64b125p182549jsn35e012d0dc61",
    "x-rapidapi-host": "real-time-product-search.p.rapidapi.com",
  },
};

export const fetchDataFromExternalAPI = async (url) => {
  const { data } = await axios.get(`${EXT_BASE_URL}/${url}`, options);
  return data;
};