import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsEnum(['Never', '30 Days', '90 Days'])
  @IsOptional()
  expiresAt?: string;
}

export class RevokeApiKeyDto {
  @IsString()
  id: string;
}
