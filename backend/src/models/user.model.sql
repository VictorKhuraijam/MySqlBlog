CREATE TABLE `blog`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `image` VARCHAR(200) NULL,
  `bio` VARCHAR(400) NULL,
  PRIMARY KEY (`id`));
