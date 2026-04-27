// Settings/Profile feature types

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    profilePicture: string | null;
    hasProfilePicture?: boolean;
}
