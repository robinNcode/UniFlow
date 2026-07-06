/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 8.0.46-0ubuntu0.24.04.3 : Database - uniflow_v1
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`uniflow_v1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `uniflow_v1`;

/*Table structure for table `admission_cycles` */

DROP TABLE IF EXISTS `admission_cycles`;

CREATE TABLE `admission_cycles` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `program_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `opens_at` datetime NOT NULL,
  `closes_at` datetime NOT NULL,
  `merit_result_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admission_cycles_program_id` (`program_id`),
  KEY `idx_admission_cycles_active_window` (`opens_at`,`closes_at`),
  CONSTRAINT `fk_admission_cycles_program` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_cycle_dates` CHECK ((`closes_at` > `opens_at`))
);

/*Data for the table `admission_cycles` */

/*Table structure for table `admit_cards` */

DROP TABLE IF EXISTS `admit_cards`;

CREATE TABLE `admit_cards` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `application_id` char(36) NOT NULL,
  `pdf_path` varchar(500) NOT NULL,
  `roll_number` varchar(50) NOT NULL,
  `exam_date` date DEFAULT NULL,
  `exam_center` varchar(255) DEFAULT NULL,
  `generated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admit_cards_application` (`application_id`),
  UNIQUE KEY `uq_admit_cards_roll_number` (`roll_number`),
  CONSTRAINT `fk_admit_cards_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
);

/*Data for the table `admit_cards` */

/*Table structure for table `applications` */

DROP TABLE IF EXISTS `applications`;

CREATE TABLE `applications` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `student_id` char(36) NOT NULL,
  `cycle_id` char(36) NOT NULL,
  `quota_id` char(36) NOT NULL,
  `merit_score` decimal(6,3) NOT NULL,
  `status` enum('pending','seat_reserved','payment_pending','confirmed','rejected','expired','withdrawn') NOT NULL DEFAULT 'pending',
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_applications_student_cycle` (`student_id`,`cycle_id`),
  KEY `idx_applications_cycle_status` (`cycle_id`,`status`),
  KEY `idx_applications_quota_id` (`quota_id`),
  KEY `idx_applications_student_id` (`student_id`),
  KEY `idx_applications_merit_rank` (`quota_id`,`merit_score` DESC),
  CONSTRAINT `fk_applications_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `admission_cycles` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_applications_quota` FOREIGN KEY (`quota_id`) REFERENCES `seat_quotas` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_applications_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_merit_score_range` CHECK (((`merit_score` >= 0) and (`merit_score` <= 100)))
);

/*Data for the table `applications` */

/*Table structure for table `notification_logs` */

DROP TABLE IF EXISTS `notification_logs`;

CREATE TABLE `notification_logs` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `application_id` char(36) DEFAULT NULL,
  `student_id` char(36) NOT NULL,
  `channel` enum('sms','email','push') NOT NULL,
  `template_key` varchar(100) NOT NULL,
  `payload` json DEFAULT NULL,
  `status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
  `attempt_count` smallint NOT NULL DEFAULT '0',
  `sent_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_notification_logs_application` (`application_id`),
  KEY `idx_notification_logs_student_id` (`student_id`),
  KEY `idx_notification_logs_status` (`status`),
  CONSTRAINT `fk_notification_logs_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_notification_logs_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
);

/*Data for the table `notification_logs` */

/*Table structure for table `outbox_events` */

DROP TABLE IF EXISTS `outbox_events`;

CREATE TABLE `outbox_events` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `event_type` varchar(100) NOT NULL,
  `aggregate_id` char(36) NOT NULL,
  `payload` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_outbox_events_unprocessed` (`created_at`)
);

/*Data for the table `outbox_events` */

/*Table structure for table `password_reset_tokens` */

DROP TABLE IF EXISTS `password_reset_tokens`;

CREATE TABLE `password_reset_tokens` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `subject_type` enum('student','staff') NOT NULL,
  `subject_id` char(36) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_password_reset_tokens_token_hash` (`token_hash`),
  KEY `idx_password_reset_tokens_subject` (`subject_type`,`subject_id`)
);

/*Data for the table `password_reset_tokens` */

/*Table structure for table `payments` */

DROP TABLE IF EXISTS `payments`;

