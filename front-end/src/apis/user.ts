import { ChildProfile, SignInPostForm, SignUpPostForm, User } from '@/types/user';
import fetcher from '@/apis/fetcher';
import { authBridge } from './authBridge';

export const postSignIn = async ({ email, password }: SignInPostForm) => {
  const fcmToken = authBridge.getFcmToken();

  const response = await fetcher.post({
    url: 'aicheck/auth/signin',
    body: { email, password, fcmToken },
  });

  return response;
};

export const postParentSignUp = async ({ email, password }: SignUpPostForm) => {
  return await fetcher.post({ url: 'aicheck/auth/signup', body: { email, password } });
};

export const postChildSignUp = async ({ email, password }: SignUpPostForm) => {
  return await fetcher.post({ url: 'aicheck/auth/signup/child', body: { email, password } });
};

export const postEmailVerification = async (email: string) => {
  return await fetcher.post({ url: 'aicheck/auth/email', body: { email } });
};

export const postEmailConfirm = async (email: string, code: string) => {
  return await fetcher.post({ url: 'aicheck/auth/email/check', body: { email, code } });
};

export const postReissueAccessToken = async (refreshToken: string) => {
  return await fetcher.post({
    url: 'aicheck/auth/reissue',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};

export const getChildProfileList = async (): Promise<ChildProfile[]> => {
  return await fetcher.get({ url: 'aicheck/members/children/profiles' });
};

export const patchUserInfo = async (image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  return await fetcher.patch({ url: 'aicheck/members/details', body: formData, headers: {} });
};

export const getUserInfo = async (): Promise<User> => {
  return await fetcher.get({ url: 'aicheck/members/details' });
};
