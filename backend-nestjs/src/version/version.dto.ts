export enum versionStatus {
  draft,
  pending,
  reviewed,
  approved,
}

export interface VersionPayloadDto {
  author_id?: number;
  reviewer_user_id: bigint;
  htmlFormat?: string;
  blog_id: bigint;
  status: versionStatus;
  title: string;
  description: string;
  tags?: string[];
  saveAsDraft?: boolean;
}
