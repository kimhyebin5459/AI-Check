import { BASE_URL } from '@/apis/config';
import { useUserStore } from '@/stores/useUserStore';
import { authBridge } from './authBridge';
import { postReissueAccessToken } from './user';

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
    let response = await fetchRequest(requestProps);
    let contentType = response.headers.get('content-type');
    let data = contentType?.includes('application/json') ? await response.json() : null;

    if (response.status === 401) {
      try {
        const refreshToken = authBridge.getRefreshToken();
        if (!refreshToken) {
          throw new Error('Refresh token is missing');
        }
        const refreshResult = await postReissueAccessToken(refreshToken);

        if (refreshResult?.accessToken) {
          useUserStore.getState().setAccessToken(refreshResult.accessToken);

          const currentRefreshToken = authBridge.getRefreshToken();
          if (currentRefreshToken) {
            authBridge.saveTokens(refreshResult.accessToken, currentRefreshToken);
          }

          response = await fetchRequest(requestProps);
          contentType = response.headers.get('content-type');
          data = contentType?.includes('application/json') ? await response.json() : null;
        }
      } catch (refreshError) {
        console.log(
          `%c🔴[Token Refresh Failed]`,
          'color: red; font-weight: bold; background: #ffebeb; padding: 1px 4px; border-radius: 4px;',
          refreshError
        );
      }
    }

    if (!response.ok) {
      await handleError(response, data ?? {});
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

// const fetchRequest = async ({ url, method, body, headers = {} }: Props) => {
//   return await fetch(`${BASE_URL}/${url}`, {
//     method,
//     body: body ? JSON.stringify(body) : undefined,
//     headers: {
//       ...headers,
//     },
//   });
// };

const fetchRequest = async ({ url, method, body, headers = {} }: Props) => {
  let accessToken = useUserStore.getState().accessToken;

  if (!accessToken || accessToken === 'VALUE') {
    const appToken = authBridge.getAccessToken();
    if (appToken) {
      useUserStore.getState().setAccessToken(appToken);
      accessToken = appToken;
    }
  }

  return await fetch(`${BASE_URL}/${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      ...headers,
      ...(accessToken && accessToken !== 'VALUE' ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
};

const handleError = async (response: Response, errorData: APIErrorResponse) => {
  console.log(
    `%c🔴[Error] ${response.status}`,
    'color: red; font-weight: bold; background: #ffebeb; padding: 1px 4px; border-radius: 4px;',
    errorData
  );

  throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
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
