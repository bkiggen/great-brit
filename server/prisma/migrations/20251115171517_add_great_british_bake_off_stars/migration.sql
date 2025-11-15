-- Delete all rankings (must delete first due to foreign key constraints)
DELETE FROM rankings;

-- Delete all episode_stars
DELETE FROM episode_stars;

-- Delete all events (they reference stars)
DELETE FROM events;

-- Delete all stars
DELETE FROM stars;

-- Reset the auto-increment sequence for stars
ALTER SEQUENCE stars_id_seq RESTART WITH 1;

-- Insert new Great British Bake Off stars
INSERT INTO stars ("firstName", "lastName", bio, active, "createdAt") VALUES
('Aaron', 'Mountford-Myles', 'Lives in London with his boyfriend Anthony. A passionate baker who fuses French patisserie with Caribbean flair, experimenting with Asian flavors like miso and yuzu. Known as the "King of Hobbies" - when not baking, he''s cycling, teaching himself French, lifting weights, or studying for a Master''s in Computer Science and Data Analytics.', true, NOW()),
('Hassan', '', 'Chemistry graduate from South Yorkshire who works in the pharmaceutical industry testing new drugs. Takes an analytical approach to baking with a love for sweet treats inspired by his Pakistani heritage, especially praline and nut-based flavors.', true, NOW()),
('Iain', '', 'Lives in Belfast with his girlfriend and their cat Viktor. Former amateur powerlifter who now "lifts dough instead of weights." The self-proclaimed "Yeastie Boy" mixes his love of live music with sourdough, immortalizing album cover art on bread crusts. Uses fermented fruits and vegetables in his baking.', true, NOW()),
('Jasmine', 'Mitchell', 'Edinburgh-born medical student living in London with her cousins. Learned baking basics from her mum and aunts during family gatherings in the Scottish Highlands. Uses fresh, seasonal ingredients for classic flavor combinations. Also enjoys sea swimming, running half marathons, and playing hockey.', true, NOW()),
('Jessika', '', 'Gymnastic, roller-skating drag king from Cornwall whose creations are as vibrant as her personality. Service designer who loves gifting bakes with daring flavors like salted mango caramel and cardamom, or Jerusalem artichoke caramel with dark chocolate mousse.', true, NOW()),
('Leighton', '', 'Welsh baker from Swansea now living in Surrey with his Californian husband Eric and their Irish Terrier, Cilla. Has a mathematical mind and approaches baking with the philosophy that "anything can be done with a formula." Plays tennis four times a week and likes to sing Les Mis while baking.', true, NOW()),
('Lesley', '', 'Hairdresser for 45 years whose salon clients always expect cake with their trim. Lives with her partner Mark and two dogs. Been baking since age 10, inspired by Nanny Mable and Auntie Joan. Loves classic old-school bakes with modern, fun designs.', true, NOW()),
('Nadia', '', 'Liverpool hairdresser blending Indian and Italian flavors with Scouse spirit. Inspired by her Italian chef dad, she lives with her partner Daniel and daughters Rosa-Bella and Maria. Former personal trainer who channels endless energy into novelty cakes and kitchen dance breaks.', true, NOW()),
('Nataliia', '', 'Born in Ukraine, taught to bake by her grandmother using traditional recipes. Moved to the UK with her husband Harry four years ago, followed by her family as refugees. Lives in East Yorkshire with their daughter Francesca and Ukrainian rescue dog Aria. Economics graduate who loves painting and running.', true, NOW()),
('Pui', 'Man', 'Bridal designer from Hong Kong now living in Essex with her husband and two children. Rediscovered baking during lockdown. Brings the attention to detail of designing wedding dresses to her bakes, practicing endlessly for perfection. Volunteers three evenings a week distributing surplus food in her community.', true, NOW()),
('Toby', '', 'Country boy from Sidmouth, now living in Warwickshire with his girlfriend Syd and rescue dog Bex. Works for a fitness start-up and has a blue belt in Brazilian Jiu-Jitsu. Takes a stripped-back, healthy approach to baking with a passion for bread, baking something different every day.', true, NOW()),
('Tom', 'Arden', 'Grew up in London learning to bake scones and flapjacks with his mum and Danish granny. Stepped back from the advertising agency he set up to reconnect with food. Member of two queer sports teams with a boyfriend of three years. Brings creative flair to beautifully presented bakes. Enjoys fishing, foraging for mushrooms, and cooking roasts.', true, NOW());