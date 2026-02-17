--straightly exported from dbdiagrm.io, fixes needed 

CREATE TABLE `users` (
  `userId` integer PRIMARY KEY AUTO_INCREMENT,
  `userName` varchar(255) UNIQUE NOT NULL DEFAULT (userId),
  `email` varchar(255) UNIQUE NOT NULL,
  `avatarUrl` Varchar(255),
  `passwordHash` varchar(255) NOT NULL,
  `birthday` date,
  `location` varchar(255),
  `bio` varchar(255),
  `gender` varchar(255),
  `emailNotification` boolean DEFAULT true,
  `messageNotification` boolean DEFAULT true,
  `chatNotification` boolean DEFAULT true,
  `globalPushNotification` boolean DEFAULT true,
  `createdAt` timestamp DEFAULT (now()),
  `updatedAt` timestamp
);

CREATE TABLE `events` (
  `eventId` integer UNIQUE PRIMARY KEY,
  `creatorId` integer,
  `title` varchar(255) NOT NULL,
  `description` varchar(255),
  `posterUrl` varchar(255),
  `startDateTime` timestamp NOT NULL,
  `endDateTime` timestamp,
  `venue` integer,
  `location` integer,
  `minprice` decimal(10,2) DEFAULT 0,
  `maxprice` decimal(10,2) DEFAULT 0,
  `currency` integer,
  `ticketlink` varchar(255),
  `viewCount` integer DEFAULT 0,
  `sourcePlatform` varchar(255),
  `createdAt` timestamp DEFAULT (now()),
  `updatedAt` timestamp
);

CREATE TABLE `eventExternalSources` (
  `eventId` integer PRIMARY KEY,
  `externalApiId` varchar(255),
  `externalApiSource` varchar(255),
  `externalUrl` varchar(255),
  `lastSyncedAt` timestamp
);

CREATE TABLE `sourcePlatform` (
  `sourceId` integer PRIMARY KEY,
  `sourceName` varchar(255),
  `sourceIconUrl` varchar(255)
);

CREATE TABLE `posts` (
  `postId` integer PRIMARY KEY AUTO_INCREMENT,
  `postType` varchar(255) NOT NULL,
  `userId` integer NOT NULL,
  `eventId` integer,
  `postParentId` integer,
  `content` text NOT NULL,
  `isDeleted` boolean DEFAULT false,
  `deletedAt` timestamp,
  `createdAt` timestamp DEFAULT (now()),
  `updatedAt` timestamp
);

CREATE TABLE `postImages` (
  `postImageId` integer PRIMARY KEY AUTO_INCREMENT,
  `imageUrl` varchar(255),
  `postId` integer
);

CREATE TABLE `postLikes` (
  `likeId` integer PRIMARY KEY AUTO_INCREMENT,
  `userId` integer,
  `postId` integer,
  `postLikedAt` timestamp DEFAULT (now())
);

CREATE TABLE `chats` (
  `chatId` integer PRIMARY KEY AUTO_INCREMENT,
  `chatType` integer NOT NULL,
  `eventId` integer,
  `chatName` varchar(100),
  `createdAt` timestamp DEFAULT (now()),
  `updatedAt` timestamp
);

CREATE TABLE `chatParticipants` (
  `chatParticipantId` integer PRIMARY KEY AUTO_INCREMENT,
  `chatId` integer,
  `userId` integer,
  `joinedAt` timestamp DEFAULT (now()),
  `leftAt` timestamp,
  `isArchived` boolean DEFAULT false,
  `archivedAt` timestamp
);

CREATE TABLE `chatMessages` (
  `messageId` integer PRIMARY KEY AUTO_INCREMENT,
  `chatId` integer NOT NULL,
  `senderId` integer NOT NULL,
  `sentAt` timestamp DEFAULT (now()),
  `content` text NOT NULL,
  `isDeleted` boolean DEFAULT false,
  `deletedAt` timestamp
);

CREATE TABLE `notifications` (
  `notificationId` integer PRIMARY KEY AUTO_INCREMENT,
  `userId` integer NOT NULL,
  `actorId` integer,
  `type` varchar(50) NOT NULL,
  `relatedEntityType` varchar(255),
  `relatedEntityId` integer,
  `content` text,
  `isRead` boolean DEFAULT false,
  `isDeleted` boolean DEFAULT false,
  `isArchived` boolean DEFAULT false,
  `sentAt` timestamp DEFAULT (now())
);

CREATE TABLE `eventSaves` (
  `eventSaveId` integer PRIMARY KEY AUTO_INCREMENT,
  `userId` integer,
  `eventId` integer,
  `wantBuddy` boolean DEFAULT false,
  `eventSavedAt` timestamp DEFAULT (now())
);

CREATE TABLE `eventBuddy` (
  `requestId` integer PRIMARY KEY AUTO_INCREMENT,
  `userId` integer NOT NULL,
  `buddyId` integer NOT NULL,
  `eventId` integer NOT NULL,
  `status` integer NOT NULL,
  `createdAt` timestamp DEFAULT (now()),
  `updatedAt` timestamp
);

CREATE TABLE `eventAttended` (
  `eventAttendId` integer PRIMARY KEY AUTO_INCREMENT,
  `userId` integer,
  `eventId` integer,
  `attendedAt` timestamp,
  `createdAt` timestamp DEFAULT (now()),
  `rating` integer,
  `postId` integer
);

CREATE TABLE `userGender` (
  `genderId` integer PRIMARY KEY,
  `genderName` varchar(255)
);

CREATE TABLE `userLocation` (
  `locationId` integer PRIMARY KEY,
  `locationName` varchar(255)
);

