/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50617
 Source Host           : localhost:3306
 Source Schema         : plane_tb

 Target Server Type    : MySQL
 Target Server Version : 50617
 File Encoding         : 65001

 Date: 03/08/2024 22:06:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tb_dr
-- ----------------------------
DROP TABLE IF EXISTS `tb_dr`;
CREATE TABLE `tb_dr`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `acNum` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '飞机号',
  `cardNum` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '开卡号',
  `defectDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '缺陷描述',
  `defectFullDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '完整缺陷描述',
  `descType` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '描述类型',
  `fullDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '完整描述',
  `isFullDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否完整描述',
  `mainPart` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '主部件',
  `mainZone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '主区域',
  `method` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '处理措施',
  `partFIN` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'FIN/设备号/盖板号',
  `partLoc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '详细位置',
  `partNo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '航材件号',
  `partQty` int(11) NULL DEFAULT NULL COMMENT '数量',
  `partUnit` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '单位',
  `pic` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '照片',
  `processorName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '处理人',
  `processorNum` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '处理人工号',
  `quarterNode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '1/4节点',
  `referTo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '参考资料',
  `relatedCard` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '相关工卡',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `remarkPro` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '工艺备注',
  `reportTime` datetime NULL DEFAULT NULL COMMENT '报告时间',
  `reporterName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '报告人',
  `reporterNum` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '报告人工号',
  `reviseTime` datetime NULL DEFAULT NULL COMMENT '修改时间',
  `reviser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '修改人',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '状态：待处理、草稿、处理中、已处理、已删除',
  `subPart` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '子部件',
  `subZone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '子区域',
  `suggestion` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '建议处理方案',
  `tempSaveByName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '处理人',
  `tempSaveByNum` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '处理人工号',
  `tempSaveTime` datetime NULL DEFAULT NULL COMMENT '处理时间',
  `timePro` datetime NULL DEFAULT NULL COMMENT '时间点',
  `wipNum` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'WIP号',
  `withDraw` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tb_dr
