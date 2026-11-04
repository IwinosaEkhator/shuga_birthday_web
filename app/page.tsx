"use client";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { qualities, unknownQuestions } from "@/data/content";
const A = "/shuga-wrapped-assets/",
  camp = A + "camp/",
  shuga = A + "shuga/";
const fade = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-14%" },
  transition: { duration: 0.8 },
};
const optimizedImages: Record<string, string> = {
  "IMG_7720.JPG.jpeg": "hero-portrait",
  "IMG-20251205-WA0231.jpg": "camp-group",
  "camp/shuga/IMG-20251205-WA0223.jpg": "camp-three",
  "IMG-20251205-WA0217.jpg": "camp-iwinosa-shuga",
  "3096a201aced093ab54d8a96e8482b29.webp": "outside-portrait",
  "43054f1f5ee655e7c7f60789036d80aa.webp": "red-portrait",
  "227f4378fbdb9c887ef274526bcc8eeb.webp": "evidence-portrait",
  "WhatsApp Image 2026-11-03 at 18.04.34.jpeg": "starter-portrait",
  "05aa90ed4dc34cc73b7b960b96cb521d.webp": "quiet-portrait",
  "WhatsApp Image 2026-11-02 at 22.27.42.jpeg": "lagos-portrait",
};
function Img({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const hero = className.includes("hero-photo");
  const match = Object.entries(optimizedImages).find(([key]) =>
    src.endsWith(key),
  );
  const effectiveAlt =
    alt ||
    (match?.[1] === "starter-portrait"
      ? "Portrait of Tumininu used in the Shuga starter pack"
      : "");
  if (!match)
    return (
      <img
        src={src}
        alt={effectiveAlt}
        loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : "auto"}
        decoding="async"
        className={className}
      />
    );
  const base = `/optimized/images/${match[1]}`,
    sizes = hero
      ? "100vw"
      : "(max-width: 700px) 92vw, (max-width: 1100px) 70vw, 55vw";
  return (
    <picture>
      <source
        srcSet={`${base}-480.avif 480w, ${base}-800.avif 800w, ${base}-1200.avif 1200w, ${base}.avif 1600w`}
        sizes={sizes}
        type="image/avif"
      />
      <source
        srcSet={`${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w, ${base}.webp 1600w`}
        sizes={sizes}
        type="image/webp"
      />
      <img
        src={`${base}-800.webp`}
        srcSet={`${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w, ${base}.webp 1600w`}
        sizes={sizes}
        alt={effectiveAlt}
        loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : "auto"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
function Label({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  const labels: Record<string, string> = {
    "FILE 03 / ARCHIVE 06 / TUMININU": "FILE 03 / TUMININU",
    "RESEARCH FINDING #07": "FILE 06 / RESEARCH FINDING",
    "FILE 08 / NO JOKES HERE": "FILE 07 / NO JOKES HERE",
    "FILE 09 / LETTERS TO TUMININU": "FILE 08 / LETTERS TO TUMININU",
  };
  const text =
    typeof children === "string" ? labels[children] || children : children;
  return <p className={`label ${light ? "text-cream" : ""}`}>{text}</p>;
}
function Questions() {
  const [a, setA] = useState(["", "", ""]),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    const s = localStorage.getItem("shuga-favourites");
    if (s) setA(JSON.parse(s).slice(0, 3));
  }, []);
  const update = (i: number, v: string) => {
    const n = a.map((x, j) => (i === j ? v : x));
    setA(n);
    setSent(false);
    setError("");
    localStorage.setItem("shuga-favourites", JSON.stringify(n));
  };
  const submit = () => {
    if (a.some((x) => !x.trim())) {
      setSent(false);
      setError(
        "Add all three answers first — your friends need the complete lesson.",
      );
      return;
    }
    setError("");
    setSent(true);
  };
  return (
    <div className="research-form">
      <p className="form-explainer">
        Nothing is sent anywhere. Your answers are saved only on this device,
        then shown back to you as a completed field note.
      </p>
      {unknownQuestions.slice(0, 3).map(([, q], i) => (
        <label key={q}>
          <span>
            {q}
            {i === 1 && <small>The one you rate highest.</small>}
            {i === 2 && <small>The one you would happily rewatch.</small>}
          </span>
          <input
            value={a[i] || ""}
            onChange={(e) => update(i, e.target.value)}
            placeholder="write it here..."
            aria-invalid={!!error && !a[i].trim()}
          />
        </label>
      ))}
      <button onClick={submit}>
        EDUCATE THEM <span>→</span>
      </button>
      <div aria-live="polite">
        {error && <p className="form-error">{error}</p>}
        <AnimatePresence>
          {sent && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="device-note"
            >
              Lesson saved. This information remains on your device because your
              friends still need to ask you themselves. 😂
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
function Soundtrack() {
  const [open, setOpen] = useState(false);
  return (
    <aside
      className={`soundtrack ${open ? "soundtrack-open" : ""}`}
      aria-label="Official soundtrack player"
    >
      <button
        className="soundtrack-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{open ? "PAUSE THE MOMENT" : "PLAY THE SOUNDTRACK"}</span>
        <b>{open ? "×" : "♪"}</b>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div>
              <small>THE SHUGA ARCHIVES / OFFICIAL LISTEN</small>
              <strong>How Are You (My Friend)</strong>
              <span>Johnny Drille · Don Jazzy</span>
            </div>
            <iframe
              width="320"
              height="180"
              src="https://www.youtube-nocookie.com/embed/iAKqBWKk_tQ?autoplay=1&playsinline=1"
              title="How Are You (My Friend) by Johnny Drille and Don Jazzy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
function ArchiveNav() {
  const items = [
    ["origin", "Origin"],
    ["numbers", "Numbers"],
    ["portraits", "Fine girl files"],
    ["film", "Camp on film"],
    ["letters", "Letters"],
    ["finale", "Finale"],
  ];
  const [active, setActive] = useState("top");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-42% 0px -48%", threshold: 0 },
    );
    ["top", ...items.map((x) => x[0])].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <nav
      className={`archive-nav ${active === "top" ? "nav-hidden" : ""}`}
      aria-label="Archive chapters"
    >
      <span>
        {String(
          Math.max(1, items.findIndex((x) => x[0] === active) + 1),
        ).padStart(2, "0")}{" "}
        / 06
      </span>
      <div>
        {items.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
          >
            <i />
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
function ArchiveVideo({
  src,
  poster,
  n,
  title,
  note,
}: {
  src: string;
  poster: string;
  n: string;
  title: string;
  note: string;
}) {
  const [started, setStarted] = useState(false),
    [duration, setDuration] = useState("");
  const ref = useRef<HTMLVideoElement>(null);
  const optimized =
    n === "001"
      ? "/optimized/video/two-camp-peas.mp4"
      : n === "002"
        ? "/optimized/video/original-plug.mp4"
        : "/optimized/video/shuga-in-motion.mp4";
  const play = () => {
    document.querySelectorAll("video").forEach((v) => {
      if (v !== ref.current) v.pause();
    });
    ref.current?.play();
    setStarted(true);
  };
  return (
    <motion.article
      initial={{ opacity: 0.45, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.35 }}
    >
      <div className="video-shell">
        <video
          ref={ref}
          controls={started}
          preload="metadata"
          playsInline
          poster={poster}
          src={optimized}
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            setDuration(
              `${Math.floor(d / 60)}:${String(Math.floor(d % 60)).padStart(2, "0")}`,
            );
          }}
          onPlay={play}
        >
          <track
            kind="captions"
            src={`/captions/playback-${n}.vtt`}
            srcLang="en"
            label="English sound descriptions"
            default
          />
        </video>
        {!started && (
          <button
            className="custom-play"
            onClick={play}
            aria-label={`Play ${title}`}
          >
            <span>▶</span>
            <b>PLAY MEMORY</b>
          </button>
        )}
        <span className="playback-code">REC / {n}</span>
        {duration && <span className="video-duration">{duration}</span>}
      </div>
      <p>
        <b>
          PLAYBACK {n} — {title}
        </b>
        <span>EKITI / ARCHIVE FOOTAGE</span>
      </p>
      <small>{note}</small>
    </motion.article>
  );
}
function FilmGallery() {
  const reel = useRef<HTMLDivElement>(null),
    [current, setCurrent] = useState(0);
  const go = (next: number) => {
    const index = Math.max(0, Math.min(2, next));
    setCurrent(index);
    const el = reel.current;
    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };
  return (
    <>
      <div
        className="film-reel"
        ref={reel}
        onScroll={(e) =>
          setCurrent(
            Math.max(
              0,
              Math.min(
                2,
                Math.round(
                  e.currentTarget.scrollLeft / e.currentTarget.clientWidth,
                ),
              ),
            ),
          )
        }
      >
        <ArchiveVideo
          src={camp + "iwinosa_and_shuga/VID-20251208-WA0083.mp4"}
          poster={camp + "iwinosa_and_shuga/IMG-20251205-WA0217.jpg"}
          n="001"
          title="TWO CAMP PEAS"
          note="Iwinosa + Shuga, somewhere between camp stress and friendship."
        />
        <ArchiveVideo
          src={
            camp + "maroh_and_shuga/WhatsApp Video 2026-11-03 at 09.33.16.mp4"
          }
          poster={camp + "shuga/IMG-20251205-WA0223.jpg"}
          n="002"
          title="THE ORIGINAL PLUG"
          note="Maroh + Shuga — the introduction that changed the plot."
        />
        <ArchiveVideo
          src={camp + "shuga/VID-20251206-WA0024.mp4"}
          poster={camp + "IMG-20251205-WA0231.jpg"}
          n="003"
          title="SHUGA IN MOTION"
          note="A small piece of camp that photographs could never hold."
        />
      </div>
      <div className="film-controls" aria-label="Film navigation">
        <button onClick={() => go(current - 1)} disabled={current === 0}>
          ← PREVIOUS
        </button>
        <span>{current + 1} OF 3</span>
        <button onClick={() => go(current + 1)} disabled={current === 2}>
          NEXT →
        </button>
      </div>
      <p className="caption-note">
        Sound-description captions are available from each video’s caption menu.
      </p>
    </>
  );
}
function UnpublishedRolls() {
  const photos = [
    [
      "The wider camp cast, gathered in tie-dye and excellent chaos.",
      "A large group of corps members posing in colourful tie-dye at camp",
    ],
    [
      "A smaller frame from the same afternoon—still no quiet people in sight.",
      "Friends posing together beside the camp tie-dye stand",
    ],
    [
      "Three camp faces, one tie-dye stand, and another moment worth keeping.",
      "Three corps members posing together at the camp tie-dye stand",
    ],
    [
      "Golden hour, camp cap, and evidence that the subject was always camera-ready.",
      "Shuga wearing her NYSC cap and sunglasses in the evening sun",
    ],
    [
      "Orientation camp, officially documented.",
      "Shuga posing beside the orientation camp map",
    ],
    [
      "A candid frame: friendship, laughter and one hand trying to hide it.",
      "Shuga laughing with a friend during camp",
    ],
    [
      "Corper Shuga reporting for the archive.",
      "Shuga standing in full NYSC uniform on the camp field",
    ],
    [
      "Four mirror frames. One very committed field study.",
      "A four-frame mirror selfie collage of Shuga",
    ],
    [
      "Somewhere outside again, naturally.",
      "Shuga taking a full-length mirror photograph while dressed in red",
    ],
    [
      "The brown file: further evidence from beyond camp.",
      "Portrait of Shuga wearing a warm brown top and black skirt",
    ],
  ];
  const [target, setTarget] = useState<HTMLElement | null>(null),
    [open, setOpen] = useState(false),
    [selected, setSelected] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const host = document.createElement("div");
    host.dataset.unpublishedRolls = "";
    document.querySelector("main")?.appendChild(host);
    setTarget(host);
    return () => host.remove();
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setSelected((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setSelected((i) => (i - 1 + photos.length) % photos.length);
      if (e.key === "Tab") {
        const nodes = [
          ...document.querySelectorAll<HTMLElement>(".rolls-dialog button"),
        ];
        if (!nodes.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(".rolls-close")?.focus(),
    );
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      trigger.current?.focus();
    };
  }, [open, photos.length]);
  if (!target) return null;
  return createPortal(
    <section className="rolls-invitation" id="unpublished-rolls">
      <span>POST-CREDITS / CONTACT SHEET 002</span>
      <h2>
        MORE EVIDENCE
        <br />
        WAS RECOVERED.
      </h2>
      <p>Ten photographs that did not make the official record. Until now.</p>
      <button
        ref={trigger}
        onClick={() => {
          setSelected(0);
          setOpen(true);
        }}
      >
        OPEN THE UNPUBLISHED ROLLS →
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="rolls-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="rolls-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="rolls-title"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <header>
                <div>
                  <small>PREVIOUSLY UNFILED EVIDENCE</small>
                  <h2 id="rolls-title">UNPUBLISHED ROLLS</h2>
                </div>
                <button className="rolls-close" onClick={() => setOpen(false)}>
                  CLOSE ×
                </button>
              </header>
              <div className="rolls-stage">
                <button
                  className="roll-arrow"
                  onClick={() =>
                    setSelected((i) => (i - 1 + photos.length) % photos.length)
                  }
                  aria-label="Previous photograph"
                >
                  ←
                </button>
                <figure>
                  <img
                    src={`/optimized/rolls/roll-${String(selected + 1).padStart(2, "0")}.webp`}
                    alt={photos[selected][1]}
                  />
                  <figcaption>
                    <b>
                      ROLL {String(selected + 1).padStart(2, "0")} /{" "}
                      {photos.length}
                    </b>
                    <span>{photos[selected][0]}</span>
                  </figcaption>
                </figure>
                <button
                  className="roll-arrow"
                  onClick={() => setSelected((i) => (i + 1) % photos.length)}
                  aria-label="Next photograph"
                >
                  →
                </button>
              </div>
              <div className="contact-sheet" aria-label="Choose a photograph">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    aria-label={`View roll ${i + 1}: ${photo[1]}`}
                    aria-current={selected === i ? "true" : undefined}
                  >
                    <img
                      src={`/optimized/rolls/roll-${String(i + 1).padStart(2, "0")}-thumb.webp`}
                      alt=""
                      loading="lazy"
                    />
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </button>
                ))}
              </div>
              <p className="rolls-help">USE ← → KEYS OR SELECT A FRAME</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>,
    target,
  );
}
export default function Home() {
  const [exit, setExit] = useState(0),
    [opened, setOpened] = useState<"maroh" | "iwinosa" | null>(null),
    [medal, setMedal] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 30 });
  useEffect(() => {
    if (!opened) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpened(null);
      if (e.key === "Tab") {
        const nodes = [
          ...document.querySelectorAll<HTMLElement>(".letter-overlay button"),
        ];
        if (!nodes.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(".close-letter")?.focus(),
    );
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [opened]);
  return (
    <main className="site">
      <motion.div className="progress" style={{ scaleX: progress }} />
      <ArchiveNav />
      <Soundtrack />
      <UnpublishedRolls />
      <section className="hero" id="top">
        <Img
          src={shuga + "IMG_7720.JPG.jpeg"}
          alt="Portrait of Tumininu"
          className="hero-photo"
        />
        <div className="hero-wash" />
        <div className="hero-top">
          <span>04 / 11 / 2026</span>
          <span>PERSONAL ARCHIVE № 001</span>
        </div>
        <div className="hero-copy">
          <p>THE BIRTHDAY ARCHIVES</p>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            SHUGA
          </motion.h1>
          <p className="route">EKITI → LAGOS → SOMEWHERE OUTSIDE AGAIN.</p>
        </div>
        <button
          className="enter"
          onClick={() =>
            document
              .querySelector("#origin")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span>ENTER ARCHIVE</span>
          <b>↘</b>
        </button>
        <a className="skip-sincere" href="#letters">
          OR GO STRAIGHT TO THE LETTERS →
        </a>
        <div className="hero-index">01 — 11</div>
      </section>
      <section className="scrap" id="origin">
        <div className="paper-note">
          <span>EKITI STATE</span>
          <b>NOV. 2025</b>
        </div>
        <motion.div {...fade} className="scrap-title">
          <Label>FILE 01 / ORIGIN STORY</Label>
          <h2>
            THIS IS WHERE
            <br />
            IT STARTED.
          </h2>
          <p>
            Three people. One NYSC camp.
            <br />
            Absolutely no idea we’d still be here a year later.
          </p>
        </motion.div>
        <motion.figure
          whileHover={{ rotate: -2, y: -8 }}
          className="polaroid p-one"
        >
          <Img
            src={camp + "IMG-20251205-WA0231.jpg"}
            alt="Shuga and fellow corps members in tie-dye at Ekiti NYSC camp"
          />
          <figcaption>
            Platoon faces, tie-dye uniforms and the beginning of everything.
          </figcaption>
        </motion.figure>
        <motion.figure
          whileHover={{ rotate: 1, y: -8 }}
          className="polaroid p-two"
        >
          <Img
            src={camp + "shuga/IMG-20251205-WA0223.jpg"}
            alt="Maroh, Shuga and Iwinosa together at Ekiti camp"
          />
          <figcaption>
            The plug, the beneficiary and the reason this archive exists.
          </figcaption>
        </motion.figure>
        <motion.figure
          whileHover={{ rotate: -1, y: -8 }}
          className="polaroid p-three"
        >
          <Img
            src={camp + "iwinosa_and_shuga/IMG-20251205-WA0217.jpg"}
            alt="Iwinosa and Shuga posing together at camp"
          />
          <figcaption>The friendship before everyone left camp.</figcaption>
        </motion.figure>
        <div className="cast-list">
          <p>
            <b>MAROH</b>
            <span>The plug.</span>
          </p>
          <p>
            <b>IWINOSA</b>
            <span>Beneficiary of the plug.</span>
          </p>
          <p>
            <b>SHUGA</b>
            <span>The reason you’re looking at a website.</span>
          </p>
        </div>
        <span className="scribble">friendship, apparently ↗</span>
      </section>
      <section className="numbers-intro" id="numbers">
        <Label>FILE 02 / CERTIFIED DATA</Label>
        <h2>
          THE NUMBERS
          <br />
          <em>DON’T LIE.</em>
        </h2>
        <p>
          Independent research. Questionable methodology. Accurate conclusions.
        </p>
      </section>
      <section className="stats">
        {[
          ["100%", "CARING", "Quietly, consistently, genuinely."],
          [
            "100%",
            "STANDS ON BUSINESS",
            "Once decided, please conserve your energy.",
          ],
          [
            "???",
            "LIKELIHOOD OF REPLYING PROMPTLY",
            "The data remains inconclusive.",
          ],
          [
            "OLYMPIC",
            "REACHING SHUGA",
            "Calls — questionable / Texts — proceed with patience / Smoke signals — Q1 2027",
          ],
        ].map(([big, title, copy], i) => (
          <article
            className={`stat stat-${i + 1} ${medal && i === 3 ? "medal-awarded" : ""}`}
            key={title}
          >
            <span>0{i + 1} / 04</span>
            <strong>{big}</strong>
            <h3>{title}</h3>
            <p>{copy}</p>
            {i === 3 && (
              <button className="medal-button" onClick={() => setMedal(true)}>
                {medal ? "MEDAL AWARDED 🥇" : "TAP TO AWARD MEDAL"}
              </button>
            )}
            {i === 3 && (
              <motion.div
                className="giant-medal"
                animate={
                  medal
                    ? { scale: 1, rotate: 0, opacity: 1 }
                    : { scale: 0.2, rotate: -35, opacity: 0 }
                }
              >
                🥇
              </motion.div>
            )}
          </article>
        ))}
      </section>
      <p className="swipe-hint">SWIPE / SCROLL TO REVIEW THE FINDINGS →</p>
      <section className="editorial" id="portraits">
        <div className="editorial-head">
          <Label>FILE 03 / ARCHIVE 06 / TUMININU</Label>
          <h2>
            THE FINE
            <br />
            <i>GIRL</i> FILES.
          </h2>
          <p>
            Compliments have historically been rejected by the subject. Evidence
            remains overwhelming.
          </p>
        </div>
        <div className="mag-grid">
          <figure className="mag-a">
            <Img
              src={shuga + "IMG_7720.JPG.jpeg"}
              alt="Studio portrait of Tumininu"
            />
            <span>PORTRAIT 001</span>
          </figure>
          <figure className="mag-b">
            <Img
              src={shuga + "3096a201aced093ab54d8a96e8482b29.webp"}
              alt="Tumininu outdoors"
            />
            <span>OUTSIDE, AS EXPECTED</span>
          </figure>
          <blockquote>
            “VERY, VERY BEAUTIFUL.”
            <small>— THE EDITORS, DESPITE OBJECTIONS</small>
          </blockquote>
          <figure className="mag-c">
            <Img
              src={shuga + "43054f1f5ee655e7c7f60789036d80aa.webp"}
              alt="Tumininu wearing red"
            />
            <span>THE RED FILE</span>
          </figure>
          <figure className="mag-d">
            <Img
              src={shuga + "227f4378fbdb9c887ef274526bcc8eeb.webp"}
              alt="Portrait of Tumininu"
            />
            <span>EVIDENCE 004</span>
          </figure>
        </div>
        <h3 className="overwhelming">
          EVIDENCE
          <br />
          REMAINS
          <br />
          <i>OVERWHELMING.</i>
        </h3>
      </section>
      <section className="film" id="film">
        <header>
          <div>
            <Label light>FILE 04 / MOVING IMAGE</Label>
            <h2>
              CAMP,
              <br />
              ON FILM.
            </h2>
          </div>
          <p>
            Not everything belongs in a photo album.
            <br />
            Some memories need sound.
          </p>
        </header>
        <FilmGallery />
      </section>
      <section className="starter">
        <div className="burst b1">OUTSIDE</div>
        <div className="burst b2">GOOD LUCK!</div>
        <Img
          src={shuga + "WhatsApp Image 2026-11-03 at 18.04.34.jpeg"}
          className="cutout-photo"
        />
        <h2>
          THE SHUGA
          <br />
          <span>STARTER PACK™</span>
        </h2>
        <div className="starter-tags">
          <b>SHY*</b>
          <small>*terms and conditions apply</small>
          <b>CARING</b>
          <b>STANDS ON BUSINESS</b>
          <b>REACHING HER: GOOD LUCK</b>
          <b>RED + BROWN</b>
        </div>
        <p className="hand-arrow">← main character evidence</p>
      </section>
      <section className="research">
        <div className="research-copy">
          <Label>RESEARCH FINDING #07</Label>
          <h2>
            AFTER APPROXIMATELY
            <br />
            ONE YEAR OF FRIENDSHIP…
          </h2>
          <p>Neither Iwinosa nor Maroh knows Shuga’s favourite movie.</p>
          <p>Or favourite artist.</p>
          <strong>EMBARRASSING.</strong>
        </div>
        <Questions />
      </section>
      <section className="emotional-reset" aria-label="A change of tone">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.65 }}
          transition={{ delay: 0.45, duration: 1 }}
        >
          <small>THE ARCHIVE GOES QUIET.</small>
          <p>No statistics. No jokes. No evidence to argue with.</p>
        </motion.div>
      </section>
      <section className="quiet">
        <div className="quiet-photo">
          <Img
            src={shuga + "05aa90ed4dc34cc73b7b960b96cb521d.webp"}
            alt="A quiet portrait of Tumininu"
          />
        </div>
        <div className="quiet-copy">
          <Label>FILE 08 / NO JOKES HERE</Label>
          <h2>
            Okay.
            <br />
            Jokes aside.
          </h2>
          <p className="lead">What we actually think about you.</p>
          {qualities.slice(0, 4).map(([t, b]) => (
            <article key={t}>
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="letters" id="letters">
        <Label>FILE 09 / LETTERS TO TUMININU</Label>
        <h2>
          TWO LETTERS.
          <br />
          OPEN WHEN READY.
        </h2>
        <div className="letter-grid">
          <button
            className="envelope maroh-envelope"
            onClick={() => setOpened("maroh")}
          >
            <span>01 / FROM MAROH</span>
            <i>For Tumi, with love</i>
            <h3>
              A letter from
              <br />
              Maroh
            </h3>
            <p>Open to read her birthday message</p>
            <b>OPEN LETTER →</b>
          </button>
          <button
            className="envelope iwinosa-envelope"
            onClick={() => setOpened("iwinosa")}
          >
            <span>02 / FROM IWINOSA</span>
            <i>A birthday field note</i>
            <h3>
              A letter from
              <br />
              Iwinosa
            </h3>
            <p>A little something from your friend</p>
            <b>OPEN LETTER →</b>
          </button>
        </div>
      </section>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="letter-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`Letter from ${opened}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpened(null)}
          >
            <motion.article
              initial={{ y: "100%", rotate: opened === "maroh" ? -2 : 2 }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className={opened === "maroh" ? "maroh-letter" : "iwinosa-letter"}
            >
              <button className="close-letter" onClick={() => setOpened(null)}>
                CLOSE ×
              </button>
              <Label>
                PRIVATE CORRESPONDENCE / {opened === "maroh" ? "01" : "02"}
              </Label>
              <h3>
                {opened === "maroh"
                  ? "Happy birthday, Tumi!!"
                  : "Happy Birthday, Shuga ❤️"}
              </h3>
              {opened === "maroh" ? (
                <>
                  <p>
                    I wish you all the best. I care about you, and I really hope
                    this new year brings great things into your life.
                  </p>
                  <p>
                    I remember how we met—we were on toilet duties in camp
                    (yuck), and you took my number so you could call and ask me
                    some questions. I had forgotten your name when you called.
                    Forgive me; I wasn’t used to Yoruba names! You kept
                    reminding me.
                  </p>
                  <p>
                    The day we actually spoke like friends was the day our
                    platoon did Man O’ War drills. You called and asked to meet
                    up, and from there we became two camp peas in a pod—with
                    Iwinosa occasionally becoming the third pea.
                  </p>
                  <p>
                    I introduced you to Iwinosa, and although I left camp
                    early—I really wish I didn’t—you still checked up on me
                    whenever you had the chance.
                  </p>
                  <p>
                    Being friends with you was an experience. I really wish we
                    had more chances to hang out, but I do care about you, and I
                    want to wish you a big happy birthday!
                  </p>
                  <b>— Maroh</b>
                </>
              ) : (
                <>
                  <p>
                    It’s actually funny thinking that if not for Maroh and camp,
                    I probably wouldn’t have met you. And now somehow we’re here
                    making an entire website for your birthday 😂.
                  </p>
                  <p>
                    We might not talk every day—partly because reaching you can
                    genuinely be an Olympic sport 😭—but I’m really glad I got
                    to know you.
                  </p>
                  <p>
                    You’re a very strong person, and one thing I genuinely
                    admire about you is how you stand by your convictions.
                    You’re also a lot more caring and loving than I think you
                    realise. Even though you might not always reach out or say
                    much, when you care about someone, it shows.
                  </p>
                  <p>
                    And yes, you’re very, very beautiful. I know you don’t like
                    compliments, so unfortunately you’ll just have to endure
                    that one today.
                  </p>
                  <p>
                    I hope this new year of your life is genuinely beautiful to
                    you. I hope you have more reasons to be happy, more places
                    to go since you apparently cannot stay inside 😂, good
                    people around you, and plenty of moments and memories that
                    you’ll look back on and smile.
                  </p>
                  <p>
                    I’m really glad camp happened, because it meant I got to
                    meet you.
                  </p>
                  <p className="letter-final">
                    <strong>Happy birthday, Shuga. ❤️</strong>
                  </p>
                  <b>— Iwinosa</b>
                </>
              )}
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
      <section
        className={`finale ${exit === 2 ? "surprise-open" : ""}`}
        id="finale"
      >
        <div className="then-now">
          <figure>
            <Img
              src={camp + "shuga/IMG-20251205-WA0223.jpg"}
              alt="The three friends at Ekiti camp"
            />
            <figcaption>EKITI — NOVEMBER 2025</figcaption>
          </figure>
          <figure>
            <Img
              src={shuga + "WhatsApp Image 2026-11-02 at 22.27.42.jpeg"}
              alt="Tumininu in Lagos in 2026"
            />
            <figcaption>LAGOS — 2026</figcaption>
          </figure>
        </div>
        <h2>
          WE’RE GLAD
          <br />
          <i>CAMP</i>
          <br />
          HAPPENED.
        </h2>
        <p>Happy Birthday, Tumininu.</p>
        <small>— MAROH & IWINOSA</small>
        <button onClick={() => setExit((s) => Math.min(s + 1, 2))}>
          {exit === 0
            ? "I’VE BEEN CELEBRATED ENOUGH →"
            : exit === 1
              ? "NO. PLEASE 😭 →"
              : "FINE. ❤️"}
        </button>
        {exit === 2 && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Birthday archive finale"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="final-surprise"
          >
            <Img
              src={shuga + "IMG_7720.JPG.jpeg"}
              alt="Final portrait of Tumininu"
            />
            <div>
              <span>ARCHIVE COMPLETE / 04.11.2026</span>
              <strong>
                HAPPY BIRTHDAY,
                <br />
                SHUGA. ❤️
              </strong>
              <small>You are very, very loved.</small>
              <div className="final-actions">
                <button onClick={() => setExit(0)}>REPLAY ENDING</button>
                <button
                  onClick={() => {
                    setExit(0);
                    document
                      .querySelector("#origin")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  RETURN TO ARCHIVE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
