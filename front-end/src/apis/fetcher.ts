const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Props {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: object[] | object;
  headers?: Record<string, string>;
}

interface APIErrorResponse {
  code?: string;
  message?: string;
  serverDateTime?: string;
}

type FetchProps = Omit<Props, 'method'>;

const request = async (requestProps: Props) => {
  try {
    const response = await fetchRequest(requestProps);
    const data = await response.json();

    if (!response.ok) {
      await handleError(response, data);
    }

    console.log(
      `%c🟢[Response] ${response.status}`,
      'color: #007A33; font-weight: bold; background: #EAFBEA; padding: 1px 4px; border-radius: 4px;',
      data
    );

    return data;
  } catch (error) {
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

const handleError = async (response: Response, errorData: APIErrorResponse) => {
  console.log(
    `%c🔴[Error] ${response.status}`,
    'color: red; font-weight: bold; background: #ffebeb; padding: 1px 4px; border-radius: 4px;',
    errorData
  );

  throw new Error(`API Error ${response}`);
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
