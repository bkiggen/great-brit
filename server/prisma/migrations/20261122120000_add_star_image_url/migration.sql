-- Optional photo for each baker (used as avatar in the UI)
ALTER TABLE "stars" ADD COLUMN "imageUrl" TEXT;

-- Season 17 portraits (files in client/public/bakers/s17)
UPDATE "stars" s SET "imageUrl" = '/bakers/s17/' || lower(s."firstName") || '.jpg'
FROM "seasons" se
WHERE se."id" = s."seasonId" AND se."number" = 17
  AND lower(s."firstName") IN ('clara','connie','danni','gabe','gary','mo','molly','moyin','nikki','shannon','tom','yannis');
