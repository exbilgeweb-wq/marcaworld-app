-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "calendarKey" TEXT,
ADD COLUMN     "izlemeRole" TEXT NOT NULL DEFAULT 'uzman',
ADD COLUMN     "notifyPrefs" JSONB;

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
    "address" TEXT,
    "notes" TEXT,
    "responsibleId" TEXT,
    "portalTokenHash" TEXT,
    "portalTokenCreatedAt" TIMESTAMP(3),
    "portalTokenExpiresAt" TIMESTAMP(3),
    "portalEnabled" BOOLEAN NOT NULL DEFAULT true,
    "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyCadence" TEXT NOT NULL DEFAULT 'bulten',
    "zeroMatchMail" BOOLEAN NOT NULL DEFAULT false,
    "poaStatus" TEXT NOT NULL DEFAULT 'yok',
    "poaExpiresAt" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT 'manuel',
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "kvkkNoticeVersion" TEXT,
    "kvkkNoticeShownAt" TIMESTAMP(3),
    "commercialMsgConsentAt" TIMESTAMP(3),
    "anonymizedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientContact" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "receivesMatches" BOOLEAN NOT NULL DEFAULT true,
    "receivesRenewals" BOOLEAN NOT NULL DEFAULT true,
    "receivesReports" BOOLEAN NOT NULL DEFAULT true,
    "canDecide" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchedMark" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNorm" TEXT NOT NULL DEFAULT '',
    "classes" INTEGER[],
    "goods" TEXT,
    "goodsByClass" JSONB,
    "viennaCodes" TEXT[],
    "applicationNo" TEXT,
    "applicationDate" TIMESTAMP(3),
    "priorityDate" TIMESTAMP(3),
    "registrationNo" TEXT,
    "registrationDate" TIMESTAMP(3),
    "markStatus" TEXT NOT NULL DEFAULT 'tescilli',
    "logoUrl" TEXT,
    "watchType" TEXT NOT NULL DEFAULT 'kelime',
    "reputation" TEXT NOT NULL DEFAULT 'yok',
    "reputationNote" TEXT,
    "threshold" INTEGER,
    "watchRelated" BOOLEAN NOT NULL DEFAULT true,
    "excludeTerms" TEXT[],
    "ownerAliases" TEXT[],
    "useEvidenceStatus" TEXT NOT NULL DEFAULT 'yok',
    "useEvidenceNote" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "pendingApproval" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" TEXT,
    "watchStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchEnd" TIMESTAMP(3),
    "notes" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchedMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bulletin" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'marka',
    "number" TEXT NOT NULL,
    "year" INTEGER,
    "seq" INTEGER,
    "publishDate" TIMESTAMP(3) NOT NULL,
    "publishDateSource" TEXT NOT NULL DEFAULT 'elle',
    "publishDateConfirmedAt" TIMESTAMP(3),
    "publishDateConfirmedBy" TEXT,
    "oppositionDeadline" TIMESTAMP(3) NOT NULL,
    "deadlineRaw" TIMESTAMP(3),
    "deadlineHalfDay" BOOLEAN NOT NULL DEFAULT false,
    "sourceUrl" TEXT,
    "fileName" TEXT,
    "filePath" TEXT,
    "fileHash" TEXT,
    "fileSize" INTEGER,
    "pageCount" INTEGER,
    "pagesDone" INTEGER NOT NULL DEFAULT 0,
    "resumePage" INTEGER NOT NULL DEFAULT 1,
    "importRun" INTEGER NOT NULL DEFAULT 0,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "parseWarnings" INTEGER NOT NULL DEFAULT 0,
    "parseStats" JSONB,
    "status" TEXT NOT NULL DEFAULT 'bekliyor',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "scannedAt" TIMESTAMP(3),
    "matchCount" INTEGER NOT NULL DEFAULT 0,
    "staffNotifiedAt" TIMESTAMP(3),
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
    "priorityDate" TIMESTAMP(3),
    "priorityNo" TEXT,
    "priorityCountry" TEXT,
    "markText" TEXT NOT NULL DEFAULT '',
    "markTextSource" TEXT NOT NULL DEFAULT 'pdf-metin',
    "markNorm" TEXT NOT NULL DEFAULT '',
    "markPhon" TEXT NOT NULL DEFAULT '',
    "markPhonEn" TEXT NOT NULL DEFAULT '',
    "markType" TEXT,
    "recordType" TEXT NOT NULL DEFAULT 'ulusal',
    "intlRegNo" TEXT,
    "classes" INTEGER[],
    "goods" TEXT,
    "goodsByClass" JSONB,
    "viennaCodes" TEXT[],
    "colors" TEXT,
    "owner" TEXT,
    "ownerAddress" TEXT,
    "attorney" TEXT,
    "pageNo" INTEGER,
    "rawText" TEXT,
    "contentHash" TEXT NOT NULL DEFAULT '',
    "importRun" INTEGER NOT NULL DEFAULT 0,
    "editedAt" TIMESTAMP(3),
    "editedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulletinMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchMatch" (
    "id" TEXT NOT NULL,
    "watchedMarkId" TEXT NOT NULL,
    "bulletinMarkId" TEXT NOT NULL,
    "bulletinId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'kelime',
    "origin" TEXT NOT NULL DEFAULT 'bulten',
    "score" INTEGER NOT NULL,
    "nameScore" INTEGER NOT NULL,
    "classScore" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "reasons" JSONB NOT NULL,
    "sharedClasses" INTEGER[],
    "seniority" TEXT NOT NULL DEFAULT 'bilinmiyor',
    "useProofRisk" BOOLEAN NOT NULL DEFAULT false,
    "conflict" JSONB,
    "conflictClearedBy" TEXT,
    "conflictClearedAt" TIMESTAMP(3),
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "stale" BOOLEAN NOT NULL DEFAULT false,
    "lastScannedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'yeni',
    "autoReason" TEXT,
    "dismissReason" TEXT,
    "secondReviewBy" TEXT,
    "secondReviewAt" TIMESTAMP(3),
    "assigneeId" TEXT,
    "note" TEXT,
    "recommendation" TEXT,
    "clientSummary" TEXT,
    "quote" JSONB,
    "instructionDue" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "notifiedAt" TIMESTAMP(3),
    "notifyChannel" TEXT,
    "notifyFailedAt" TIMESTAMP(3),
    "clientViewedAt" TIMESTAMP(3),
    "clientDecision" TEXT,
    "clientDecisionAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3) NOT NULL,
    "oppositionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientDecision" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "note" TEXT,
    "source" TEXT NOT NULL,
    "decidedBy" TEXT,
    "recordedBy" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opposition" (
    "id" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'giden',
    "clientId" TEXT NOT NULL,
    "targetAppNo" TEXT NOT NULL,
    "targetMark" TEXT NOT NULL,
    "targetOwner" TEXT,
    "opponentName" TEXT,
    "bulletinNo" TEXT,
    "ourMarkId" TEXT,
    "grounds" TEXT[],
    "scope" TEXT NOT NULL DEFAULT 'tum',
    "opposedClasses" INTEGER[],
    "opposedGoods" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'kurum',
    "status" TEXT NOT NULL DEFAULT 'hazirlaniyor',
    "outcome" TEXT,
    "filedAt" TIMESTAMP(3),
    "officeRefNo" TEXT,
    "officialFee" DECIMAL(12,2),
    "serviceFee" DECIMAL(12,2),
    "feePaidAt" TIMESTAMP(3),
    "feeReceiptNo" TEXT,
    "checklist" JSONB,
    "useProofRequestedAt" TIMESTAMP(3),
    "useProofDue" TIMESTAMP(3),
    "decisionDate" TIMESTAMP(3),
    "outcomeNote" TEXT,
    "notes" TEXT,
    "assigneeId" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OppositionBasis" (
    "id" TEXT NOT NULL,
    "oppositionId" TEXT NOT NULL,
    "watchedMarkId" TEXT,
    "basisType" TEXT NOT NULL DEFAULT 'tescilli-marka',
    "label" TEXT NOT NULL,
    "appNo" TEXT,
    "regNo" TEXT,
    "classes" INTEGER[],
    "useProofRisk" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OppositionBasis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OppositionEvent" (
    "id" TEXT NOT NULL,
    "oppositionId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "channel" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "servedAt" TIMESTAMP(3),
    "periodText" TEXT,
    "documentNo" TEXT,
    "outcome" TEXT,
    "note" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OppositionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deadline" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "rawDueDate" TIMESTAMP(3),
    "halfDay" BOOLEAN NOT NULL DEFAULT false,
    "shiftReason" TEXT,
    "internal" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'acik',
    "clientId" TEXT,
    "watchedMarkId" TEXT,
    "oppositionId" TEXT,
    "matchId" TEXT,
    "eventId" TEXT,
    "assigneeId" TEXT,
    "sourceKey" TEXT,
    "remindDays" INTEGER[] DEFAULT ARRAY[30, 14, 7, 3, 1]::INTEGER[],
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "content" BYTEA,
    "storageKey" TEXT,
    "visibleToClient" BOOLEAN NOT NULL DEFAULT false,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "dedupeKey" TEXT,
    "recipient" TEXT,
    "subject" TEXT,
    "body" TEXT,
    "status" TEXT NOT NULL DEFAULT 'bekliyor',
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "clientId" TEXT,
    "matchId" TEXT,
    "staffId" TEXT,
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdBy" TEXT,
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
    "dedupeKey" TEXT,
    "bulletinId" TEXT,
    "payload" JSONB,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "runAfter" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedBy" TEXT,
    "lockToken" TEXT,
    "lockedAt" TIMESTAMP(3),
    "heartbeatAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedView" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "ownerId" TEXT,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Search" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "classes" INTEGER[],
    "clientId" TEXT,
    "resultCount" INTEGER NOT NULL,
    "topResults" JSONB NOT NULL,
    "coverage" JSONB NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_portalTokenHash_key" ON "Client"("portalTokenHash");

-- CreateIndex
CREATE INDEX "Client_active_idx" ON "Client"("active");

-- CreateIndex
CREATE INDEX "Client_responsibleId_idx" ON "Client"("responsibleId");

-- CreateIndex
CREATE INDEX "ClientContact_clientId_idx" ON "ClientContact"("clientId");

-- CreateIndex
CREATE INDEX "WatchedMark_clientId_idx" ON "WatchedMark"("clientId");

-- CreateIndex
CREATE INDEX "WatchedMark_active_idx" ON "WatchedMark"("active");

-- CreateIndex
CREATE INDEX "WatchedMark_applicationNo_idx" ON "WatchedMark"("applicationNo");

-- CreateIndex
CREATE INDEX "WatchedMark_importBatchId_idx" ON "WatchedMark"("importBatchId");

-- CreateIndex
CREATE UNIQUE INDEX "Bulletin_fileHash_key" ON "Bulletin"("fileHash");

-- CreateIndex
CREATE INDEX "Bulletin_publishDate_idx" ON "Bulletin"("publishDate");

-- CreateIndex
CREATE INDEX "Bulletin_status_idx" ON "Bulletin"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Bulletin_type_number_key" ON "Bulletin"("type", "number");

-- CreateIndex
CREATE INDEX "BulletinMark_applicationNo_idx" ON "BulletinMark"("applicationNo");

-- CreateIndex
CREATE INDEX "BulletinMark_classes_idx" ON "BulletinMark" USING GIN ("classes");

-- CreateIndex
CREATE INDEX "BulletinMark_markNorm_trgm_idx" ON "BulletinMark" USING GIN ("markNorm" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "BulletinMark_markPhon_trgm_idx" ON "BulletinMark" USING GIN ("markPhon" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "BulletinMark_markPhonEn_trgm_idx" ON "BulletinMark" USING GIN ("markPhonEn" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "BulletinMark_bulletinId_applicationNo_key" ON "BulletinMark"("bulletinId", "applicationNo");

-- CreateIndex
CREATE INDEX "WatchMatch_status_deadline_idx" ON "WatchMatch"("status", "deadline");

-- CreateIndex
CREATE INDEX "WatchMatch_bulletinId_idx" ON "WatchMatch"("bulletinId");

-- CreateIndex
CREATE INDEX "WatchMatch_bulletinMarkId_idx" ON "WatchMatch"("bulletinMarkId");

-- CreateIndex
CREATE INDEX "WatchMatch_watchedMarkId_status_idx" ON "WatchMatch"("watchedMarkId", "status");

-- CreateIndex
CREATE INDEX "WatchMatch_assigneeId_idx" ON "WatchMatch"("assigneeId");

-- CreateIndex
CREATE INDEX "WatchMatch_oppositionId_idx" ON "WatchMatch"("oppositionId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchMatch_watchedMarkId_bulletinMarkId_key" ON "WatchMatch"("watchedMarkId", "bulletinMarkId");

-- CreateIndex
CREATE INDEX "ClientDecision_matchId_idx" ON "ClientDecision"("matchId");

-- CreateIndex
CREATE INDEX "ClientDecision_clientId_idx" ON "ClientDecision"("clientId");

-- CreateIndex
CREATE INDEX "Opposition_status_idx" ON "Opposition"("status");

-- CreateIndex
CREATE INDEX "Opposition_clientId_idx" ON "Opposition"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Opposition_clientId_targetAppNo_direction_key" ON "Opposition"("clientId", "targetAppNo", "direction");

-- CreateIndex
CREATE INDEX "OppositionBasis_oppositionId_idx" ON "OppositionBasis"("oppositionId");

-- CreateIndex
CREATE INDEX "OppositionEvent_oppositionId_idx" ON "OppositionEvent"("oppositionId");

-- CreateIndex
CREATE UNIQUE INDEX "Deadline_sourceKey_key" ON "Deadline"("sourceKey");

-- CreateIndex
CREATE INDEX "Deadline_dueDate_status_idx" ON "Deadline"("dueDate", "status");

-- CreateIndex
CREATE INDEX "Deadline_clientId_idx" ON "Deadline"("clientId");

-- CreateIndex
CREATE INDEX "Deadline_watchedMarkId_idx" ON "Deadline"("watchedMarkId");

-- CreateIndex
CREATE INDEX "Deadline_oppositionId_idx" ON "Deadline"("oppositionId");

-- CreateIndex
CREATE INDEX "Deadline_assigneeId_idx" ON "Deadline"("assigneeId");

-- CreateIndex
CREATE INDEX "Document_entity_entityId_idx" ON "Document"("entity", "entityId");

-- CreateIndex
CREATE INDEX "Document_clientId_idx" ON "Document"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_clientId_idx" ON "Notification"("clientId");

-- CreateIndex
CREATE INDEX "Notification_matchId_idx" ON "Notification"("matchId");

-- CreateIndex
CREATE INDEX "Notification_staffId_readAt_idx" ON "Notification"("staffId", "readAt");

-- CreateIndex
CREATE INDEX "Activity_entity_entityId_idx" ON "Activity"("entity", "entityId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE INDEX "Job_status_runAfter_idx" ON "Job"("status", "runAfter");

-- CreateIndex
CREATE INDEX "Job_dedupeKey_idx" ON "Job"("dedupeKey");

-- CreateIndex
CREATE INDEX "Job_bulletinId_idx" ON "Job"("bulletinId");

-- CreateIndex
CREATE INDEX "SavedView_page_idx" ON "SavedView"("page");

-- CreateIndex
CREATE INDEX "Search_clientId_idx" ON "Search"("clientId");

-- CreateIndex
CREATE INDEX "Search_createdAt_idx" ON "Search"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_calendarKey_key" ON "AdminUser"("calendarKey");

-- AddForeignKey
ALTER TABLE "ClientContact" ADD CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMark" ADD CONSTRAINT "WatchedMark_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletinMark" ADD CONSTRAINT "BulletinMark_bulletinId_fkey" FOREIGN KEY ("bulletinId") REFERENCES "Bulletin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchMatch" ADD CONSTRAINT "WatchMatch_watchedMarkId_fkey" FOREIGN KEY ("watchedMarkId") REFERENCES "WatchedMark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchMatch" ADD CONSTRAINT "WatchMatch_bulletinMarkId_fkey" FOREIGN KEY ("bulletinMarkId") REFERENCES "BulletinMark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchMatch" ADD CONSTRAINT "WatchMatch_bulletinId_fkey" FOREIGN KEY ("bulletinId") REFERENCES "Bulletin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchMatch" ADD CONSTRAINT "WatchMatch_oppositionId_fkey" FOREIGN KEY ("oppositionId") REFERENCES "Opposition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDecision" ADD CONSTRAINT "ClientDecision_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "WatchMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDecision" ADD CONSTRAINT "ClientDecision_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opposition" ADD CONSTRAINT "Opposition_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OppositionBasis" ADD CONSTRAINT "OppositionBasis_oppositionId_fkey" FOREIGN KEY ("oppositionId") REFERENCES "Opposition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OppositionBasis" ADD CONSTRAINT "OppositionBasis_watchedMarkId_fkey" FOREIGN KEY ("watchedMarkId") REFERENCES "WatchedMark"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OppositionEvent" ADD CONSTRAINT "OppositionEvent_oppositionId_fkey" FOREIGN KEY ("oppositionId") REFERENCES "Opposition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_watchedMarkId_fkey" FOREIGN KEY ("watchedMarkId") REFERENCES "WatchedMark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_oppositionId_fkey" FOREIGN KEY ("oppositionId") REFERENCES "Opposition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

