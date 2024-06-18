import { useEffect, useState } from "react";

const SERVER_URL = process.env.REACT_APP_TOKEN_SERVER_ADDRESS;

const useFetchChatToken = (uid) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Fetch API를 사용하여 POST 요청을 보냅니다.
        const response = await fetch(`${SERVER_URL}/chat-token?uid=${uid}`);

        const data = await response.json();

        setToken(data.token);

        setIsLoading(false);
        setIsSuccess(true);
        setIsError(false);
      } catch (error) {
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchToken();
  }, []);

  return { isLoading, isError, isSuccess, token };
};

export default useFetchChatToken;
