export type UserType = 'PARENT' | 'CHILD';

export interface SignInPostForm {
  email: string;
  password: string;
}

export interface SignUpPostForm {
  isParent: boolean;
  email: string;
  password: string;
}

export interface User {
  memberId: number;
  name: string;
  birth: string;
  image: string;
  type: UserType;
  account: MyAccountInfo;
}

export interface ChildProfile {
  childId: number;
  image: string;
  name: string;
}

export interface MyAccountInfo {
  id: number;
  name: string;
  no: string;
}
