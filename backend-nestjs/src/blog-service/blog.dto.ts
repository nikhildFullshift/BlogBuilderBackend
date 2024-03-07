export interface BlogPayloadDto {
  title: string;
  description: string;
  tags?: string[];
  status: number;
  blogId?: number;
  saveAsDraft?: boolean;
}

export enum blogStatus {
  draft,
  pending, // blog submitted for review
  reviewed,
  published_kb, // blog published to knowledge base
  published_web,
  deleted,
}

export enum userRole {
  user,
  team_lead,
}

export const roleWithLead = [
  {
    userId: 121,
    leadId: 123,
  },
  {
    userId: 124,
    leadId: 123,
  },
  {
    userId: 125,
    leadId: 126,
  },
  {
    userId: 127,
    leadId: 126,
  },
];
