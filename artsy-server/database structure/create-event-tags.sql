CREATE TABLE `eventtags` (
  `eventTagsId` int NOT NULL AUTO_INCREMENT,
  `eventId` INT NOT NULL,
  `genreId` varchar(255) NOT NULL,
  PRIMARY KEY (`eventTagsId`),
  KEY `eventId` (`eventId`),
  KEY `genreId` (`genreId`),
  CONSTRAINT `eventtags_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`),
  CONSTRAINT `eventtags_ibfk_2` FOREIGN KEY (`genreId`) REFERENCES `genres` (`genreId`)
) 