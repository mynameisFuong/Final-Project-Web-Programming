--
-- PostgreSQL database dump
--

\restrict fh87rLpz9WhRRARM2dRIOKFGleLXzCkB5CvYPSbfVLEEUuI7yOmN2iWaKzqL7US

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-04-07 19:22:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16528)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 898 (class 1247 OID 16594)
-- Name: device_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.device_status AS ENUM (
    'TOT',
    'HONG',
    'DANG_SUA_CHUA'
);


--
-- TOC entry 901 (class 1247 OID 16602)
-- Name: report_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.report_status AS ENUM (
    'CHO_XU_LY',
    'DANG_XU_LY',
    'DA_XU_LY'
);


--
-- TOC entry 892 (class 1247 OID 16574)
-- Name: room_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.room_status AS ENUM (
    'HOAT_DONG',
    'DANG_SUA_CHUA',
    'KHONG_SU_DUNG'
);


--
-- TOC entry 895 (class 1247 OID 16582)
-- Name: room_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.room_type AS ENUM (
    'LY_THUYET',
    'PHONG_MAY',
    'THI_NGHIEM',
    'HOI_TRUONG',
    'KHAC'
);


--
-- TOC entry 889 (class 1247 OID 16566)
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'ADMIN',
    'TECHNICIAN',
    'USER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16692)
-- Name: damage_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.damage_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_id uuid NOT NULL,
    reporter_id uuid NOT NULL,
    description text NOT NULL,
    status public.report_status DEFAULT 'CHO_XU_LY'::public.report_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 16639)
-- Name: device_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.device_types (
    id integer NOT NULL,
    type_name character varying(100) NOT NULL,
    description text
);


--
-- TOC entry 220 (class 1259 OID 16638)
-- Name: device_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.device_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 220
-- Name: device_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.device_types_id_seq OWNED BY public.device_types.id;


--
-- TOC entry 222 (class 1259 OID 16649)
-- Name: devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.devices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    device_type_id integer NOT NULL,
    device_code character varying(30) NOT NULL,
    device_name character varying(150) NOT NULL,
    status public.device_status DEFAULT 'TOT'::public.device_status NOT NULL,
    entry_date date NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 16672)
-- Name: repair_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repair_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_id uuid NOT NULL,
    technician_id uuid NOT NULL,
    repair_date date NOT NULL,
    description text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT repair_history_repair_date_check CHECK ((repair_date <= CURRENT_DATE))
);


--
-- TOC entry 219 (class 1259 OID 16626)
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_code character varying(20) NOT NULL,
    room_name character varying(100) NOT NULL,
    room_type public.room_type NOT NULL,
    capacity smallint NOT NULL,
    location character varying(100),
    status public.room_status DEFAULT 'HOAT_DONG'::public.room_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT rooms_capacity_check CHECK ((capacity > 0))
);


--
-- TOC entry 218 (class 1259 OID 16609)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(100),
    role public.user_role DEFAULT 'USER'::public.user_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    failed_attempts smallint DEFAULT 0 NOT NULL,
    locked_until timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 4723 (class 2604 OID 16642)
-- Name: device_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_types ALTER COLUMN id SET DEFAULT nextval('public.device_types_id_seq'::regclass);


