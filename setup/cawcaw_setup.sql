--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5
-- Dumped by pg_dump version 16.1

-- Started on 2024-01-06 00:25:21

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
-- TOC entry 245 (class 1255 OID 82016)
-- Name: decrease_comment_count(); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.decrease_comment_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE cawcaw_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
	RETURN OLD;
END;
$$;


ALTER FUNCTION public.decrease_comment_count() OWNER TO "default";

--
-- TOC entry 242 (class 1255 OID 73749)
-- Name: decrease_follow_counts(); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.decrease_follow_counts() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	
	UPDATE cawcaw_users SET following_count = following_count - 1
	WHERE id = OLD.user_id;
	
	UPDATE cawcaw_users SET followers_count = followers_count - 1
	WHERE id = OLD.follows_id;

	RETURN OLD;
END;
$$;


ALTER FUNCTION public.decrease_follow_counts() OWNER TO "default";

--
-- TOC entry 244 (class 1255 OID 82015)
-- Name: decrease_like_count(); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.decrease_like_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE cawcaw_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
	RETURN OLD;
END;
$$;


ALTER FUNCTION public.decrease_like_count() OWNER TO "default";

--
-- TOC entry 246 (class 1255 OID 82017)
-- Name: increase_comment_count(); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.increase_comment_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE cawcaw_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.increase_comment_count() OWNER TO "default";

--
-- TOC entry 241 (class 1255 OID 73747)
-- Name: increase_follow_counts(); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.increase_follow_counts() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

	UPDATE cawcaw_users SET following_count = following_count + 1
	WHERE id = NEW.user_id;
	
	UPDATE cawcaw_users SET followers_count = followers_count + 1
	WHERE id = NEW.follows_id;

	RETURN NEW;
END;
$$;


ALTER FUNCTION public.increase_follow_counts() OWNER TO "default";

--
-- TOC entry 243 (class 1255 OID 82014)
-- Name: increase_like_count(); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.increase_like_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE cawcaw_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.increase_like_count() OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;


--
-- TOC entry 223 (class 1259 OID 73729)
-- Name: cawcaw_follow_relation; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.cawcaw_follow_relation (
    id integer NOT NULL,
    user_id integer NOT NULL,
    follows_id integer NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.cawcaw_follow_relation OWNER TO "default";

--
-- TOC entry 222 (class 1259 OID 73728)
-- Name: cawcaw_follow_relation_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.cawcaw_follow_relation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cawcaw_follow_relation_id_seq OWNER TO "default";

--
-- TOC entry 2651 (class 0 OID 0)
-- Dependencies: 222
-- Name: cawcaw_follow_relation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.cawcaw_follow_relation_id_seq OWNED BY public.cawcaw_follow_relation.id;


--
-- TOC entry 229 (class 1259 OID 81997)
-- Name: cawcaw_post_comments; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.cawcaw_post_comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL,
    comment character varying(200) NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.cawcaw_post_comments OWNER TO "default";

--
-- TOC entry 228 (class 1259 OID 81996)
-- Name: cawcaw_post_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.cawcaw_post_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cawcaw_post_comments_id_seq OWNER TO "default";

--
-- TOC entry 2652 (class 0 OID 0)
-- Dependencies: 228
-- Name: cawcaw_post_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.cawcaw_post_comments_id_seq OWNED BY public.cawcaw_post_comments.id;


--
-- TOC entry 227 (class 1259 OID 81954)
-- Name: cawcaw_post_likes; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.cawcaw_post_likes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    post_id integer NOT NULL
);


ALTER TABLE public.cawcaw_post_likes OWNER TO "default";

--
-- TOC entry 226 (class 1259 OID 81953)
-- Name: cawcaw_post_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.cawcaw_post_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cawcaw_post_likes_id_seq OWNER TO "default";

--
-- TOC entry 2653 (class 0 OID 0)
-- Dependencies: 226
-- Name: cawcaw_post_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.cawcaw_post_likes_id_seq OWNED BY public.cawcaw_post_likes.id;


--
-- TOC entry 225 (class 1259 OID 81939)
-- Name: cawcaw_posts; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.cawcaw_posts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    text character varying(300) NOT NULL,
    image_url character varying(150),
    likes_count integer DEFAULT 0 NOT NULL,
    comments_count integer DEFAULT 0 NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    search tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, (text)::text)) STORED,
    aspect_ratio real
);


ALTER TABLE public.cawcaw_posts OWNER TO "default";

