export interface Course {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  bookingUrl: string;
  instructor: string;
  days: string;
  time: string;
}

export interface TeamMember {
  name: string;
  jobTitle: string;
  imageUrl: string;
}

export interface TeamData {
  team: TeamMember[];
  volunteers: TeamMember[];
}

export interface RegistrationData {
  courseTitle: string;
  name: string;
  phone: string;
  email: string;
  discountCode?: string;
}

export interface Accreditation {
  altText: string;
  imageUrl: string;
}