--
-- TOC entry 4920 (class 0 OID 16692)
-- Dependencies: 224
-- Data for Name: damage_reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.damage_reports (id, device_id, reporter_id, description, status, created_at, updated_at) FROM stdin;
40000000-0000-0000-0000-000000000001	20000000-0000-0000-0000-000000000004	00000000-0000-0000-0000-000000000006	Điều hòa phòng A101 không lạnh, thổi ra gió ấm. Tiết học buổi chiều rất nóng, ảnh hưởng đến việc học.	CHO_XU_LY	2026-04-02 18:57:17.876252+07	2026-04-02 18:57:17.876252+07
40000000-0000-0000-0000-000000000002	20000000-0000-0000-0000-000000000016	00000000-0000-0000-0000-000000000007	Màn hình máy số 3 phòng B101 bị sọc ngang, không dùng được. Sinh viên phải ngồi dồn sang máy khác.	DANG_XU_LY	2026-04-02 18:57:17.876252+07	2026-04-02 18:57:17.876252+07
40000000-0000-0000-0000-000000000003	20000000-0000-0000-0000-000000000006	00000000-0000-0000-0000-000000000008	Máy chiếu phòng A102 hình bị mờ, nhìn không rõ chữ từ cuối phòng. Ảnh hưởng buổi học ngày mai 8:00.	DANG_XU_LY	2026-04-02 18:57:17.876252+07	2026-04-02 18:57:17.876252+07
40000000-0000-0000-0000-000000000004	20000000-0000-0000-0000-000000000028	00000000-0000-0000-0000-000000000009	Micro cài áo phòng hội trường D001 không sạc được, dùng vài phút là hết pin. Hội thảo tuần sau cần dùng gấp.	DA_XU_LY	2026-04-02 18:57:17.876252+07	2026-04-02 18:57:17.876252+07
40000000-0000-0000-0000-000000000005	20000000-0000-0000-0000-000000000013	00000000-0000-0000-0000-000000000006	Máy số 3 phòng B101 không bật được. Nhấn nút nguồn không có phản ứng gì.	DA_XU_LY	2026-04-02 18:57:17.876252+07	2026-04-02 18:57:17.876252+07
40000000-0000-0000-0000-000000000006	20000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000007	Máy chiếu A101 bị lỗi kết nối HDMI, phải dùng VGA. Hình ảnh không sắc nét.	DA_XU_LY	2026-04-02 18:57:17.876252+07	2026-04-02 18:57:17.876252+07
40000000-0000-0000-0000-000000000007	20000000-0000-0000-0000-000000000010	00000000-0000-0000-0000-000000000008	Điều hòa phòng A201 có mùi khét, phát tiếng kêu lạ khi chạy. Đề nghị kiểm tra gấp để đảm bảo an toàn.	DANG_XU_LY	2026-04-02 18:57:17.876252+07	2026-04-02 18:57:17.876252+07
\.


--
-- TOC entry 4917 (class 0 OID 16639)
-- Dependencies: 221
-- Data for Name: device_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.device_types (id, type_name, description) FROM stdin;
1	Máy chiếu	Máy chiếu hình ảnh lên màn hình/tường
2	Màn hình chiếu	Màn hình treo tường dùng với máy chiếu
3	Điều hòa	Máy điều hòa nhiệt độ
4	Quạt trần	Quạt trần lắp cố định
5	Máy tính bàn	Máy tính để bàn (desktop)
6	Màn hình máy tính	Màn hình LCD/LED kết nối máy tính
7	Bảng trắng	Bảng viết dùng bút lông
8	Bảng đen	Bảng viết dùng phấn
9	Loa	Hệ thống loa âm thanh
10	Micro	Micro có dây hoặc không dây
11	Camera	Camera giám sát/ghi hình
12	Tivi	TV màn hình phẳng
13	Bàn học	Bàn học sinh viên
14	Ghế	Ghế ngồi sinh viên/giảng viên
15	Bục giảng	Bục đứng giảng viên
\.


