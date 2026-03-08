-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-03-2026 a las 01:02:50
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `comarcas_1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `departamento_id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `imagen_mapa` varchar(250) NOT NULL DEFAULT '',
  `imagen_carta` varchar(250) NOT NULL DEFAULT '',
  `imagen_fondo` varchar(250) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `departamento`
--

INSERT INTO `departamento` (`departamento_id`, `nombre`, `imagen_mapa`, `imagen_carta`, `imagen_fondo`) VALUES
(1, 'PRINGLES', '', 'pringlesTarjeta.png', 'fondoPringles.png'),
(2, 'AYACUCHO', '', 'ayacuchoTarjeta.png', 'fondoAyacucho.png'),
(3, 'BELGRANO', '', 'belgranoTarjeta.png', 'fondoBelgrano.png'),
(4, 'CHACABUCO', '', 'chacabucoTarjeta.png', 'fondoChacabuco.png'),
(5, 'DUPUY', '', 'dupuyTarjeta.png', 'fondoDupuy.png'),
(6, 'JUNIN', '', 'juninTarjeta.png', 'fondoJunin.png'),
(7, 'PEDERNERA', '', 'pederneraTarjeta.png', 'fondoPedernera.png'),
(8, 'PUYRREDÓN', '', 'pueyrredonTarjeta.png', 'fondoPuyrredon.png'),
(9, 'SAN MARTÍN', '', 'sanMartinTarjeta.png', 'fondoSanMartin.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logro`
--

CREATE TABLE `logro` (
  `logro_id` int(11) NOT NULL,
  `paraje_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `tiempo` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paraje`
--

CREATE TABLE `paraje` (
  `id` int(11) NOT NULL,
  `departamento_id` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `silabas` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `paraje`
--

INSERT INTO `paraje` (`id`, `departamento_id`, `nombre`, `silabas`) VALUES
(1, 1, 'El Trapiche', 'El|Tra-pi-che'),
(2, 1, 'Estancia Grande', 'Es-tan-cia|Gran-de'),
(3, 1, 'La Toma', 'La|To-ma'),
(4, 1, 'Carolina', 'Ca-ro-li-na'),
(5, 1, 'Fraga', 'Fra-ga'),
(6, 1, 'Juan Llerena', 'Juan|Lle-re-na'),
(7, 1, 'Saladillo', 'Sa-la-di-llo'),
(8, 1, 'La Bajada', 'La|Ba-ja-da'),
(9, 1, 'La Florida', 'La|Flo-ri-da'),
(10, 1, 'Riocito', 'Rio-ci-to'),
(11, 1, 'Arroyo Barranquita', 'Ar-ro-yo|Ba-rran-qui-ta'),
(12, 1, 'Balde de la Isla', 'Bal-de|de|la|Is-la'),
(13, 1, 'Baldecitos', 'Bal-de-ci-tos'),
(14, 1, 'Cañada Honda', 'Ca-ña-da|Hon-da'),
(15, 1, 'Comandante Granville', 'Co-man-dan-te|Gran-ville'),
(16, 1, 'Cuatro Esquinas', 'Cua-tro|Es-qui-nas'),
(17, 1, 'El Amago', 'El|A-ma-go'),
(18, 1, 'El Durazno', 'El|Du-raz-no'),
(19, 1, 'El Manantial', 'El|Ma-nan-tial'),
(20, 1, 'El Zapallar', 'El|Za-pa-llar'),
(21, 1, 'Eleodoro Lobos', 'E-le-o-do-ro|Lo-bos'),
(22, 1, 'Juan W. Gez', 'Juan|W.|Gez'),
(23, 1, 'La Arenilla', 'La|A-re-ni-lla'),
(24, 1, 'La Atalaya', 'La|A-ta-la-ya'),
(25, 1, 'La Cumbre', 'La|Cum-bre'),
(26, 1, 'La Petra', 'La|Pe-tra'),
(27, 1, 'La Puerta', 'La|Puer-ta'),
(28, 1, 'Las Totoras', 'Las|To-to-ras'),
(29, 1, 'Los Membrillos', 'Los|Mem-bri-llos'),
(30, 1, 'Los Pocitos', 'Los|Po-ci-tos'),
(31, 1, 'Pampa del Tamboreo', 'Pam-pa|del|Tam-bo-re-o'),
(32, 1, 'Paso de las Carretas', 'Pa-so|de|las|Ca-rre-tas'),
(33, 1, 'Paso del Rey', 'Pa-so|del|Rey'),
(34, 1, 'Puerta de Pancanta', 'Puer-ta|de|Pan-can-ta'),
(35, 1, 'Río Grande', 'Río|Gran-de'),
(36, 1, 'San Gregorio', 'San|Gre-go-rio'),
(37, 1, 'Valle de Pancanta', 'Va-lle|de|Pan-can-ta'),
(38, 1, 'Virorco', 'Vi-ror-co'),
(39, 1, 'El Guanaco', 'El|Gua-na-co'),
(40, 2, 'Agro Candelaria', 'A-gro|Can-de-la-ria'),
(41, 2, 'Balde de Azcurra', 'Bal-de|de|Az-cu-rra'),
(42, 2, 'Balde de Puertas', 'Bal-de|de|Puer-tas'),
(43, 2, 'Balde de Quines', 'Bal-de|de|Qui-nes'),
(44, 2, 'Baldecito', 'Bal-de-ci-to'),
(45, 2, 'Barzola', 'B-a-r-z-o-l-a'),
(46, 2, 'Bella Vista', 'Be-lla|Vis-ta'),
(47, 2, 'Candelaria', 'Can-de-la-ria'),
(48, 2, 'El Bañado', 'El|Ba-ña-do'),
(49, 2, 'El Cadillo', 'El|Ca-di-llo'),
(50, 2, 'El Chañar', 'El|Cha-ñar'),
(51, 2, 'El Retamo', 'El|Re-ta-mo'),
(52, 2, 'El Vinagrillo', 'El|Vi-na-gri-llo'),
(53, 2, 'El Zampal', 'El|Zam-pal'),
(54, 2, 'El Zapallar', 'El|Za-pa-llar'),
(55, 2, 'La Aguada', 'La|A-gua-da'),
(56, 2, 'La Botija', 'La|Bo-ti-ja'),
(57, 2, 'La Candela', 'La|Can-de-la'),
(58, 2, 'La Chañarienta', 'La|Cha-ña-rien-ta'),
(59, 2, 'La Leona', 'La|Le-o-na'),
(60, 2, 'La Majada', 'La|Ma-ja-da'),
(61, 2, 'La Selva', 'La|Sel-va'),
(62, 2, 'La Tranca', 'La|Tran-ca'),
(63, 2, 'La Venecia', 'La|Ve-ne-cia'),
(64, 2, 'Leandro N. Alem', 'Le-an-dro|N.|A-lem'),
(65, 2, 'Lomas Blancas', 'Lo-mas|Blan-cas'),
(66, 2, 'Luján', 'Lu-ján'),
(67, 2, 'Punta Negra', 'Pun-ta|Ne-gra'),
(68, 2, 'Quines', 'Qui-nes'),
(69, 2, 'Río Juan Gómez', 'Río|Juan|Gó-me(z)'),
(70, 2, 'San Francisco del Monte de Oro', 'San|Fran-cis-co|del|Mon-te|de|O-ro'),
(71, 2, 'San Ignacio', 'San|Ig-na-cio'),
(72, 2, 'San Roque', 'San|Ro-que'),
(73, 2, 'San Vicente', 'San|Vi-cen-te'),
(74, 2, 'Santa Rosa de Cantantal', 'San-ta|Ro-sa|de|Can-tan-tal'),
(75, 3, 'Los Manantiales', 'Los|Ma-nan-tia-les'),
(76, 3, 'La Calera', 'La|Ca-le-ra'),
(77, 3, 'Nogolí', 'No-go-lí'),
(78, 3, 'Villa de la Quebrada', 'Vi-lla|de|la|Que-bra-da'),
(79, 3, 'Alto Tavira', 'Al-to|Ta-vi-ra'),
(80, 3, 'Árbol Solo', 'Ár-bol|So-lo'),
(81, 3, 'Bajo del Durazno', 'Ba-jo|del|Du-raz-no'),
(82, 3, 'Barrial', 'Ba-rrial'),
(83, 3, 'Bella Estancia', 'Be-lla|Es-tan-cia'),
(84, 3, 'Buen Orden', 'Buen|Or-den'),
(85, 3, 'Cabeza de Vaca', 'Ca-be-za|de|Va-ca'),
(86, 3, 'Cañada de Vilán', 'Ca-ña-da|de|Vi-lán'),
(87, 3, 'Divisadero', 'Di-vi-sa-de-ro'),
(88, 3, 'El Chañar', 'El|Cha-ñar'),
(89, 3, 'El Dichoso', 'El|Di-cho-so'),
(90, 3, 'El Gigante', 'El|Gi-gan-te'),
(91, 3, 'El Jarillal', 'El|Ja-ri-llal'),
(92, 3, 'El Milagro', 'El|Mi-la-gro'),
(93, 3, 'El Ramblón', 'El|Ram-blón'),
(94, 3, 'El Recodo', 'El|Re-co-do'),
(95, 3, 'El Sosiego', 'El|So-sie-go'),
(96, 3, 'Hualtarán', 'Hual-ta-rán'),
(97, 3, 'La Aurora', 'La|Au-ro-ra'),
(98, 3, 'La Perlita', 'La|Per-li-ta'),
(99, 3, 'Las Brisas', 'Las|Bri-sas'),
(100, 3, 'Las Lagunitas', 'Las|La-gu-ni-tas'),
(101, 3, 'Los Araditos', 'Los|A-ra-di-tos'),
(102, 3, 'Los Cerrillos', 'Los|Ce-rri-llos'),
(103, 3, 'Los Ramblones', 'Los|Ram-blo-nes'),
(104, 3, 'Los Parecidos', 'Los|Pa-re-ci-dos'),
(105, 3, 'Naranjo Esquina', 'Na-ran-jo|Es-qui-na'),
(106, 3, 'Nogoli', 'No-go-li'),
(107, 3, 'Pozo del Tala', 'Po-zo|del|Ta-la'),
(108, 3, 'Puerta de la Quebrada', 'Puer-ta|de|la|Que-bra-da'),
(109, 3, 'Represa del Carmen', 'Re-pre-sa|del|Car-men'),
(110, 3, 'San Antonio', 'San|An-to-nio'),
(111, 3, 'San Isidro', 'San|I-si-dro'),
(112, 3, 'San Pablo', 'San|Pab-lo'),
(113, 3, 'Vizcachera', 'Viz-ca-che-ra'),
(114, 3, 'Toro Negro', 'To-ro|Ne-gro'),
(115, 4, 'Concarán', 'Con-ca-rán'),
(116, 4, 'Naschel', 'Nas-chel'),
(117, 4, 'Tilisarao', 'Ti-li-sa-ra-o'),
(118, 4, 'Cortaderas', 'Cor-ta-de-ras'),
(119, 4, 'Papagayos', 'Pa-pa-ga-yos'),
(120, 4, 'Renca', 'Ren-ca'),
(121, 4, 'San Pablo', 'San|Pa-blo'),
(122, 4, 'Villa del Carmen', 'Vi-lla|del|Car-men'),
(123, 4, 'Villa Larca', 'Vi-lla|Lar-ca'),
(124, 4, 'Balcarce', 'Bal-car-ce'),
(125, 4, 'Canal Norte', 'Ca-nal|Nor-te'),
(126, 4, 'Cuatro Esquinas', 'Cua-tro|Es-qui-nas'),
(127, 4, 'El Churrasco', 'El|Chu-rras-co'),
(128, 4, 'El Porvenir', 'El|Por-ve-nir'),
(129, 4, 'El Recuerdo', 'El|Re-cuer-do'),
(130, 4, 'El Sauce', 'El|Sau-ce'),
(131, 4, 'El Sifón', 'El|Si-fón'),
(132, 4, 'El Tala', 'El|Ta-la'),
(133, 4, 'La Celestina', 'La|Ce-les-ti-na'),
(134, 4, 'La Estanzuela', 'La|Es-tan-zue-la'),
(135, 4, 'La Suiza', 'La|Sui-za'),
(136, 4, 'Las Canteras', 'Las|Can-te-ras'),
(137, 4, 'Las Rosas', 'Las|Ro-sas'),
(138, 4, 'Los Lobos', 'Los|Lo-bos'),
(139, 4, 'Los Quebrachos', 'Los|Que-bra-chos'),
(140, 5, 'Buena Esperanza', 'Bue-na|Es-pe-ran-za'),
(141, 5, 'Unión', 'U-nión'),
(142, 5, 'Anchorena', 'An-cho-re-na'),
(143, 5, 'Arizona', 'A-ri-zo-na'),
(144, 5, 'Bagual', 'Ba-gual'),
(145, 5, 'Batavia', 'Ba-ta-via'),
(146, 5, 'Fortín El Patria', 'For-tín|El|Pa-tria'),
(147, 5, 'Fortuna', 'For-tu-na'),
(148, 5, 'Nueva Galia', 'Nue-va|Ga-lia'),
(149, 5, 'La Maroma', 'La|Ma-ro-ma'),
(150, 5, 'Los Overos', 'Los|O-ve-ros'),
(151, 5, 'Martín de Loyola', 'Mar-tín|de|Lo-yo-la'),
(152, 5, 'Aurora Puntana', 'Au-ro-ra|Pun-ta-na'),
(153, 5, 'Bajada Nueva', 'Ba-ja-da|Nue-va'),
(154, 5, 'Casimiro Gómez', 'Ca-si-mi-ro|Gó-mez'),
(155, 5, 'Cochequingán', 'Co-che-quin-gán'),
(156, 5, 'Colonia Calzada', 'Co-lo-nia|Cal-za-da'),
(157, 5, 'Colonia La Florida', 'Co-lo-nia|La|Flo-ri-da'),
(158, 5, 'Colonia La Verde', 'Co-lo-nia|La|Ver-de'),
(159, 5, 'Colonia Urdaniz', 'Co-lo-nia|Ur-da-niz'),
(160, 5, 'Coronel Segovia', 'Co-ro-nel|Se-go-via'),
(161, 5, 'El Peje', 'El|Pe-je'),
(162, 5, 'El Porvenir', 'El|Por-ve-nir'),
(163, 5, 'Frisia', 'Fri-sia'),
(164, 5, 'Nueva Constitución', 'Nue-va|Cons-ti-tu-ción'),
(165, 5, 'Usiyal', 'U-si-yal'),
(166, 5, 'Vicente Dupuy', 'Vi-cen-te|Du-puy'),
(167, 6, 'Carpintería', 'Car-pin-te-rí-a'),
(168, 6, 'Cerro de Oro', 'Ce-rro|de|O-ro'),
(169, 6, 'Lafinur', 'La-fi-nur'),
(170, 6, 'Los Cajones', 'Los|Ca-jo-nes'),
(171, 6, 'Los Molles', 'Los|Mo-lles'),
(172, 6, 'Merlo', 'Mer-lo'),
(173, 6, 'Santa Rosa de Conlara', 'San-ta|Ro-sa|de|Con-la-ra'),
(174, 6, 'Talita', 'Ta-li-ta'),
(175, 6, 'Bañado de Cautana', 'Ba-ña-do|de|Cau-ta-na'),
(176, 6, 'Balde de Escudero', 'Bal-de|de|Es-cu-de-ro'),
(177, 6, 'Capilla de Romero', 'Ca-pi-lla|de|Ro-me-ro'),
(178, 6, 'Cerrito Blanco', 'Ce-rri-to|Blan-co'),
(179, 6, 'Injertos', 'In-jer-tos'),
(180, 6, 'La Aguada', 'La|A-gua-da'),
(181, 6, 'La Invernada', 'La|In-ver-na-da'),
(182, 6, 'La Médula', 'La|Mé-du-la'),
(183, 6, 'La Quebrada', 'La|Que-bra-da'),
(184, 6, 'La Unión', 'La|U-nión'),
(185, 6, 'Las Chilcas', 'Las|Chil-cas'),
(186, 6, 'Las Islitas', 'Las|Is-li-tas'),
(187, 6, 'Las Lomitas', 'Las|Lo-mi-tas'),
(188, 6, 'Las Palomas', 'Las|Pa-lo-mas'),
(189, 6, 'Los Argüellos', 'Los|Ar-güe-llos'),
(190, 6, 'Los Chañares', 'Los|Cha-ña-res'),
(191, 6, 'Los Duraznitos', 'Los|Du-raz-ni-tos'),
(192, 6, 'Los Quebrachos', 'Los|Que-bra-chos'),
(193, 6, 'Ojo del Río', 'O-jo|del|Rí-o'),
(194, 6, 'Paso Ancho', 'Pa-so|An-cho'),
(195, 7, 'Justo Daract', 'Jus-to|Da-ract'),
(196, 7, 'Villa Mercedes', 'Vi-lla|Mer-ce-des'),
(197, 7, 'Alto Pelado', 'Al-to|Pe-la-do'),
(198, 7, 'Juan Jorba', 'Juan|Jor-ba'),
(199, 7, 'La Punilla', 'La|Pu-ni-lla'),
(200, 7, 'Lavaisse', 'La-vais-se'),
(201, 7, 'San José del Morro', 'San|Jo-sé|del|Mo-rro'),
(202, 7, 'Villa Salles', 'Vi-lla|Sa-lles'),
(203, 7, 'Villa Reynolds', 'Vi-lla|Rey-nolds'),
(204, 7, 'Caldenadas', 'Cal-de-na-das'),
(205, 7, 'Chalanta', 'Cha-lan-ta'),
(206, 7, 'Coronel Alzogaray', 'Co-ro-nel|Al-zo-ga-ray'),
(207, 7, 'Crámer', 'Crá-mer'),
(208, 7, 'El Centenario', 'El|Cen-te-na-rio'),
(209, 7, 'El Durazno', 'El|Du-raz-no'),
(210, 7, 'Gloria de Dios', 'Glo-ria|de|Di-os'),
(211, 7, 'La Aguada', 'La|A-gua-da'),
(212, 7, 'La Angelina', 'La|An-ge-li-na'),
(213, 7, 'La Esquina', 'La|Es-qui-na'),
(214, 7, 'La Portada', 'La|Por-ta-da'),
(215, 7, 'Las Isletas', 'Las|Is-le-tas'),
(216, 7, 'Las Vizcacheras', 'Las|Viz-ca-che-ras'),
(217, 7, 'Liborio Luna', 'Li-bo-rio|Lu-na'),
(218, 7, 'Pedernera', 'Pe-der-ne-ra'),
(219, 7, 'Pioneros Siglo XXI', 'Pio-ne-ros|Si-glo|XXI'),
(220, 7, 'Río Quinto', 'Río|Quin-to'),
(221, 7, 'Soven', 'So-ven'),
(222, 7, 'Travesía', 'Tra-ve-sí-a'),
(223, 8, 'Alto Pelado', 'Al-to|Pe-la-do'),
(224, 8, 'Alto Pencoso', 'Al-to|Pen-co-so'),
(225, 8, 'Balde', 'Bal-de'),
(226, 8, 'Beazley', 'Beaz-ley'),
(227, 8, 'Cazador', 'Ca-za-dor'),
(228, 8, 'Chosmes', 'Chos-mes'),
(229, 8, 'Desaguadero', 'De-sa-gua-de-ro'),
(230, 8, 'El Volcán', 'El|Vol-cán'),
(231, 8, 'Jarilla', 'Ja-ri-lla'),
(232, 8, 'Juana Koslay', 'Jua-na|Kos-lay'),
(233, 8, 'La Punta', 'La|Pun-ta'),
(234, 8, 'La Florida', 'La|Flo-ri-da'),
(235, 8, 'Potrero de los Funes', 'Po-tre-ro|de|los|Fu-nes'),
(236, 8, 'Salinas del Bebedero', 'Sa-li-nas|del|Be-be-de-ro'),
(237, 8, 'San Jerónimo', 'San|Je-ró-ni-mo'),
(238, 8, 'San Luis', 'San|Luis'),
(239, 8, 'Zanjitas', 'Zan-ji-tas'),
(240, 8, 'Alto Blanco', 'Al-to|Blan-co'),
(241, 8, 'Buena Vista', 'Bue-na|Vis-ta'),
(242, 8, 'Charlone', 'Char-lo-ne'),
(243, 8, 'Colonia Santa Virginia', 'Co-lo-nia|San-ta|Vir-gi-nia'),
(244, 8, 'Donado', 'Do-na-do'),
(245, 8, 'Donovan', 'Do-no-van'),
(246, 8, 'El Lechuza', 'El|Le-chu-za'),
(247, 8, 'El Portezuelo', 'El|Por-te-zue-lo'),
(248, 8, 'El Recuerdo', 'El|Re-cuer-do'),
(249, 8, 'Las Barrancas', 'Las|Ba-rran-cas'),
(250, 8, 'Gorgonta', 'Gor-gon-ta'),
(251, 8, 'Huejeda', 'Hue-je-da'),
(252, 8, 'La Irene', 'La|I-re-ne'),
(253, 8, 'La Seña', 'La|Se-ña'),
(254, 8, 'La Soledad', 'La|So-le-dad'),
(255, 8, 'Las Gamas', 'Las|Ga-mas'),
(256, 8, 'Los Puquios', 'Los|Pu-quios'),
(257, 8, 'Los Coros', 'Los|Co-ros'),
(258, 8, 'Mataco', 'Ma-ta-co'),
(259, 8, 'Paso de las Vacas', 'Pa-so|de|las|Va-cas'),
(260, 8, 'Pescadores', 'Pes-ca-do-res'),
(261, 8, 'Pozo del Carril', 'Po-zo|del|Car-ril'),
(262, 8, 'Punta del Cerro', 'Pun-ta|del|Ce-rro'),
(263, 8, 'San Martín del Alto Negro', 'San|Mar-tín|del|Al-to|Ne-gro'),
(264, 8, 'Santa Rosa', 'San-ta|Ro-sa'),
(265, 8, 'Suyuque Nuevo', 'Su-yu-que|Nue-vo'),
(266, 8, 'Suyuque Viejo', 'Su-yu-que|Vie-jo'),
(267, 8, 'Varela', 'Va-re-la'),
(268, 8, 'Villa Pascua', 'Vi-lla|Pas-cua'),
(269, 9, 'Las Aguadas', 'Las|A-gua-das'),
(270, 9, 'Las Chacras', 'Las|Cha-cras'),
(271, 9, 'Las Lagunas', 'Las|La-gu-nas'),
(272, 9, 'Las Vertientes', 'Las|Ver-tien-tes'),
(273, 9, 'Paso Grande', 'Pa-so|Gran-de'),
(274, 9, 'San Martín', 'San|Mar-tín'),
(275, 9, 'Villa de Praga', 'Vi-lla|de|Pra-ga'),
(276, 9, 'Potrerillo', 'Po-tre-ri-llo'),
(277, 9, 'Alsa', 'Al-sa'),
(278, 9, 'Bajo de Véliz', 'Ba-jo|de|Vé-liz'),
(279, 9, 'Barranca Alta', 'Ba-rran-ca|Al-ta'),
(280, 9, 'Buena Vista', 'Bue-na|Vis-ta'),
(281, 9, 'Cabeza de Novillo', 'Ca-be-za|de|No-vi-llo'),
(282, 9, 'Cañada Quemada', 'Ca-ña-da|Que-ma-da'),
(283, 9, 'Casa de los Tigres', 'Ca-sa|de|los|Ti-gres'),
(284, 9, 'Cerros Largos', 'Ce-rros|Lar-gos'),
(285, 9, 'El Arenal', 'El|A-re-nal'),
(286, 9, 'El Divisadero', 'El|Di-vi-sa-de-ro'),
(287, 9, 'El Estanquito', 'El|Es-tan-qui-to'),
(288, 9, 'El Puesto', 'El|Pues-to'),
(289, 9, 'El Rincón', 'El|Rin-cón'),
(290, 9, 'El Valle', 'El|Va-lle'),
(291, 9, 'Intihuasi', 'In-ti-hua-si'),
(292, 9, 'La Ciénaga', 'La|Cié-na-ga'),
(293, 9, 'La Cocha', 'La|Co-cha'),
(294, 9, 'La Huertita', 'La|Huer-ti-ta'),
(295, 9, 'Las Huertas', 'Las|Huer-tas'),
(296, 9, 'La Ramada', 'La|Ra-ma-da'),
(297, 9, 'La Totora', 'La|To-to-ra'),
(298, 9, 'Los Comederos', 'Los|Co-me-de-ros'),
(299, 9, 'Manantial', 'Ma-nan-tial'),
(300, 9, 'Mesilla del Cura', 'Me-si-lla|del|Cu-ra'),
(301, 9, '9 de Julio', '9|de|Ju-lio'),
(302, 9, 'Piedras Anchas', 'Pie-dras|An-chas'),
(303, 9, 'Puerta Colorada', 'Puer-ta|Co-lo-ra-da'),
(304, 9, 'Quebrada de San Vicente', 'Que-bra-da|de|San|Vi-cen-te'),
(305, 9, 'Rincón del Carmen', 'Rin-cón|del|Car-men'),
(306, 9, 'Rodeo Viejo', 'Ro-de-o|Vie-jo'),
(307, 9, 'San Antonio', 'San|An-to-nio'),
(308, 9, 'San Isidro', 'San|I-si-dro'),
(309, 9, 'San Rafael', 'San|Ra-fa-el'),
(310, 9, 'Santa Rosa', 'San-ta|Ro-sa'),
(311, 9, 'Tala Verde', 'Ta-la|Ver-de');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiempo_mapa`
--

CREATE TABLE `tiempo_mapa` (
  `tiempo_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `tiempo` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `mail` varchar(150) NOT NULL,
  `password_hash` varchar(1000) DEFAULT NULL,
  `imagen_perfil` varchar(250) NOT NULL,
  `rol` varchar(50) DEFAULT 'jugador',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`departamento_id`);

--
-- Indices de la tabla `logro`
--
ALTER TABLE `logro`
  ADD PRIMARY KEY (`logro_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `paraje_id` (`paraje_id`);

--
-- Indices de la tabla `paraje`
--
ALTER TABLE `paraje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departamento_id` (`departamento_id`);

--
-- Indices de la tabla `tiempo_mapa`
--
ALTER TABLE `tiempo_mapa`
  ADD PRIMARY KEY (`tiempo_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `departamento_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `logro`
--
ALTER TABLE `logro`
  MODIFY `logro_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `paraje`
--
ALTER TABLE `paraje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=312;

--
-- AUTO_INCREMENT de la tabla `tiempo_mapa`
--
ALTER TABLE `tiempo_mapa`
  MODIFY `tiempo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `logro`
--
ALTER TABLE `logro`
  ADD CONSTRAINT `logro_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`),
  ADD CONSTRAINT `logro_ibfk_2` FOREIGN KEY (`paraje_id`) REFERENCES `paraje` (`id`);

--
-- Filtros para la tabla `paraje`
--
ALTER TABLE `paraje`
  ADD CONSTRAINT `paraje_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamento` (`departamento_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tiempo_mapa`
--
ALTER TABLE `tiempo_mapa`
  ADD CONSTRAINT `tiempo_mapa_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
