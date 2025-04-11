USE bank;

CREATE TABLE `members`
(
    `id`          INT UNSIGNED            NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email`       VARCHAR(255) NOT NULL,
    `birth`       DATE         NOT NULL,
    `name`        VARCHAR(10)  NOT NULL,
    `gender`      ENUM ('MALE', 'FEMALE') NOT NULL,
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME NULL     DEFAULT NULL,
    `deleted_at`  DATETIME NULL     DEFAULT NULL,
    UNIQUE KEY (email)
);

CREATE TABLE `accounts`
(
    `id`           INT UNSIGNED    NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id`    INT UNSIGNED    NOT NULL,
    `account_no`   VARCHAR(20) NOT NULL,
    `account_name` VARCHAR(60) NOT NULL,
    `password`     CHAR(4)    NOT NULL,
    `balance`      BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at`   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME NULL     DEFAULT NULL,
    `deleted_at`   DATETIME NULL     DEFAULT NULL,
    UNIQUE KEY (account_no)
);

CREATE TABLE `transaction_records`
(
    `id`              INT UNSIGNED                                                                     NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `account_id`      INT UNSIGNED                                                                     NOT NULL,
    `to_account_id`   INT UNSIGNED                                                                     NULL,
    `from_account_id` INT UNSIGNED                                                                     NULL,
    `type`            ENUM ('PAYMENT', 'DEPOSIT', 'WITHDRAW', 'INBOUND_TRANSFER', 'OUTBOUND_TRANSFER') NOT NULL,
    `amount`          BIGINT UNSIGNED                                                                  NOT NULL,
    `description`     VARCHAR(60) NULL,
    `after_balance`   BIGINT UNSIGNED                                                                  NOT NULL,
    `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`     DATETIME NULL     DEFAULT NULL,
    `deleted_at`      DATETIME NULL     DEFAULT NULL
);