--
-- TOC entry 4918 (class 0 OID 16649)
-- Dependencies: 222
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.devices (id, room_id, device_type_id, device_code, device_name, status, entry_date, description, created_at, updated_at) FROM stdin;
20000000-0000-0000-0000-000000000001	10000000-0000-0000-0000-000000000001	1	MC-A101-01	Máy chiếu Epson EB-X51	TOT	2022-08-15	Độ sáng 3600 lumens, kết nối HDMI/VGA	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000002	10000000-0000-0000-0000-000000000001	2	MH-A101-01	Màn hình chiếu 100 inch	TOT	2022-08-15	Màn kéo tay, treo tường	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000003	10000000-0000-0000-0000-000000000001	3	DC-A101-01	Điều hòa Daikin 2HP	TOT	2021-06-10	Điều hòa treo tường, inverter	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000004	10000000-0000-0000-0000-000000000001	3	DC-A101-02	Điều hòa Daikin 2HP	HONG	2021-06-10	Bộ lọc bị tắc, cần vệ sinh	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000005	10000000-0000-0000-0000-000000000001	7	BB-A101-01	Bảng trắng từ 1.2x2.4m	TOT	2021-06-10	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000006	10000000-0000-0000-0000-000000000002	1	MC-A102-01	Máy chiếu Epson EB-X51	DANG_SUA_CHUA	2022-08-15	Bóng đèn bị mờ, đang chờ thay	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000007	10000000-0000-0000-0000-000000000002	9	LOA-A102-01	Loa JBL Series 3 (cặp)	TOT	2023-01-20	Loa 2.0, công suất 60W	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000008	10000000-0000-0000-0000-000000000002	3	DC-A102-01	Điều hòa LG 2HP	TOT	2022-05-05	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000009	10000000-0000-0000-0000-000000000003	1	MC-A201-01	Máy chiếu BenQ MH550	HONG	2020-09-01	Hỏng bo mạch nguồn	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000010	10000000-0000-0000-0000-000000000003	3	DC-A201-01	Điều hòa Panasonic 2.5HP	HONG	2020-09-01	Gas bị rò rỉ	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000011	10000000-0000-0000-0000-000000000004	5	PC-B101-01	Máy tính Dell OptiPlex 3080	TOT	2023-03-10	Core i5-10500, RAM 8GB, SSD 256GB	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000012	10000000-0000-0000-0000-000000000004	5	PC-B101-02	Máy tính Dell OptiPlex 3080	TOT	2023-03-10	Core i5-10500, RAM 8GB, SSD 256GB	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000013	10000000-0000-0000-0000-000000000004	5	PC-B101-03	Máy tính Dell OptiPlex 3080	HONG	2023-03-10	Không lên nguồn, nghi hỏng PSU	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000014	10000000-0000-0000-0000-000000000004	6	MH-B101-01	Màn hình Dell 22 inch E2222H	TOT	2023-03-10	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000015	10000000-0000-0000-0000-000000000004	6	MH-B101-02	Màn hình Dell 22 inch E2222H	TOT	2023-03-10	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000016	10000000-0000-0000-0000-000000000004	6	MH-B101-03	Màn hình Dell 22 inch E2222H	HONG	2023-03-10	Màn hình bị sọc ngang	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000017	10000000-0000-0000-0000-000000000004	1	MC-B101-01	Máy chiếu ViewSonic PA503X	TOT	2023-03-10	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000018	10000000-0000-0000-0000-000000000004	3	DC-B101-01	Điều hòa Samsung 2HP Wind-Free	TOT	2023-03-10	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000019	10000000-0000-0000-0000-000000000005	5	PC-B102-01	Máy tính HP ProDesk 400 G7	TOT	2022-09-01	Core i5-10500T, RAM 8GB	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000020	10000000-0000-0000-0000-000000000005	5	PC-B102-02	Máy tính HP ProDesk 400 G7	DANG_SUA_CHUA	2022-09-01	Đang cài lại hệ điều hành	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000021	10000000-0000-0000-0000-000000000005	3	DC-B102-01	Điều hòa Toshiba 2HP	TOT	2022-09-01	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000022	10000000-0000-0000-0000-000000000007	12	TV-C101-01	Tivi Sony 55 inch 4K	TOT	2022-01-15	Dùng để chiếu kết quả thí nghiệm	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000023	10000000-0000-0000-0000-000000000007	3	DC-C101-01	Điều hòa Mitsubishi 1.5HP	TOT	2022-01-15	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000024	10000000-0000-0000-0000-000000000007	11	CAM-C101-01	Camera Hikvision DS-2CD2143G2-I	TOT	2022-01-15	Camera IP 4MP, hồng ngoại	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000025	10000000-0000-0000-0000-000000000009	1	MC-D001-01	Máy chiếu Panasonic PT-VZ575N	TOT	2021-11-20	Máy chiếu chuyên hội trường, 5000 lumens	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000026	10000000-0000-0000-0000-000000000009	9	LOA-D001-01	Hệ thống loa array JBL SRX835P	TOT	2021-11-20	Cặp loa trụ chuyên hội trường	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000027	10000000-0000-0000-0000-000000000009	10	MIC-D001-01	Micro không dây Shure BLX288/PG58	TOT	2021-11-20	Bộ 2 micro không dây	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000028	10000000-0000-0000-0000-000000000009	10	MIC-D001-02	Micro cài áo Sennheiser XSW 1-ME2	HONG	2021-11-20	Pin hết, bộ sạc bị hỏng	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000029	10000000-0000-0000-0000-000000000009	3	DC-D001-01	Điều hòa trung tâm Carrier 5HP	TOT	2021-11-20	\N	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
20000000-0000-0000-0000-000000000030	10000000-0000-0000-0000-000000000009	15	BG-D001-01	Bục giảng gỗ cao cấp	TOT	2021-11-20	Tích hợp ổ cắm điện và cổng HDMI	2026-04-02 18:57:17.836982+07	2026-04-02 18:57:17.836982+07
\.


