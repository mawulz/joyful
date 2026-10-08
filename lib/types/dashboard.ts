export type DonationStatus = "PENDING" | "SETTLEMENT" | "EXPIRED" | "FAILED";

export type VolunteerStatus = "PENDING" | "APPROVED" | "REJECTED";

export type VolunteerDecision = Exclude<VolunteerStatus, "PENDING">;

export type Donation = {
  id: string;
  orderId: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  status: DonationStatus;
  paymentType: string | null;
};

export type VolunteerApplication = {
  id: string;
  userName: string;
  skillArea: string;
  reason: string;
  resumeUrl: string | URL | undefined;
  status: VolunteerStatus;
};

export type DashboardData = {
  donations: Donation[];
  applications: VolunteerApplication[];
};
