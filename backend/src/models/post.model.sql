CREATE TABLE `blog`.`posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(245) NOT NULL,
  `desc` VARCHAR(1000) NOT NULL,
  `img` VARCHAR(250) NOT NULL,
  `date` DATETIME NOT NULL,
  `uid` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `uid_idx` (`uid` ASC) VISIBLE,
  CONSTRAINT `uid`
    FOREIGN KEY (`uid`)
    REFERENCES `blog`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