--
-- TOC entry 4919 (class 0 OID 16672)
-- Dependencies: 223
-- Data for Name: repair_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.repair_history (id, device_id, technician_id, repair_date, description, notes, created_at) FROM stdin;
30000000-0000-0000-0000-000000000001	20000000-0000-0000-0000-000000000006	00000000-0000-0000-0000-000000000003	2025-11-10	Kiểm tra bóng đèn máy chiếu, xác nhận bóng bị mờ do hết tuổi thọ.	Đã đặt mua bóng đèn Epson thay thế, dự kiến 5–7 ngày có hàng.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000002	20000000-0000-0000-0000-000000000004	00000000-0000-0000-0000-000000000003	2025-10-20	Vệ sinh bộ lọc, kiểm tra hệ thống gas.	Bộ lọc tắc nghẽn nặng. Đã vệ sinh xong nhưng phát hiện thêm gas yếu, cần nạp lại.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000003	20000000-0000-0000-0000-000000000004	00000000-0000-0000-0000-000000000004	2025-11-05	Nạp gas R32 và kiểm tra lại toàn bộ hệ thống làm lạnh.	Nạp 500g gas. Máy hoạt động nhưng sau 2 tuần lại báo hỏng, nghi van bị rò.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000004	20000000-0000-0000-0000-000000000013	00000000-0000-0000-0000-000000000003	2025-12-01	Kiểm tra nguồn máy tính, xác nhận PSU bị chết.	Đã thay PSU Seasonic 500W. Máy đã lên nguồn bình thường.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000005	20000000-0000-0000-0000-000000000016	00000000-0000-0000-0000-000000000004	2025-12-05	Kiểm tra bo mạch màn hình, xác định lỗi IC điều khiển gây sọc ngang.	Màn hình cần thay thế toàn bộ, không sửa được bo mạch vì linh kiện ngừng sản xuất. Đề xuất mua mới.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000006	20000000-0000-0000-0000-000000000028	00000000-0000-0000-0000-000000000003	2025-12-10	Kiểm tra bộ sạc micro Sennheiser, xác nhận bộ sạc bị chập mạch bên trong.	Đặt mua bộ sạc thay thế chính hãng. Tạm thời dùng micro dự phòng.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000007	20000000-0000-0000-0000-000000000006	00000000-0000-0000-0000-000000000004	2024-05-15	Vệ sinh ống kính và bộ lọc không khí máy chiếu.	Vệ sinh định kỳ 6 tháng/lần. Máy hoạt động tốt sau bảo dưỡng.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000008	20000000-0000-0000-0000-000000000001	00000000-0000-0000-0000-000000000003	2024-11-20	Bảo dưỡng định kỳ: vệ sinh lọc gió, kiểm tra kết nối HDMI.	Tình trạng tốt, không phát sinh vấn đề.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000009	20000000-0000-0000-0000-000000000009	00000000-0000-0000-0000-000000000003	2025-09-10	Kiểm tra máy chiếu BenQ không lên nguồn.	Bo mạch nguồn bị cháy. Liên hệ hãng báo giá sửa chữa.	2026-04-02 18:57:17.86399+07
30000000-0000-0000-0000-000000000010	20000000-0000-0000-0000-000000000010	00000000-0000-0000-0000-000000000004	2025-09-12	Phát hiện gas R410A bị rò rỉ tại van đấu nối ngoài trời.	Đã hàn vá tạm van rò. Cần thay van mới và nạp lại toàn bộ gas. Dự kiến chi phí ~2 triệu đồng.	2026-04-02 18:57:17.86399+07
\.


