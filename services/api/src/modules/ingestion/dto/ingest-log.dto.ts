import { IsString, IsNotEmpty, IsObject, IsOptional, IsEnum } from 'class-validator';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}

export class IngestLogDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(LogLevel)
  @IsOptional()
  level?: LogLevel = LogLevel.INFO;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  timestamp?: string;
}
