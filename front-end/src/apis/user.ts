import { ChildProfile, SignInPostForm, SignUpPostForm, User } from '@/types/user';
import fetcher from '@/apis/fetcher';

export const postSignIn = async ({ email, password }: SignInPostForm) => {
  return await fetcher.post({ url: 'aicheck/auth/signin', body: { email, password } });
};

export const postSignUp = async ({ isParent, email, password }: SignUpPostForm) => {
  return await fetcher.post({ url: 'aicheck/auth/signup', body: { isParent, email, password } });
};

export const postEmailVerification = async (email: string) => {
  return await fetcher.post({ url: 'aicheck/auth/email', body: { email } });
};

export const postEmailConfirm = async (code: string) => {
  return await fetcher.post({ url: 'aicheck/auth/email/check', body: { code } });
};

export const postReissueAccessToken = async () => {
  return await fetcher.post({ url: 'aicheck/auth/reissue' });
};

export const getChildProfileList = async (): Promise<ChildProfile[]> => {
  const response = await fetcher.get({ url: 'aicheck/members/children/profiles' });
  const data = await response.json();
  return data;
};

export const getUserInfo = async (): Promise<User> => {
  const response = await fetcher.get({ url: 'aicheck/members/details' });
  const data = await response.json();
  return data;
};