CREATE TABLE `venues` (
  `venueId` integer PRIMARY KEY AUTO_INCREMENT,
  `venueName` varchar(255) NOT NULL,
  `address` varchar(255),
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `website` varchar(255),
  `createdAt` timestamp
);

CREATE TABLE `eventLocation` (
  `locationId` integer PRIMARY KEY AUTO_INCREMENT,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `createdAt` timestamp
);

CREATE TABLE `currency` (
  `currencyId` integer PRIMARY KEY,
  `currencyName` varchar(3) DEFAULT 'EUR'
);

CREATE TABLE `postType` (
  `typeId` integer PRIMARY KEY,
  `typeName` varchar(255)
);

CREATE TABLE `chatType` (
  `typeId` integer PRIMARY KEY,
  `typeName` varchar(255)
);

CREATE TABLE `relatedEntityType` (
  `typeId` integer PRIMARY KEY,
  `typeName` varchar(255)
);

CREATE TABLE `requestStatus` (
  `statusId` integer PRIMARY KEY,
  `statusName` varchar(255)
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

CREATE TABLE `user_category_map` (
  `userCategoryId` integer PRIMARY KEY AUTO_INCREMENT,
  `userId` integer,
  `categoryId` integer
);

CREATE TABLE `user_tag_map` (
  `userTagId` integer PRIMARY KEY AUTO_INCREMENT,
  `userId` integer,
  `tagId` integer
);

CREATE TABLE `event_category_map` (
  `eventCategoryId` integer PRIMARY KEY AUTO_INCREMENT,
  `eventId` integer,
  `categoryId` integer
);

CREATE TABLE `event_tag_map` (
  `eventTagId` integer PRIMARY KEY AUTO_INCREMENT,
  `eventId` integer,
  `tagId` integer
);

CREATE TABLE `blocked_users` (
  `blockId` integer PRIMARY KEY AUTO_INCREMENT,
  `blockerId` integer,
  `blockedId` integer,
  `blockedAt` timestamp DEFAULT (now()) 
);

ALTER TABLE `users` ADD FOREIGN KEY (`location`) REFERENCES `userLocation` (`locationId`);

ALTER TABLE `users` ADD FOREIGN KEY (`gender`) REFERENCES `userGender` (`genderId`);

ALTER TABLE `events` ADD FOREIGN KEY (`creatorId`) REFERENCES `users` (`userId`);

ALTER TABLE `events` ADD FOREIGN KEY (`venue`) REFERENCES `venues` (`venueId`);

ALTER TABLE `events` ADD FOREIGN KEY (`location`) REFERENCES `eventLocation` (`locationId`);

ALTER TABLE `events` ADD FOREIGN KEY (`currency`) REFERENCES `currency` (`currencyId`);

ALTER TABLE `events` ADD FOREIGN KEY (`sourcePlatform`) REFERENCES `sourcePlatform` (`sourceId`);

ALTER TABLE `eventExternalSources` ADD FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`);

ALTER TABLE `eventExternalSources` ADD FOREIGN KEY (`externalApiSource`) REFERENCES `sourcePlatform` (`sourceId`);

ALTER TABLE `posts` ADD FOREIGN KEY (`postType`) REFERENCES `postType` (`typeId`);

ALTER TABLE `posts` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `posts` ADD FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`);

ALTER TABLE `posts` ADD FOREIGN KEY (`postParentId`) REFERENCES `posts` (`postId`);

ALTER TABLE `postImages` ADD FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`);

ALTER TABLE `postLikes` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `postLikes` ADD FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`);

ALTER TABLE `chats` ADD FOREIGN KEY (`chatType`) REFERENCES `chatType` (`typeId`);

ALTER TABLE `chats` ADD FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`);

ALTER TABLE `chatParticipants` ADD FOREIGN KEY (`chatId`) REFERENCES `chats` (`chatId`);

ALTER TABLE `chatParticipants` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `chatMessages` ADD FOREIGN KEY (`chatId`) REFERENCES `chats` (`chatId`);

ALTER TABLE `chatMessages` ADD FOREIGN KEY (`senderId`) REFERENCES `users` (`userId`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`actorId`) REFERENCES `users` (`userId`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`relatedEntityType`) REFERENCES `relatedEntityType` (`typeId`);

ALTER TABLE `eventSaves` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `eventSaves` ADD FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`);

ALTER TABLE `eventBuddy` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `eventBuddy` ADD FOREIGN KEY (`buddyId`) REFERENCES `users` (`userId`);

ALTER TABLE `eventBuddy` ADD FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`);

ALTER TABLE `eventBuddy` ADD FOREIGN KEY (`status`) REFERENCES `requestStatus` (`statusId`);

ALTER TABLE `eventAttended` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `eventAttended` ADD FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`);

ALTER TABLE `eventAttended` ADD FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`);

ALTER TABLE `user_category_map` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `user_category_map` ADD FOREIGN KEY (`categoryId`) REFERENCES `eventCategories` (`categoryId`);

ALTER TABLE `user_tag_map` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

ALTER TABLE `user_tag_map` ADD FOREIGN KEY (`tagId`) REFERENCES `eventTags` (`tagId`);

ALTER TABLE `event_category_map` ADD FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`);

ALTER TABLE `event_category_map` ADD FOREIGN KEY (`categoryId`) REFERENCES `eventCategories` (`categoryId`);

ALTER TABLE `event_tag_map` ADD FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`);

ALTER TABLE `event_tag_map` ADD FOREIGN KEY (`tagId`) REFERENCES `eventTags` (`tagId`);

ALTER TABLE `blocked_users` ADD FOREIGN KEY (`blockerId`) REFERENCES `users` (`userId`);

ALTER TABLE `blocked_users` ADD FOREIGN KEY (`blockedId`) REFERENCES `users` (`userId`);
