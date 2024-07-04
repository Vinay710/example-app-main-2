--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

-- Started on 2023-02-16 11:44:19

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
-- TOC entry 2 (class 3079 OID 16399)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4225 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 220 (class 1259 OID 17486)
-- Name: featuresdrawn_fid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.featuresdrawn_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.featuresdrawn_fid_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 17487)
-- Name: featuresDrawn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."featuresDrawn" (
    type character varying(100) NOT NULL,
    name character varying(500),
    geom public.geometry,
    fid bigint DEFAULT nextval('public.featuresdrawn_fid_seq'::regclass) NOT NULL
);


ALTER TABLE public."featuresDrawn" OWNER TO postgres;

--
-- TOC entry 4219 (class 0 OID 17487)
-- Dependencies: 221
-- Data for Name: featuresDrawn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."featuresDrawn" (type, name, geom, fid) FROM stdin;
\.


--
-- TOC entry 4064 (class 0 OID 16712)
-- Dependencies: 216
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- TOC entry 4226 (class 0 OID 0)
-- Dependencies: 220
-- Name: featuresdrawn_fid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.featuresdrawn_fid_seq', 1, false);


--
-- TOC entry 4070 (class 2606 OID 17494)
-- Name: featuresDrawn featuresDrawn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."featuresDrawn"
    ADD CONSTRAINT "featuresDrawn_pkey" PRIMARY KEY (fid);


-- Completed on 2023-02-16 11:44:20

--
-- PostgreSQL database dump complete
--