--
-- TOC entry 224 (class 1259 OID 81938)
-- Name: cawcaw_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.cawcaw_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cawcaw_posts_id_seq OWNER TO "default";

--
-- TOC entry 2654 (class 0 OID 0)
-- Dependencies: 224
-- Name: cawcaw_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.cawcaw_posts_id_seq OWNED BY public.cawcaw_posts.id;


--
-- TOC entry 221 (class 1259 OID 57345)
-- Name: cawcaw_users; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.cawcaw_users (
    id integer NOT NULL,
    display_name character varying(200) NOT NULL,
    username character varying(200) NOT NULL,
    hashed_password character varying(200) NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    description character varying(400),
    followers_count integer DEFAULT 0 NOT NULL,
    following_count integer DEFAULT 0 NOT NULL,
    search tsvector GENERATED ALWAYS AS (((to_tsvector('english'::regconfig, (display_name)::text) || ''::tsvector) || to_tsvector('english'::regconfig, (username)::text))) STORED
);


ALTER TABLE public.cawcaw_users OWNER TO "default";

--
-- TOC entry 220 (class 1259 OID 57344)
-- Name: cawcaw_users_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.cawcaw_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cawcaw_users_id_seq OWNER TO "default";

--
-- TOC entry 2655 (class 0 OID 0)
-- Dependencies: 220
-- Name: cawcaw_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.cawcaw_users_id_seq OWNED BY public.cawcaw_users.id;

--
-- TOC entry 2446 (class 2604 OID 73732)
-- Name: cawcaw_follow_relation id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_follow_relation ALTER COLUMN id SET DEFAULT nextval('public.cawcaw_follow_relation_id_seq'::regclass);


--
-- TOC entry 2454 (class 2604 OID 82000)
-- Name: cawcaw_post_comments id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_comments ALTER COLUMN id SET DEFAULT nextval('public.cawcaw_post_comments_id_seq'::regclass);


--
-- TOC entry 2453 (class 2604 OID 81957)
-- Name: cawcaw_post_likes id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_likes ALTER COLUMN id SET DEFAULT nextval('public.cawcaw_post_likes_id_seq'::regclass);


--
-- TOC entry 2448 (class 2604 OID 81942)
-- Name: cawcaw_posts id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_posts ALTER COLUMN id SET DEFAULT nextval('public.cawcaw_posts_id_seq'::regclass);


--
-- TOC entry 2440 (class 2604 OID 57348)
-- Name: cawcaw_users id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_users ALTER COLUMN id SET DEFAULT nextval('public.cawcaw_users_id_seq'::regclass);


--
-- TOC entry 2476 (class 2606 OID 73734)
-- Name: cawcaw_follow_relation cawcaw_follow_relation_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_follow_relation
    ADD CONSTRAINT cawcaw_follow_relation_pkey PRIMARY KEY (id);


--
-- TOC entry 2487 (class 2606 OID 82003)
-- Name: cawcaw_post_comments cawcaw_posts_comments_p_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_comments
    ADD CONSTRAINT cawcaw_posts_comments_p_key PRIMARY KEY (id);


--
-- TOC entry 2483 (class 2606 OID 81959)
-- Name: cawcaw_post_likes cawcaw_posts_likes_p_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_likes
    ADD CONSTRAINT cawcaw_posts_likes_p_key PRIMARY KEY (id);


--
-- TOC entry 2480 (class 2606 OID 81947)
-- Name: cawcaw_posts cawcaw_posts_p_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_posts
    ADD CONSTRAINT cawcaw_posts_p_key PRIMARY KEY (id);


--
-- TOC entry 2471 (class 2606 OID 57354)
-- Name: cawcaw_users cawcaw_users_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_users
    ADD CONSTRAINT cawcaw_users_pkey PRIMARY KEY (id);


--
-- TOC entry 2473 (class 2606 OID 57356)
-- Name: cawcaw_users cawcaw_users_unique_name_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_users
    ADD CONSTRAINT cawcaw_users_unique_name_key UNIQUE (username);

--
-- TOC entry 2478 (class 2606 OID 73752)
-- Name: cawcaw_follow_relation uniqe_relation; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_follow_relation
    ADD CONSTRAINT uniqe_relation UNIQUE (user_id, follows_id);


--
-- TOC entry 2485 (class 2606 OID 81961)
-- Name: cawcaw_post_likes unique_likes; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_likes
    ADD CONSTRAINT unique_likes UNIQUE (user_id, post_id);

