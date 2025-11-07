/*
  Warnings:

  - A unique constraint covering the columns `[dashboardId,status,position]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Task_dashboardId_status_position_idx" ON "Task"("dashboardId", "status", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Task_dashboardId_status_position_key" ON "Task"("dashboardId", "status", "position");
