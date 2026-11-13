-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "currencySym" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "govFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "days" INTEGER NOT NULL,
    "remote" BOOLEAN NOT NULL DEFAULT true,
    "taxNote" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "yearly" BOOLEAN NOT NULL DEFAULT false,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "term" TEXT,
    "renewPrice" DOUBLE PRECISION,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "days" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyConfiguration" (
    "id" TEXT NOT NULL,
    "countryId" TEXT,
    "selectedServices" JSONB NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "secondYearPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountApplied" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "activityNote" TEXT,
    "timeline" TEXT,
    "status" TEXT NOT NULL DEFAULT 'yeni',
    "pdfPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'iletisim',
    "status" TEXT NOT NULL DEFAULT 'yeni',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrademarkApplication" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Türkiye',
    "niceClasses" TEXT,
    "applicationType" TEXT NOT NULL DEFAULT 'ulusal',
    "status" TEXT NOT NULL DEFAULT 'basvuru-alindi',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrademarkApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "contentHtml" TEXT NOT NULL,
    "category" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'kurumsal',
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "taxNo" TEXT,
    "city" TEXT,
    "notes" TEXT,
    "portalToken" TEXT,
    "portalEnabled" BOOLEAN NOT NULL DEFAULT true,
    "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'manuel',
    "leadId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "kvkkConsentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchedMark" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNorm" TEXT NOT NULL DEFAULT '',
    "classes" INTEGER[],
    "viennaCodes" TEXT[],
    "goods" TEXT,
    "applicationNo" TEXT,
    "registrationNo" TEXT,
    "applicationDate" TIMESTAMP(3),
    "registrationDate" TIMESTAMP(3),
    "markStatus" TEXT NOT NULL DEFAULT 'tescilli',
    "logoUrl" TEXT,
    "watchType" TEXT NOT NULL DEFAULT 'kelime',
    "threshold" INTEGER,
    "watchRelated" BOOLEAN NOT NULL DEFAULT true,
    "excludeTerms" TEXT[],
    "ownerAliases" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "pendingApproval" BOOLEAN NOT NULL DEFAULT false,
    "watchStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchEnd" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchedMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bulletin" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'marka',
    "number" TEXT NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL,
    "oppositionDeadline" TIMESTAMP(3) NOT NULL,
    "sourceUrl" TEXT,
    "fileName" TEXT,
    "filePath" TEXT,
    "fileHash" TEXT,
    "fileSize" INTEGER,
    "pageCount" INTEGER,
    "pagesDone" INTEGER NOT NULL DEFAULT 0,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "parseWarnings" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'bekliyor',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "scannedAt" TIMESTAMP(3),
    "matchCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bulletin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletinMark" (
    "id" TEXT NOT NULL,
    "bulletinId" TEXT NOT NULL,
    "applicationNo" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3),
    "markText" TEXT NOT NULL DEFAULT '',
    "markNorm" TEXT NOT NULL DEFAULT '',
    "markPhon" TEXT NOT NULL DEFAULT '',
    "markType" TEXT,
    "classes" INTEGER[],
    "goods" TEXT,
    "viennaCodes" TEXT[],
    "colors" TEXT,
    "priority" TEXT,
    "owner" TEXT,
    "ownerAddress" TEXT,
    "attorney" TEXT,
    "pageNo" INTEGER,
    "rawText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BulletinMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchMatch" (
    "id" TEXT NOT NULL,
    "watchedMarkId" TEXT NOT NULL,
    "bulletinMarkId" TEXT NOT NULL,
    "bulletinId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "nameScore" INTEGER NOT NULL,
    "classScore" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "reasons" JSONB NOT NULL,
    "sharedClasses" INTEGER[],
    "status" TEXT NOT NULL DEFAULT 'yeni',
    "clientDecision" TEXT,
    "clientDecisionAt" TIMESTAMP(3),
    "clientNote" TEXT,
    "assignee" TEXT,
    "note" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "notifiedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opposition" (
    "id" TEXT NOT NULL,
    "matchId" TEXT,
    "clientId" TEXT NOT NULL,
    "targetAppNo" TEXT NOT NULL,
    "targetMark" TEXT NOT NULL,
    "targetOwner" TEXT,
    "bulletinNo" TEXT,
    "basisMarks" TEXT,
    "grounds" TEXT[],
    "deadline" TIMESTAMP(3) NOT NULL,
    "filedAt" TIMESTAMP(3),
    "officeRefNo" TEXT,
    "officialFee" DOUBLE PRECISION,
    "serviceFee" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'hazirlaniyor',
    "decisionDate" TIMESTAMP(3),
    "outcomeNote" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deadline" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'acik',
    "clientId" TEXT,
    "watchedMarkId" TEXT,
    "oppositionId" TEXT,
    "matchId" TEXT,
    "remindDays" INTEGER[] DEFAULT ARRAY[30, 14, 7, 3, 1]::INTEGER[],
    "lastRemindedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "recipient" TEXT,
    "subject" TEXT,
    "body" TEXT,
    "status" TEXT NOT NULL DEFAULT 'bekliyor',
    "error" TEXT,
    "clientId" TEXT,
    "matchId" TEXT,
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'bekliyor',
    "bulletinId" TEXT,
    "payload" JSONB,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lockedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Country_slug_key" ON "Country"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_page_key" ON "PageContent"("page");

-- CreateIndex
CREATE UNIQUE INDEX "Client_portalToken_key" ON "Client"("portalToken");

-- CreateIndex
CREATE INDEX "Client_active_idx" ON "Client"("active");

-- CreateIndex
CREATE INDEX "WatchedMark_clientId_idx" ON "WatchedMark"("clientId");

-- CreateIndex
CREATE INDEX "WatchedMark_active_idx" ON "WatchedMark"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Bulletin_number_key" ON "Bulletin"("number");

-- CreateIndex
CREATE INDEX "Bulletin_publishDate_idx" ON "Bulletin"("publishDate");

-- CreateIndex
CREATE INDEX "BulletinMark_applicationNo_idx" ON "BulletinMark"("applicationNo");

-- CreateIndex
CREATE INDEX "BulletinMark_markNorm_trgm_idx" ON "BulletinMark" USING GIN ("markNorm" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "BulletinMark_markPhon_trgm_idx" ON "BulletinMark" USING GIN ("markPhon" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "BulletinMark_bulletinId_applicationNo_key" ON "BulletinMark"("bulletinId", "applicationNo");

-- CreateIndex
CREATE INDEX "WatchMatch_status_idx" ON "WatchMatch"("status");

-- CreateIndex
CREATE INDEX "WatchMatch_bulletinId_idx" ON "WatchMatch"("bulletinId");

-- CreateIndex
CREATE INDEX "WatchMatch_deadline_idx" ON "WatchMatch"("deadline");

-- CreateIndex
CREATE UNIQUE INDEX "WatchMatch_watchedMarkId_bulletinMarkId_key" ON "WatchMatch"("watchedMarkId", "bulletinMarkId");

-- CreateIndex
CREATE UNIQUE INDEX "Opposition_matchId_key" ON "Opposition"("matchId");

-- CreateIndex
CREATE INDEX "Opposition_status_idx" ON "Opposition"("status");

-- CreateIndex
CREATE INDEX "Deadline_dueDate_status_idx" ON "Deadline"("dueDate", "status");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Activity_entity_entityId_idx" ON "Activity"("entity", "entityId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE INDEX "Job_status_createdAt_idx" ON "Job"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyConfiguration" ADD CONSTRAINT "CompanyConfiguration_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMark" ADD CONSTRAINT "WatchedMark_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletinMark" ADD CONSTRAINT "BulletinMark_bulletinId_fkey" FOREIGN KEY ("bulletinId") REFERENCES "Bulletin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchMatch" ADD CONSTRAINT "WatchMatch_watchedMarkId_fkey" FOREIGN KEY ("watchedMarkId") REFERENCES "WatchedMark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchMatch" ADD CONSTRAINT "WatchMatch_bulletinMarkId_fkey" FOREIGN KEY ("bulletinMarkId") REFERENCES "BulletinMark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchMatch" ADD CONSTRAINT "WatchMatch_bulletinId_fkey" FOREIGN KEY ("bulletinId") REFERENCES "Bulletin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opposition" ADD CONSTRAINT "Opposition_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "WatchMatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opposition" ADD CONSTRAINT "Opposition_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_watchedMarkId_fkey" FOREIGN KEY ("watchedMarkId") REFERENCES "WatchedMark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_oppositionId_fkey" FOREIGN KEY ("oppositionId") REFERENCES "Opposition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
