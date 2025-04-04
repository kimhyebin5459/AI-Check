const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Props {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: object[] | object;
  headers?: Record<string, string>;
}

type FetchProps = Omit<Props, 'method'>;

const request = async (requestProps: Props) => {
  try {
    const response = await fetchRequest(requestProps);

    if (!response.ok) {
      await handleError(response);
    }

    console.log('[Success]: ', response);
    return response;
  } catch (error) {
    console.error('[Error]: ', error);
    throw error;
  }
};

const fetchRequest = async ({ url, method, body, headers = {} }: Props) => {
  return await fetch(`${BASE_URL}/${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      ...headers,
    },
  });
};

const handleError = async (response: Response) => {
  throw new Error(`${response}`);
};

const fetcher = {
  get({ url, headers }: FetchProps) {
    return request({ url, method: 'GET', headers });
  },

  post({ url, body, headers, ...rest }: FetchProps) {
    return request({ url, method: 'POST', body, headers: { ...headers, 'Content-Type': 'application/json' }, ...rest });
  },

  patch({ url, body, headers }: FetchProps) {
    return request({ url, method: 'PATCH', body, headers: { ...headers, 'Content-Type': 'application/json' } });
  },

  put({ url, body, headers }: FetchProps) {
    return request({ url, method: 'PUT', body, headers: { ...headers, 'Content-Type': 'application/json' } });
  },

  delete({ url, headers }: FetchProps) {
    return request({ url, method: 'DELETE', headers });
  },
};

export default fetcher;