--
-- TOC entry 2481 (class 1259 OID 90129)
-- Name: idx_search_posts; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_search_posts ON public.cawcaw_posts USING gin (search);


--
-- TOC entry 2474 (class 1259 OID 90130)
-- Name: idx_search_users; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_search_users ON public.cawcaw_users USING gin (search);


--
-- TOC entry 2501 (class 2620 OID 82020)
-- Name: cawcaw_post_comments decrease_comment; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER decrease_comment BEFORE DELETE ON public.cawcaw_post_comments FOR EACH ROW EXECUTE FUNCTION public.decrease_comment_count();


--
-- TOC entry 2497 (class 2620 OID 73750)
-- Name: cawcaw_follow_relation decrease_follow; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER decrease_follow BEFORE DELETE ON public.cawcaw_follow_relation FOR EACH ROW EXECUTE FUNCTION public.decrease_follow_counts();


--
-- TOC entry 2499 (class 2620 OID 82019)
-- Name: cawcaw_post_likes decrease_like; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER decrease_like BEFORE DELETE ON public.cawcaw_post_likes FOR EACH ROW EXECUTE FUNCTION public.decrease_like_count();


--
-- TOC entry 2502 (class 2620 OID 82022)
-- Name: cawcaw_post_comments increase_comment; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER increase_comment BEFORE INSERT ON public.cawcaw_post_comments FOR EACH ROW EXECUTE FUNCTION public.increase_comment_count();


--
-- TOC entry 2498 (class 2620 OID 73748)
-- Name: cawcaw_follow_relation increase_follow; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER increase_follow BEFORE INSERT ON public.cawcaw_follow_relation FOR EACH ROW EXECUTE FUNCTION public.increase_follow_counts();


--
-- TOC entry 2500 (class 2620 OID 82018)
-- Name: cawcaw_post_likes increase_like; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER increase_like BEFORE INSERT ON public.cawcaw_post_likes FOR EACH ROW EXECUTE FUNCTION public.increase_like_count();


--
-- TOC entry 2490 (class 2606 OID 73740)
-- Name: cawcaw_follow_relation cawcaw_follow_relation_follows_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_follow_relation
    ADD CONSTRAINT cawcaw_follow_relation_follows_id_fkey FOREIGN KEY (follows_id) REFERENCES public.cawcaw_users(id) ON DELETE CASCADE;


--
-- TOC entry 2491 (class 2606 OID 73735)
-- Name: cawcaw_follow_relation cawcaw_follow_relation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_follow_relation
    ADD CONSTRAINT cawcaw_follow_relation_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.cawcaw_users(id) ON DELETE CASCADE;


--
-- TOC entry 2495 (class 2606 OID 82009)
-- Name: cawcaw_post_comments cawcaw_posts_comments_post_id_fg_key; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_comments
    ADD CONSTRAINT cawcaw_posts_comments_post_id_fg_key FOREIGN KEY (post_id) REFERENCES public.cawcaw_posts(id) ON DELETE CASCADE;


--
-- TOC entry 2496 (class 2606 OID 82004)
-- Name: cawcaw_post_comments cawcaw_posts_comments_user_id_fg_key; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_comments
    ADD CONSTRAINT cawcaw_posts_comments_user_id_fg_key FOREIGN KEY (user_id) REFERENCES public.cawcaw_users(id) ON DELETE CASCADE;


--
-- TOC entry 2492 (class 2606 OID 81948)
-- Name: cawcaw_posts cawcaw_posts_fg_key; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_posts
    ADD CONSTRAINT cawcaw_posts_fg_key FOREIGN KEY (user_id) REFERENCES public.cawcaw_users(id) ON DELETE CASCADE;


--
-- TOC entry 2493 (class 2606 OID 81967)
-- Name: cawcaw_post_likes cawcaw_posts_likes_post_id_fg_key; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_likes
    ADD CONSTRAINT cawcaw_posts_likes_post_id_fg_key FOREIGN KEY (post_id) REFERENCES public.cawcaw_posts(id) ON DELETE CASCADE;


--
-- TOC entry 2494 (class 2606 OID 81962)
-- Name: cawcaw_post_likes cawcaw_posts_likes_user_id_fg_key; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.cawcaw_post_likes
    ADD CONSTRAINT cawcaw_posts_likes_user_id_fg_key FOREIGN KEY (user_id) REFERENCES public.cawcaw_users(id) ON DELETE CASCADE;


-- Completed on 2024-01-06 00:25:25

--
-- PostgreSQL database dump complete
--