CREATE TABLE `payments` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `application_id` char(36) NOT NULL,
  `provider` enum('bkash','nagad','rocket','sslcommerz','ssl_card') NOT NULL,
  `provider_txn_id` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('initiated','pending','verified','failed','refunded') NOT NULL DEFAULT 'initiated',
  `initiated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_at` datetime DEFAULT NULL,
  `raw_callback_payload` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payments_provider_txn` (`provider`,`provider_txn_id`),
  KEY `idx_payments_application_id` (`application_id`),
  KEY `idx_payments_status` (`status`),
  CONSTRAINT `fk_payments_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_payments_amount_positive` CHECK ((`amount` > 0))
);

/*Data for the table `payments` */

/*Table structure for table `programs` */

DROP TABLE IF EXISTS `programs`;

CREATE TABLE `programs` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `university_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `duration_years` smallint NOT NULL DEFAULT '4',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_programs_university_code` (`university_id`,`code`),
  KEY `idx_programs_university_id` (`university_id`),
  CONSTRAINT `fk_programs_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE CASCADE
);

/*Data for the table `programs` */

/*Table structure for table `refresh_tokens` */

DROP TABLE IF EXISTS `refresh_tokens`;

CREATE TABLE `refresh_tokens` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `subject_type` enum('student','staff') NOT NULL,
  `subject_id` char(36) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `jti` char(36) NOT NULL,
  `issued_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `replaced_by_token_id` char(36) DEFAULT NULL,
  `created_by_ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refresh_tokens_jti` (`jti`),
  UNIQUE KEY `uq_refresh_tokens_token_hash` (`token_hash`),
  KEY `fk_refresh_tokens_replaced_by` (`replaced_by_token_id`),
  KEY `idx_refresh_tokens_subject` (`subject_type`,`subject_id`),
  KEY `idx_refresh_tokens_expiry` (`expires_at`),
  CONSTRAINT `fk_refresh_tokens_replaced_by` FOREIGN KEY (`replaced_by_token_id`) REFERENCES `refresh_tokens` (`id`) ON DELETE SET NULL
);

/*Data for the table `refresh_tokens` */

/*Table structure for table `revoked_access_tokens` */

DROP TABLE IF EXISTS `revoked_access_tokens`;

CREATE TABLE `revoked_access_tokens` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `jti` char(36) NOT NULL,
  `subject_type` enum('student','staff') NOT NULL,
  `subject_id` char(36) NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_revoked_access_tokens_jti` (`jti`),
  KEY `idx_revoked_access_tokens_subject` (`subject_type`,`subject_id`),
  KEY `idx_revoked_access_tokens_expiry` (`expires_at`)
);

/*Data for the table `revoked_access_tokens` */

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `permissions` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_name` (`name`)
);

/*Data for the table `roles` */

/*Table structure for table `seat_quotas` */

DROP TABLE IF EXISTS `seat_quotas`;

CREATE TABLE `seat_quotas` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `cycle_id` char(36) NOT NULL,
  `quota_type` enum('general','freedom_fighter','tribal','district_quota','physically_challenged') NOT NULL,
  `total_seats` int NOT NULL,
  `filled_seats` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_seat_quotas_cycle_type` (`cycle_id`,`quota_type`),
  KEY `idx_seat_quotas_cycle_id` (`cycle_id`),
  CONSTRAINT `fk_seat_quotas_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `admission_cycles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_seat_quotas_non_negative` CHECK (((`total_seats` >= 0) and (`filled_seats` >= 0))),
  CONSTRAINT `chk_seat_quotas_not_overfilled` CHECK ((`filled_seats` <= `total_seats`))
);

/*Data for the table `seat_quotas` */

/*Table structure for table `seat_reservations` */

DROP TABLE IF EXISTS `seat_reservations`;

CREATE TABLE `seat_reservations` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `application_id` char(36) NOT NULL,
  `reserved_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  `released_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_seat_reservations_application` (`application_id`),
  KEY `idx_seat_reservations_expiry` (`expires_at`),
  CONSTRAINT `fk_seat_reservations_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
);

/*Data for the table `seat_reservations` */

/*Table structure for table `students` */

DROP TABLE IF EXISTS `students`;

CREATE TABLE `students` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `nid_or_birth_reg` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_students_phone` (`phone`),
  KEY `idx_students_email` (`email`)
);

/*Data for the table `students` */

/*Table structure for table `universities` */

DROP TABLE IF EXISTS `universities`;

CREATE TABLE `universities` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `short_name` varchar(50) NOT NULL,
  `domain` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_universities_short_name` (`short_name`)
);

/*Data for the table `universities` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `university_id` char(36) DEFAULT NULL,
  `role_id` char(36) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_staff_users_email` (`email`),
  KEY `idx_staff_users_university_id` (`university_id`),
  KEY `idx_staff_users_role_id` (`role_id`),
  CONSTRAINT `fk_staff_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_staff_users_university` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`) ON DELETE SET NULL
);

/*Data for the table `users` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
