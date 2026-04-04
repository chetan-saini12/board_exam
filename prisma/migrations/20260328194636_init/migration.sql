-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('open', 'on_going', 'resolved', 'not_interested');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ticket_type" "TicketType" NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'open',
    "contact_number" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "exam_detail" TEXT,
    "user_call_comments" TEXT,
    "document_url" TEXT,
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "commission_money" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commission_received" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "master_commission_pending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "agent_id" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "total_commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "first_commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "second_commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
