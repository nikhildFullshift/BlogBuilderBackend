/*
  Warnings:

  - A unique constraint covering the columns `[highlight_mark_id]` on the table `annotation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "published_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "annotation_highlight_mark_id_key" ON "annotation"("highlight_mark_id");
