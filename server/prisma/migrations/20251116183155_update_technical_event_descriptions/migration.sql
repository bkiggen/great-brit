-- Update technical event type descriptions
UPDATE "event_types" SET "description" = '1st in Technical' WHERE "description" = 'T1';
UPDATE "event_types" SET "description" = '2nd in Technical' WHERE "description" = 'T2';
UPDATE "event_types" SET "description" = '2nd to Last in Technical' WHERE "description" = 'T-1';
UPDATE "event_types" SET "description" = 'Last in Technical' WHERE "description" = 'T-2';
