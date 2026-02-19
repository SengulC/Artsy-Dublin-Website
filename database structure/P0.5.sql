CREATE TABLE `events` (
  -- `eventId` integer PRIMARY KEY AUTO_INCREMENT,
  `eventUrl` varchar(255),
  `date` varchar(255),
  `title` varchar(255) NOT NULL,
  `venue` varchar(255),
  -- `description` varchar(255),
  -- `startDateTime` timestamp NOT NULL,
  -- `endDateTime` timestamp,
  -- `venueUrl` varchar(255),
  -- `location` integer,
  -- `minprice` decimal(10,2) DEFAULT 0,
  -- `maxprice` decimal(10,2) DEFAULT 0,
  -- `currency` integer,
  -- `viewCount` integer DEFAULT 0,
  -- `sourcePlatform` integer,
  -- `createdAt` timestamp DEFAULT (now()),
  -- `updatedAt` timestamp
);

CREATE TABLE `eventCategories` (
  `categoryId` integer PRIMARY KEY AUTO_INCREMENT,
  `categoryName` varchar(50) UNIQUE NOT NULL,
  `description` text
);

CREATE TABLE `eventTags` (
  `tagId` integer PRIMARY KEY AUTO_INCREMENT,
  `tagName` varchar(50) UNIQUE NOT NULL
);