export interface UserBasicInformation {
  name: string;
  last_name: string;
  phone: string;
  email: string;
  nit: string;
  user_status: 'verified' | 'unverified';
  addresses: any[];
}