-- ----------------------------
INSERT INTO `tb_dr` VALUES (5, 'B-223G', NULL, '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', NULL, '123', '门上方', NULL, 1, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, 'A_12', '测试备注', NULL, '2024-07-28 00:38:10', '测试', '000000', NULL, NULL, '草稿', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (6, 'N109FE', NULL, NULL, 'N109FE，数量：0 EA', NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'EA', '', '测试', '000000', '2024-07-19 12:00', NULL, NULL, NULL, NULL, '2024-08-01 08:26:45', '测试', '000000', NULL, NULL, '处理中', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `tb_dr` VALUES (7, 'A6-EDV', NULL, '表面划伤', 'A6-EDV表面划伤，数量： EA', NULL, NULL, '0', '', '', NULL, '', '', NULL, 0, 'EA', '', NULL, NULL, '2024-08-05 12:00', NULL, '1212', '', NULL, '2024-07-28 22:14:10', '测试', '000000', NULL, NULL, '草稿', '', '', '', NULL, NULL, NULL, NULL, '', NULL);
INSERT INTO `tb_dr` VALUES (8, 'A6-EDV', NULL, '有凹坑', 'A6-EDV有凹坑，数量： EA', NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'EA', '', NULL, NULL, '2024-08-05 12:00', NULL, '3131', NULL, NULL, '2024-07-28 14:14:32', '测试', '000000', NULL, NULL, '草稿', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `tb_dr` VALUES (9, 'N109FE', NULL, NULL, 'N109FE主货舱，数量： EA', NULL, NULL, '0', NULL, '主货舱', NULL, NULL, NULL, NULL, 0, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, NULL, NULL, NULL, '2024-07-29 08:23:05', '测试', '000000', NULL, NULL, '草稿', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `tb_dr` VALUES (10, 'B-223G', NULL, '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', NULL, '123', '门上方', NULL, 1, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, 'A_12', '测试备注', NULL, '2024-07-27 00:38:10', '测试', '000001', NULL, NULL, '已删除', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (11, 'B-223G', '33', '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量：2 EA', NULL, NULL, '0', '厨房', '客舱', '开卡处理', '123', '门上方', '3', 2, 'EA', '', '测试', '000000', '2024-07-19 12:00', '3', 'A_12', '测试备注111', '3', '2024-08-01 00:29:59', '测试', '000000', NULL, NULL, '处理中', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321222', NULL);
INSERT INTO `tb_dr` VALUES (12, 'B-223G', NULL, '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', NULL, '123', '门上方', NULL, 1, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, 'A_12', '测试备注', NULL, '2024-07-28 08:38:10', '测试', '000000', NULL, NULL, '草稿', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (13, 'B-223G', NULL, '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', NULL, '123', '门上方', NULL, 1, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, 'A_12', '测试备注', NULL, '2024-07-28 08:38:10', '测试', '000000', NULL, NULL, '草稿', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (14, 'B-223G', NULL, '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', NULL, '123', '门上方', NULL, 1, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, 'A_12', '测试备注', NULL, '2024-07-28 08:38:10', '测试', '000000', NULL, NULL, '草稿', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (15, 'B-223G', NULL, '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', NULL, '123', '门上方', NULL, 1, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, 'A_12', '测试备注', NULL, '2024-07-28 00:38:10', '测试', '000000', NULL, NULL, '草稿', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (16, 'B-223G', '1212333', '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', '开卡处理', '123', '门上方', '121333', 1, 'EA', '', '水手', '000003', '2024-07-19 12:00', '121', 'A_12', '测试备注', '121', '2024-07-26 16:38:10', '测试', '000000', NULL, NULL, '已处理', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (17, 'B-223G', NULL, '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', NULL, '123', '门上方', NULL, 1, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, 'A_12', '测试备注', NULL, '2024-07-28 08:38:10', '测试', '000000', NULL, NULL, '草稿', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (18, 'B-223G', '221133', '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量 1EA', NULL, NULL, '0', '厨房', '客舱', '开卡处理', '123', '门上方', '2', 1, 'EA', '', NULL, NULL, '2024-07-19 12:00', '1', 'A_12', '测试备注', '测试', '2024-07-28 00:38:10', '测试', '000000', NULL, NULL, '处理中', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (19, 'B-223G', NULL, '表面划伤', 'B-223G客舱1号门厨房工作台表面划伤，数量：1 EA', NULL, NULL, '0', '厨房', '客舱', NULL, '123', '门上方', NULL, 1, 'EA', '', '测试', '000000', '2024-07-19 12:00', NULL, 'A_12', '测试备注', NULL, '2024-08-01 07:53:08', '测试', '000000', NULL, NULL, '处理中', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (20, 'B-223G', '12313', '表面划伤', '客舱1号门厨房工作台表面划伤，数量：1 EA', NULL, NULL, '0', '厨房', '客舱', '开卡处理', '123', '门上方', '333', 1, 'EA', '', '测试', '000000', '2024-07-19 12:00', '222', 'A_12', '测试备注', '111', '2024-08-01 00:57:10', '测试', '000000', NULL, NULL, '已处理', '工作台', '1号门', '在位修理', NULL, NULL, NULL, NULL, '321', NULL);
INSERT INTO `tb_dr` VALUES (21, 'B-223G', NULL, '有凹坑', '客舱有凹坑', NULL, NULL, '1', NULL, '客舱', NULL, NULL, NULL, NULL, NULL, 'EA', '', NULL, NULL, '2024-07-19 12:00', NULL, '1212', NULL, NULL, '2024-08-03 11:30:34', '水手', '000001', NULL, NULL, '已删除', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `tb_dr` VALUES (22, 'B-223G', NULL, '不工作', '111111厨房烤箱不工作', NULL, NULL, '1', '厨房', '111', NULL, '1212', '21', NULL, 12, 'EA', '/public/upload_pic/202408/000001_20240803193925625.jpg|/public/upload_pic/202408/000001_20240803193939956.jpg', NULL, NULL, '2024-07-19 12:00', NULL, '111', '21212', NULL, '2024-08-03 11:40:13', '水手', '000001', NULL, NULL, '已删除', '烤箱', '111', '拆装（重新安装）', NULL, NULL, NULL, NULL, '12121', NULL);
INSERT INTO `tb_dr` VALUES (23, 'B-223G', '12313', '有凹坑', '客舱121厨房烤箱有凹坑', NULL, NULL, '1', '厨房', '客舱', '开卡处理', '1212121', '1212', '12313', 1, 'EA', '/public/upload_pic/202408/000004_20240803203315844.jpg|/public/upload_pic/202408/000004_20240803203315850.jpg', '测试', '000000', '2024-08-12 12:00', '1231', '121', '1231312', '1231231111', '2024-08-01 12:33:35', '员工4', '000004', NULL, NULL, '已处理', '烤箱', '121', '更换新件', NULL, NULL, NULL, NULL, '121212', NULL);
INSERT INTO `tb_dr` VALUES (24, 'B-223G', '555555555555555', '表面划伤', '驾驶舱55乘务员座椅防撞条表面划伤', NULL, NULL, '1', '乘务员座椅', '驾驶舱', '开卡处理', '5555', '555', '555', 5, 'EA', '/public/upload_pic/202408/000005_20240803205549183.jpg', '测试', '000000', '2024-08-13 12:00', '55', '5', '55555', '5', '2024-08-03 04:58:15', '员工5', '000005', NULL, NULL, '已处理', '防撞条', '55', '拆装（重新安装）', NULL, NULL, NULL, NULL, '55555', NULL);

-- ----------------------------
-- Table structure for tb_lines
-- ----------------------------
DROP TABLE IF EXISTS `tb_lines`;
CREATE TABLE `tb_lines`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `qtn` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '1/4节点',
  `value` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '编号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tb_lines
-- ----------------------------
INSERT INTO `tb_lines` VALUES (1, '2024-07-19 12:00', 'B-223G');
INSERT INTO `tb_lines` VALUES (2, '2024-08-05 12:00', 'A6-EDV');
INSERT INTO `tb_lines` VALUES (3, '2024-07-19 12:00', 'N109FE');

-- ----------------------------
-- Table structure for tb_user
-- ----------------------------
DROP TABLE IF EXISTS `tb_user`;
CREATE TABLE `tb_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `role` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色，1：管理员，2：员工',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tb_user
-- ----------------------------
INSERT INTO `tb_user` VALUES (1, '000000', '000000', '测试', '15078552193', '1，2');
INSERT INTO `tb_user` VALUES (2, '000001', '000001', '水手', '15077777777', '2');
INSERT INTO `tb_user` VALUES (3, '000003', '000003', '管理员2号', '15077777777', '1');
INSERT INTO `tb_user` VALUES (4, '000004', '000004', '员工4', '15077777777', '2');
INSERT INTO `tb_user` VALUES (5, '000005', '000005', '员工5', '15077777777', '2');

-- ----------------------------
-- Table structure for tb_user_lines
-- ----------------------------
DROP TABLE IF EXISTS `tb_user_lines`;
CREATE TABLE `tb_user_lines`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `lineId` int(11) NULL DEFAULT NULL COMMENT '飞机号id',
  `lineQtn` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '飞机号1/4节点',
  `lineValue` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '飞机号',
  `userId` int(11) NULL DEFAULT NULL COMMENT '工号id',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '员工',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tb_user_lines
-- ----------------------------
INSERT INTO `tb_user_lines` VALUES (1, 1, '2024-07-19 12:00', 'B-223G', 1, '000000');
INSERT INTO `tb_user_lines` VALUES (2, 2, '2024-08-05 12:00', 'A6-EDV', 1, '000000');
INSERT INTO `tb_user_lines` VALUES (3, 3, '2024-07-19 12:00', 'N109FE', 1, '000000');
INSERT INTO `tb_user_lines` VALUES (4, 1, '2024-07-19 12:00', 'B-223G', 1, '000001');
INSERT INTO `tb_user_lines` VALUES (5, 1, '2024-08-12 12:00', 'B-223G', 4, '000004');
INSERT INTO `tb_user_lines` VALUES (6, 1, '2024-08-13 12:00', 'B-223G', 5, '000005');

SET FOREIGN_KEY_CHECKS = 1;
