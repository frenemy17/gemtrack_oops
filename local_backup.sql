-- MySQL dump 10.13  Distrib 9.4.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: stock
-- ------------------------------------------------------
-- Server version	9.3.0-commercial

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('75ceb5be-fe9b-422f-b26d-ff3aae0ecb86','1193f8a1d9965cfb539dd34d72d6d580e8182d7c64d4debff0043d44fa080e41','2025-12-01 09:07:09.552','20251006045545_init',NULL,NULL,'2025-12-01 09:07:09.546',1),('7a8b5dee-f9e4-4aa2-9df1-f75b3c4224a9','5ce3bbb7c4834ddf799244c93ec114df024554beac7d9839cba5fc3d71cdf015','2025-12-01 09:07:09.593','20251109063532_init_phase2_features',NULL,NULL,'2025-12-01 09:07:09.553',1),('894640c2-5849-4073-898d-16686d3c3c97','135b4cd0f22a6a441821a5a872a83de20d200fb9e0a067c3e5fb357339767a94','2025-12-01 09:07:09.740','20251111091119_add_payments_and_credit_features',NULL,NULL,'2025-12-01 09:07:09.593',1),('8b661dca-ee32-4b6b-a6ca-57d68d6953d1','0191247ef26005d0b2451d8dcf44b3f2008f354186d196077d55e693cf7783f2','2025-12-02 13:34:04.014','20251202133403_add_barcode_printed',NULL,NULL,'2025-12-02 13:34:04.001',1),('923c6f33-a0c7-4f00-b04c-f35501cdf886','1f715a3ee11ae7b6adc8381bf0de1c21406a38875061eba1323bb40ef2cf3975','2025-12-01 09:37:13.073','20251201093713_add_is_sold_field',NULL,NULL,'2025-12-01 09:37:13.068',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pancard` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_phone_key` (`phone`),
  UNIQUE KEY `customers_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'test','8951332718','test1@gmail.com','testcity','city','518314','','2025-12-01 09:09:55.014'),(2,'Test Customer','9876588188','customer1764584988188@test.com','123 Test St','Delhi','400001','ABCDE1234F','2025-12-01 10:29:48.189');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cgstPct` double DEFAULT NULL,
  `grossWeight` double DEFAULT NULL,
  `hallmarkingCharges` int DEFAULT NULL,
  `huid` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `makingPerGm` double DEFAULT NULL,
  `netWeight` double DEFAULT NULL,
  `otherCharges` int DEFAULT NULL,
  `purity` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sgstPct` double DEFAULT NULL,
  `stoneCharges` int DEFAULT NULL,
  `wastagePct` double DEFAULT NULL,
  `isSold` tinyint(1) NOT NULL DEFAULT '0',
  `barcodePrinted` tinyint(1) NOT NULL DEFAULT '0',
  `metal` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `items_sku_key` (`sku`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'gold ring','JWLMIMXFD3OFTW8',NULL,50000,'2025-12-01 09:08:55.464','ring',1.5,12,200,'2J58M8',2,13,NULL,'22',1.5,2000,2,0,1,NULL),(2,'gold ring','1234',NULL,65000,'2025-12-01 09:39:17.984','ring',1.5,10,120,'RUCKZT',2,12,NULL,'22',1.5,1000,3,1,0,NULL),(3,'Test Gold Ring','SKU1764584988170',50000,56000,'2025-12-01 10:29:48.173','Ring',1.5,10.5,100,'HUID123',500,10,50,'22K',1.5,200,5,1,0,NULL),(4,'Test Gold Ring','SKU1764585057155',50000,56000,'2025-12-01 10:30:57.158','Ring',1.5,10.5,100,'HUID123',500,10,50,'22K',1.5,200,5,1,0,NULL),(5,'Test Gold Ring','SKU1764585864179',50000,56000,'2025-12-01 10:44:24.181','Ring',1.5,10.5,100,'HUID123',500,10,50,'22K',1.5,200,5,1,0,NULL),(6,'gold chain','SKU-066485-4753',NULL,20000,'2025-12-01 20:48:23.005','chain',NULL,10,NULL,NULL,NULL,12,NULL,'22',NULL,NULL,NULL,1,1,NULL),(7,'braclet','H5RFSV47',13000,79900,'2025-12-02 17:49:11.812','ring',1,12,1,'bh lbb',12,12,33,'22',NULL,12,NULL,1,1,NULL),(8,'test','80G6HBLY',39000,40000,'2025-12-02 18:38:12.018','Mangalsutra',1.5,10,NULL,'',NULL,12,3000,'22K',1.5,230,3,1,1,NULL),(9,'new ','SKU548263989',20000,210000,'2025-12-02 21:06:34.473','Necklace',1.5,30.006,23,'',12,30.006,0,'22K',1.5,350,2,1,0,NULL),(10,'new ','SKU162165140',30000,31000,'2025-12-02 21:16:26.309','Chain',NULL,45,NULL,'',3,79,NULL,'22K',NULL,NULL,5,1,1,NULL);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amountPaid` double NOT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `saleId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_saleId_fkey` (`saleId`),
  CONSTRAINT `payments_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,50000,'Cash','2025-12-01 09:12:44.794',1),(2,48000,'Card','2025-12-01 09:15:56.528',2),(3,50000,'Card','2025-12-01 09:29:41.094',3),(4,65000,'Cash','2025-12-01 09:43:54.580',13),(5,50000,'Cash','2025-12-01 10:29:48.202',14),(6,50000,'Cash','2025-12-01 10:30:57.187',15),(7,65000,'Cash','2025-12-01 10:34:08.341',16),(8,50000,'Cash','2025-12-01 10:44:24.202',17),(9,65000,'Cash','2025-12-01 10:47:08.387',18),(10,79800,'Cash','2025-12-02 17:54:14.859',19),(11,79800,'Cash','2025-12-02 17:54:23.372',20),(12,79900,'Cash','2025-12-02 18:00:34.246',21),(13,78000,'Cash','2025-12-02 18:04:33.532',22),(14,70000,'Cash','2025-12-02 18:18:30.192',23),(15,21000,'Cash','2025-12-02 21:07:40.599',24),(16,20000,'Cash','2025-12-02 21:17:16.254',25),(17,2000,'Cash','2025-12-02 21:17:28.352',26),(18,20000,'Cash','2025-12-02 21:17:34.551',27),(19,20000,'Cash','2025-12-02 21:18:57.762',28),(20,41200,'Cash','2025-12-02 21:21:41.172',29),(21,41200,'Cash','2025-12-02 21:21:45.247',30),(22,41200,'Cash','2025-12-02 21:22:19.514',31),(23,31900,'Cash','2025-12-02 21:57:35.815',32);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_items`
--

DROP TABLE IF EXISTS `sale_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `soldPrice` double NOT NULL,
  `soldMakingCharge` double DEFAULT NULL,
  `soldWastage` double DEFAULT NULL,
  `soldHallmarking` int DEFAULT NULL,
  `soldStoneCharges` int DEFAULT NULL,
  `soldOtherCharges` int DEFAULT NULL,
  `soldCgstPct` double DEFAULT NULL,
  `soldSgstPct` double DEFAULT NULL,
  `saleId` int NOT NULL,
  `itemId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sale_items_itemId_fkey` (`itemId`),
  KEY `sale_items_saleId_fkey` (`saleId`),
  CONSTRAINT `sale_items_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `sale_items_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_items`
--

LOCK TABLES `sale_items` WRITE;
/*!40000 ALTER TABLE `sale_items` DISABLE KEYS */;
INSERT INTO `sale_items` VALUES (1,50000,2,2,200,2000,NULL,1.5,1.5,1,1),(2,50000,2,2,200,2000,NULL,1.5,1.5,2,1),(3,50000,2,2,200,2000,NULL,1.5,1.5,3,1),(13,65000,2,3,120,1000,NULL,1.5,1.5,13,2),(14,55000,500,5,100,200,50,1.5,1.5,14,3),(15,55000,500,5,100,200,50,1.5,1.5,15,4),(16,65000,2,3,120,1000,NULL,1.5,1.5,16,2),(17,55000,500,5,100,200,50,1.5,1.5,17,5),(18,65000,2,3,120,1000,NULL,1.5,1.5,18,2),(19,79900,NULL,NULL,NULL,NULL,NULL,NULL,NULL,19,7),(20,79900,NULL,NULL,NULL,NULL,NULL,NULL,NULL,20,7),(21,79900,NULL,NULL,NULL,NULL,NULL,NULL,NULL,21,7),(22,79900,NULL,NULL,NULL,NULL,NULL,NULL,NULL,22,7),(23,79900,NULL,NULL,NULL,NULL,NULL,NULL,NULL,23,7),(24,210000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,24,9),(25,20000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,25,6),(26,20000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,6),(27,20000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,27,6),(28,20000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,28,6),(29,40000,NULL,NULL,NULL,NULL,NULL,1.5,1.5,29,8),(30,40000,NULL,NULL,NULL,NULL,NULL,1.5,1.5,30,8),(31,40000,NULL,NULL,NULL,NULL,NULL,1.5,1.5,31,8),(32,31000,NULL,NULL,NULL,NULL,NULL,1.5,1.5,32,10);
/*!40000 ALTER TABLE `sale_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `customerId` int DEFAULT NULL,
  `amountDue` double NOT NULL,
  `amountPaid` double NOT NULL DEFAULT '0',
  `dueDate` datetime(3) DEFAULT NULL,
  `paymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalSaleAmount` double NOT NULL,
  `discount` double NOT NULL DEFAULT '0',
  `billNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_billNumber_key` (`billNumber`),
  KEY `sales_customerId_fkey` (`customerId`),
  CONSTRAINT `sales_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'2025-12-01 09:12:44.790',1,0,50000,NULL,'PAID',50000,0,NULL),(2,'2025-12-01 09:15:56.525',1,2000,48000,NULL,'PARTIAL',50000,0,NULL),(3,'2025-12-01 09:29:41.082',1,0,50000,NULL,'PAID',50000,0,NULL),(13,'2025-12-01 09:43:54.574',1,0,65000,NULL,'PAID',65000,0,NULL),(14,'2025-12-01 10:29:48.200',2,5000,50000,NULL,'PARTIAL',55000,0,NULL),(15,'2025-12-01 10:30:57.183',NULL,5000,50000,NULL,'PARTIAL',55000,0,NULL),(16,'2025-12-01 10:34:08.316',2,0,65000,NULL,'PAID',65000,0,NULL),(17,'2025-12-01 10:44:24.200',NULL,5000,50000,NULL,'PARTIAL',55000,0,NULL),(18,'2025-12-01 10:47:08.376',2,0,65000,NULL,'PAID',65000,0,NULL),(19,'2025-12-02 17:54:14.837',2,100,79800,NULL,'PARTIAL',79900,0,NULL),(20,'2025-12-02 17:54:23.349',2,100,79800,NULL,'PARTIAL',79900,0,NULL),(21,'2025-12-02 18:00:34.223',2,0,79900,NULL,'PAID',79900,0,NULL),(22,'2025-12-02 18:04:33.509',2,1900,78000,NULL,'PARTIAL',79900,0,NULL),(23,'2025-12-02 18:18:30.162',1,9900,70000,NULL,'PARTIAL',79900,0,NULL),(24,'2025-12-02 21:07:40.589',1,189000,21000,NULL,'PARTIAL',210000,0,NULL),(25,'2025-12-02 21:17:16.230',2,0,20000,NULL,'PAID',20000,0,NULL),(26,'2025-12-02 21:17:28.346',2,18000,2000,NULL,'PARTIAL',20000,0,NULL),(27,'2025-12-02 21:17:34.548',2,0,20000,NULL,'PAID',20000,0,NULL),(28,'2025-12-02 21:18:57.752',2,0,20000,NULL,'PAID',20000,0,NULL),(29,'2025-12-02 21:21:41.163',2,-1200,41200,NULL,'PARTIAL',40000,0,NULL),(30,'2025-12-02 21:21:45.241',2,-1200,41200,NULL,'PARTIAL',40000,0,NULL),(31,'2025-12-02 21:22:19.509',2,-1200,41200,NULL,'PARTIAL',40000,0,NULL),(32,'2025-12-02 21:57:35.795',2,-900,31900,NULL,'PARTIAL',31000,0,NULL);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','test@gmail.com','$2b$10$PhRTORroKHah0CWssGnao.11fmZq4vPXs9.Z/.YdiNQboQY2FW39O','2025-12-01 09:07:42.395'),(2,'Test User','test1764584988008@test.com','$2b$10$52ZGdKV5DAZg5Ug7cCyaH.6oVVw6PHNsnagpd6kQqueRKEZ5TfZwS','2025-12-01 10:29:48.150'),(3,'Test User','test1764585057044@test.com','$2b$10$cLzqie7wwQdg6ft/shDEqumCJTjlSSK9wZXC0snnIxSMYuG7iz6Tm','2025-12-01 10:30:57.140'),(4,'Test User','test1764585864057@test.com','$2b$10$gW0INKQ7hZfL/gBivNt50OWjMhnfU5wA.o9BCu/4wx4J5CWeTF1Q.','2025-12-01 10:44:24.166'),(5,'sid','raikarsiddhanth@gmail.com','$2b$10$6t1EbZuc086o5adRgpuPhu1vp89c.hBI7suQB1sA.6hEqLKBET6vq','2025-12-01 20:46:02.307');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-03 15:34:20
