import axios from "axios";
import { useEffect, useState } from "react";

const SERVER_URL = process.env.REACT_APP_TOKEN_SERVER_ADDRESS;

const useFetchChannelToken = (uid, channelName) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const url = `${SERVER_URL}/agora/token?uid=${uid}&cname=${channelName}`;
        console.log(`fetch channel token url = ${url}`);
        // const response = await fetch(url);
        const response = await axios.get(url);
        console.log(response);
        // const data = await response.json();
        const data = response.data;
        setToken(data.token);
        console.log(response);
        console.log(data);

        setIsLoading(false);
        setIsSuccess(true);
        setIsError(false);
      } catch (err) {
        console.log(err);
        setError(err);
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchToken();
  }, [uid, channelName]);

  return { isLoading, isError, isSuccess, token, error };
};

export default useFetchChannelToken;
