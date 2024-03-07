export interface OptionalDto {
  domain?: string;
  articleSize?: string;
  tone?: string;
  hideCredentials?: boolean;
}

export interface OpenAiGenerateDto {
  title: string;
  instruction?: string;
  codeSnippet: string;
  optional?: OptionalDto;
}