--
-- TOC entry 4915 (class 0 OID 16626)
-- Dependencies: 219
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rooms (id, room_code, room_name, room_type, capacity, location, status, created_at, updated_at) FROM stdin;
10000000-0000-0000-0000-000000000001	A101	Phòng học A101	LY_THUYET	50	Tòa A – Tầng 1	HOAT_DONG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000002	A102	Phòng học A102	LY_THUYET	50	Tòa A – Tầng 1	HOAT_DONG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000003	A201	Phòng học A201	LY_THUYET	60	Tòa A – Tầng 2	DANG_SUA_CHUA	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000004	B101	Phòng máy tính B101	PHONG_MAY	40	Tòa B – Tầng 1	HOAT_DONG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000005	B102	Phòng máy tính B102	PHONG_MAY	40	Tòa B – Tầng 1	HOAT_DONG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000006	B201	Phòng máy tính B201	PHONG_MAY	35	Tòa B – Tầng 2	HOAT_DONG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000007	C101	Phòng thí nghiệm Điện tử C101	THI_NGHIEM	30	Tòa C – Tầng 1	HOAT_DONG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000008	C102	Phòng thí nghiệm Hóa C102	THI_NGHIEM	25	Tòa C – Tầng 1	HOAT_DONG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000009	D001	Hội trường lớn D001	HOI_TRUONG	200	Tòa D – Tầng trệt	HOAT_DONG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
10000000-0000-0000-0000-000000000010	A301	Phòng học A301	LY_THUYET	45	Tòa A – Tầng 3	KHONG_SU_DUNG	2026-04-02 18:57:17.795133+07	2026-04-02 18:57:17.795133+07
\.


--
-- TOC entry 4914 (class 0 OID 16609)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password_hash, full_name, email, role, is_active, failed_attempts, locked_until, created_at, updated_at) FROM stdin;
00000000-0000-0000-0000-000000000004	kythuatvien2	$2b$10$wJ8Q1z2Y3X4V5U6T7S8R9OeKpLmNqRsTuVwXyZaAbBcCdDeFgHiJk	Phạm Thị Hoa	hoa.kt@school.edu.vn	TECHNICIAN	t	0	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000009	loptruong_ktpm3	$2b$10$wJ8Q1z2Y3X4V5U6T7S8R9OeKpLmNqRsTuVwXyZaAbBcCdDeFgHiJk	Bùi Quốc Hùng	hung.sv@school.edu.vn	USER	t	0	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000010	locked_user	$2b$10$wJ8Q1z2Y3X4V5U6T7S8R9OeKpLmNqRsTuVwXyZaAbBcCdDeFgHiJk	Trần Thị Oanh	oanh.sv@school.edu.vn	USER	t	5	2026-04-02 19:07:17.745284+07	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000005	kythuatvien3	$2b$10$wJ8Q1z2Y3X4V5U6T7S8R9OeKpLmNqRsTuVwXyZaAbBcCdDeFgHiJk	Hoàng Minh Tuấn	tuan.kt@school.edu.vn	TECHNICIAN	t	0	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000006	loptruong_cntt1	$2b$10$wJ8Q1z2Y3X4V5U6T7S8R9OeKpLmNqRsTuVwXyZaAbBcCdDeFgHiJk	Vũ Thành Long	long.sv@school.edu.vn	USER	t	0	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000007	giangvien_toan	$2b$10$wJ8Q1z2Y3X4V5U6T7S8R9OeKpLmNqRsTuVwXyZaAbBcCdDeFgHiJk	Nguyễn Văn Khoa	khoa.gv@school.edu.vn	USER	t	0	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000002	admin2	$2b$10$d.hMY/lThucWRzco81bSu.3waKafJ/xuGrTqkSwLSCZtlbVZxJ86G	Trần Văn Bình	binh.admin@school.edu.vn	ADMIN	t	0	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000008	loptruong_dtvt2	$2b$10$44jWrsxkFoZzR.OjeHJDtODQENf9l.gOQFgfwDlZxjHyc2iP38LgO	Đặng Thị Mai	mai.sv@school.edu.vn	USER	t	3	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000003	kythuatvien1	$2b$10$clgzlsLG/36EGd9WqPEnkuB2Hm8zUROtwsWkl0pljUDJIS.BVMdIK	Lê Văn Nam	nam.kt@school.edu.vn	TECHNICIAN	t	0	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
00000000-0000-0000-0000-000000000001	admin	$2b$10$dBJRvkTYT0AoD4x.ohAfveFF5VrlK4rkiRyZ50Id53dtwt46y2Hgy	Nguyễn Thị Lan	lan.admin@school.edu.vn	ADMIN	t	0	\N	2026-04-02 18:57:17.745284+07	2026-04-02 18:57:17.745284+07
\.


