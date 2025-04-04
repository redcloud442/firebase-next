export type User = {
  id: string;
  email: string;
  name: string;
  rtime: string;
  [key: string]: string;
};

export type AdminUser = {
  uid: string;
  email: string;
  disabled: boolean;
  admin: boolean;
  isVerified: boolean;
  dateCreated: string;
};

export type AccountHistory = {
  id: string;
  date: string;
  type: string;
  actionBy: string;
  actionReceivedBy: string;
};
