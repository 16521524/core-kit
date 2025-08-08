export interface IPartner {
  id: number;
  partner_code: string;
  partner_name: string;
  partner_type: string;
  partner_status: string;
  json_partner_info: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a user profile with personal and business information
 */
export interface IUserProfile {
  /** Username for login purposes */
  username: string;
  /** User's email address */
  email: string;
  /** User's first name */
  first_name: string;
  /** User's last name */
  last_name: string;
  /** User's contact phone number */
  phone_number: string;
  /**
   * User type identifier
   * 3 = Partner, 2 = Druce, 1 = TBD
   */
  user_type: number;
  /** User's job title */
  job: string;
  /** List user's areas of expertise */
  expertise: string[];
  /** URL to a user's profile image */
  profile_url: string;
  /** Optional partner code identifier */
  partner_code?: string;
  /** Optional partner organization name */
  partner_name?: string;
  /** List of partners associated with this user */
  partners: IPartner[];
  /** Url of invoice */
  invoice_url: string | null;
}