--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 220
-- Name: device_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.device_types_id_seq', 1, false);


--
-- TOC entry 4760 (class 2606 OID 16702)
-- Name: damage_reports damage_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.damage_reports
    ADD CONSTRAINT damage_reports_pkey PRIMARY KEY (id);


--
-- TOC entry 4747 (class 2606 OID 16646)
-- Name: device_types device_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_types
    ADD CONSTRAINT device_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4749 (class 2606 OID 16648)
-- Name: device_types device_types_type_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_types
    ADD CONSTRAINT device_types_type_name_key UNIQUE (type_name);


--
-- TOC entry 4751 (class 2606 OID 16661)
-- Name: devices devices_device_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_device_code_key UNIQUE (device_code);


--
-- TOC entry 4753 (class 2606 OID 16659)
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 16681)
-- Name: repair_history repair_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_history
    ADD CONSTRAINT repair_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4743 (class 2606 OID 16635)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 4745 (class 2606 OID 16637)
-- Name: rooms rooms_room_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_room_code_key UNIQUE (room_code);


--
-- TOC entry 4737 (class 2606 OID 16625)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4739 (class 2606 OID 16621)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4741 (class 2606 OID 16623)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4761 (class 1259 OID 16716)
-- Name: idx_damage_reports_device; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_damage_reports_device ON public.damage_reports USING btree (device_id);


--
-- TOC entry 4762 (class 1259 OID 16717)
-- Name: idx_damage_reports_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_damage_reports_status ON public.damage_reports USING btree (status);


--
-- TOC entry 4754 (class 1259 OID 16713)
-- Name: idx_devices_room_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_devices_room_id ON public.devices USING btree (room_id);


--
-- TOC entry 4755 (class 1259 OID 16714)
-- Name: idx_devices_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_devices_status ON public.devices USING btree (status);


--
-- TOC entry 4756 (class 1259 OID 16715)
-- Name: idx_repair_history_device; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_repair_history_device ON public.repair_history USING btree (device_id);


--
-- TOC entry 4767 (class 2606 OID 16703)
-- Name: damage_reports damage_reports_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.damage_reports
    ADD CONSTRAINT damage_reports_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- TOC entry 4768 (class 2606 OID 16708)
-- Name: damage_reports damage_reports_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.damage_reports
    ADD CONSTRAINT damage_reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id);


--
-- TOC entry 4763 (class 2606 OID 16667)
-- Name: devices devices_device_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_device_type_id_fkey FOREIGN KEY (device_type_id) REFERENCES public.device_types(id);


--
-- TOC entry 4764 (class 2606 OID 16662)
-- Name: devices devices_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- TOC entry 4765 (class 2606 OID 16682)
-- Name: repair_history repair_history_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_history
    ADD CONSTRAINT repair_history_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- TOC entry 4766 (class 2606 OID 16687)
-- Name: repair_history repair_history_technician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_history
    ADD CONSTRAINT repair_history_technician_id_fkey FOREIGN KEY (technician_id) REFERENCES public.users(id);


-- Completed on 2026-04-07 19:22:21

--
-- PostgreSQL database dump complete
--

\unrestrict fh87rLpz9WhRRARM2dRIOKFGleLXzCkB5CvYPSbfVLEEUuI7yOmN2iWaKzqL7US

