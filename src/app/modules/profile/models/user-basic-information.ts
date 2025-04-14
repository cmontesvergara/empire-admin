export interface UserBasicInformation {
  first_name: string;
  second_name?: string;
  last_name: string;
  second_last_name?: string;
  occupation?: string;
  nationality?: string;
  place_of_residence?: string;
  place_of_birth?: string;
  marital_status?: string;
  gender?: string;
  birth_date?: string;
  phone: string;
  email: string;
  nit: string;
  user_status: 'verified' | 'unverified';
  addresses: Address[];
}
export interface Address {
  street: string;
  country: string;
  state: string;
  city: string;

}
