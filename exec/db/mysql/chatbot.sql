USE chatbot;

CREATE TABLE `prompts`
(
    `child_id`            INT UNSIGNED NOT NULL PRIMARY KEY,
    `manager_id`          INT UNSIGNED NOT NULL,
    `birth`               DATE     NOT NULL,
    `category_difficulty` TEXT     NOT NULL,
    `content`             TEXT NULL    DEFAULT NULL,
    `gender`              ENUM('MALE', 'FEMALE') NOT NULL,
    `created_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`         DATETIME NULL DEFAULT NULL,
    `deleted_at`          DATETIME NULL DEFAULT NULL
);
