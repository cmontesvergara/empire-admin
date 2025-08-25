export interface Card {
  id?: number;
  title: string;
  image: string;
  price?: number;
  description?: string;
  category?: string;
  primary_button_text?: string;
  secondary_button_text?: string;
  instant_price?: number;
  ending_in?: string;
}
