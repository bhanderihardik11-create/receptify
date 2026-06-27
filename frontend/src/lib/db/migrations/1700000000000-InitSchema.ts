import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "businesses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "businessType" character varying,
        "city" character varying,
        "preferredLanguage" character varying NOT NULL DEFAULT 'en',
        "isVerified" boolean NOT NULL DEFAULT false,
        "callCredits" integer NOT NULL DEFAULT 100,
        "planTier" character varying NOT NULL DEFAULT 'starter',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_businesses" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "ownerName" character varying NOT NULL,
        "phone" character varying,
        "role" character varying NOT NULL DEFAULT 'owner',
        "emailVerified" boolean NOT NULL DEFAULT false,
        "businessId" uuid,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_business" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "businessId" uuid NOT NULL,
        "fullName" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "email" character varying,
        "city" character varying,
        "language" character varying NOT NULL DEFAULT 'en',
        "customerType" character varying,
        "tags" text NOT NULL DEFAULT '',
        "dueDate" date,
        "appointmentDate" date,
        "notes" text,
        "consentStatus" character varying NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_customers_business" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE
      );
      CREATE INDEX "IDX_customers_biz_phone" ON "customers" ("businessId", "phone");
    `);

    await queryRunner.query(`
      CREATE TABLE "campaigns" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "businessId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "purpose" character varying NOT NULL DEFAULT 'custom',
        "status" character varying NOT NULL DEFAULT 'draft',
        "language" character varying NOT NULL DEFAULT 'en',
        "voiceType" character varying NOT NULL DEFAULT 'female_professional',
        "scheduledAt" TIMESTAMP WITH TIME ZONE,
        "callingWindowStart" character varying NOT NULL DEFAULT '09:00',
        "callingWindowEnd" character varying NOT NULL DEFAULT '19:00',
        "retryAttempts" integer NOT NULL DEFAULT 2,
        "delayBetweenCalls" integer NOT NULL DEFAULT 5,
        "scriptText" text,
        "complianceConfirmed" boolean NOT NULL DEFAULT false,
        "totalContacts" integer NOT NULL DEFAULT 0,
        "callsCompleted" integer NOT NULL DEFAULT 0,
        "callsAnswered" integer NOT NULL DEFAULT 0,
        "callsFailed" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaigns" PRIMARY KEY ("id"),
        CONSTRAINT "FK_campaigns_business" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "campaign_customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "campaignId" uuid NOT NULL,
        "customerId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_campaign_customers" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_campaign_customer" UNIQUE ("campaignId", "customerId"),
        CONSTRAINT "FK_cc_campaign" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_cc_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "scripts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "businessId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "purpose" character varying NOT NULL DEFAULT 'custom',
        "language" character varying NOT NULL DEFAULT 'en',
        "body" text NOT NULL,
        "shortVersion" text,
        "politeVersion" text,
        "tone" character varying NOT NULL DEFAULT 'professional',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_scripts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_scripts_business" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "templates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "industry" character varying NOT NULL,
        "purpose" character varying NOT NULL,
        "language" character varying NOT NULL DEFAULT 'en',
        "preview" text NOT NULL,
        "body" text NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_templates" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "calls" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "campaignId" uuid NOT NULL,
        "customerId" uuid NOT NULL,
        "status" character varying NOT NULL DEFAULT 'queued',
        "outcome" character varying NOT NULL DEFAULT 'pending',
        "durationSec" integer NOT NULL DEFAULT 0,
        "startedAt" TIMESTAMP WITH TIME ZONE,
        "endedAt" TIMESTAMP WITH TIME ZONE,
        "attemptNumber" integer NOT NULL DEFAULT 0,
        "notes" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_calls" PRIMARY KEY ("id"),
        CONSTRAINT "FK_calls_campaign" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_calls_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE
      );
      CREATE INDEX "IDX_calls_campaign" ON "calls" ("campaignId");
      CREATE INDEX "IDX_calls_customer" ON "calls" ("customerId");
    `);

    await queryRunner.query(`
      CREATE TABLE "call_transcripts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "callId" uuid NOT NULL,
        "text" text NOT NULL,
        "summary" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_call_transcripts" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_call_transcripts_call" UNIQUE ("callId"),
        CONSTRAINT "FK_transcripts_call" FOREIGN KEY ("callId") REFERENCES "calls"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "call_recordings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "callId" uuid NOT NULL,
        "audioUrl" text NOT NULL DEFAULT '/audio/sample-recording.mp3',
        "durationSec" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_call_recordings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_call_recordings_call" UNIQUE ("callId"),
        CONSTRAINT "FK_recordings_call" FOREIGN KEY ("callId") REFERENCES "calls"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "billing_plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "tier" character varying NOT NULL,
        "monthlyCalls" integer NOT NULL,
        "monthlyPrice" integer NOT NULL,
        "features" text NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_billing_plans" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "businessId" uuid NOT NULL,
        "planTier" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'active',
        "currentPeriodStart" TIMESTAMP WITH TIME ZONE NOT NULL,
        "currentPeriodEnd" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_subscriptions_business" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "usage_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "businessId" uuid NOT NULL,
        "action" character varying NOT NULL,
        "credits" integer NOT NULL DEFAULT 1,
        "metadata" jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_usage_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_usage_logs_business" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "usage_logs" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscriptions" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "billing_plans" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "call_recordings" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "call_transcripts" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "calls" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "templates" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "scripts" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "campaign_customers" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "campaigns" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "customers" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "businesses" CASCADE;`);
  }
}
