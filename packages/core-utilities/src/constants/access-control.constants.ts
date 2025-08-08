/**
 * Access control constants for partner management system
 */

export const PARTNER_CODES = {
  ALL: 'ALL',
  COMPANY: 'COMPANY',
} as const;

export const USER_PERMISSIONS = {
  EDIT_PARTNER: 'edit_partner',
  VIEW_ALL_PARTNERS: 'view_all_partners',
  MANAGE_FREELANCERS: 'manage_freelancers',
} as const;

export type PartnerCode = typeof PARTNER_CODES[keyof typeof PARTNER_CODES];
export type Permission = typeof USER_PERMISSIONS[keyof typeof USER_PERMISSIONS];
