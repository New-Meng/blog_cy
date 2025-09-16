export type CreateUserDto = {
  username: string;
  email: string;
  password: string;
  againPassword: string;
};

export type LoginDefaultDto = {
  userNameOrMobile: string;
  password: string;
};
