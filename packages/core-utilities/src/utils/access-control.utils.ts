import type { IUserProfile } from '../models/user-profile.model';
import { PARTNER_CODES } from '../constants/access-control.constants';

/**
 * Check if user has permission to edit partners
 */
export function canEditPartner(profile: IUserProfile | null): boolean {
  return profile?.partner_code === PARTNER_CODES.ALL;
}

/**
 * Check if user has permission to view all partners
 */
export function canViewAllPartners(profile: IUserProfile | null): boolean {
  return profile?.partner_code === PARTNER_CODES.ALL;
}

/**
 * Check if user has permission to manage freelancers
 */
export function canManageFreelancers(profile: IUserProfile | null): boolean {
  return profile?.partner_code === PARTNER_CODES.ALL;
}

/**
 * Get accessible partner codes for a user
 */
export function getAccessiblePartnerCodes(profile: IUserProfile | null): string[] {
  if (!profile) {
    return [];
  }

  if (profile.partner_code === PARTNER_CODES.ALL) {
    return []; // Empty array means access to all
  }

  return profile.partner_code ? [profile.partner_code] : [];
}

/**
 * Check if a user has access to a specific partner
 */
export function hasPartnerAccess(profile: IUserProfile | null, targetPartnerCode: string): boolean {
  if (!profile) {
    return false;
  }

  if (profile.partner_code === PARTNER_CODES.ALL) {
    return true;
  }

  return profile.partner_code === targetPartnerCode;
}
