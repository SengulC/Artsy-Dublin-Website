import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import "../../styles/components/energetic-post-card.css";

// ── Developer-adjustable palettes ─────────────────────────────────────────────
// Each entry: { bg: background colour, text: text/accent colour }
const COLOR_PALETTES = [
    { bg: "#0d0d0d", text: "#f4e04d" },
    { bg: "#0f3460", text: "#53c0f0" },
    { bg: "#1a1a2e", text: "#e94560" },
    { bg: "#1b4332", text: "#95d5b2" },
    { bg: "#2b2d42", text: "#ef233c" },
    { bg: "#3d1a78", text: "#d4a5f5" },
    { bg: "#03071e", text: "#ffba08" },
    { bg: "#370617", text: "#f48c06" },
    { bg: "#283618", text: "#a7c957" },
    { bg: "#4a0e0e", text: "#f4a261" },
];

// ── Card size by review length ─────────────────────────────────────────────────
function getCardSize(content = "") {
    const len = content.length;
    if (len > 280) return "large";
    if (len > 100) return "medium";
    return "small";
}

// ── Title font-size for color cards by title length ───────────────────────────
function getTitleSize(title = "") {
    const len = title.length;
    if (len <= 12) return "48px";
    if (len <= 22) return "36px";
    if (len <= 35) return "26px";
    return "20px";
}

function EnergeticPostCard({ post }) {
    const showPoster = !!(post.posterUrl && post.postId % 2 === 0);
    const palette = COLOR_PALETTES[post.postId % COLOR_PALETTES.length];
    const cardSize = getCardSize(post.content);

    const renderStars = (rating) =>
        Array.from({ length: 5 }, (_, i) => (
            <FontAwesomeIcon key={i} icon={i < rating ? faStarSolid : faStarRegular} />
        ));

    const eventDate = post.startDateTime
        ? new Date(post.startDateTime).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : null;

    const cardStyle = showPoster
        ? { backgroundImage: `url(${post.posterUrl})` }
        : { backgroundColor: palette.bg, "--ecard-text": palette.text };

    return (
        <div
            className={`ecard ecard--${cardSize} ${showPoster ? "ecard--poster" : "ecard--color"}`}
            style={cardStyle}
        >
            <Link to={`/posts/${post.postId}`} className="ecard__link">

                {/* ── Resting state ── */}
                <div className="ecard__body">
                    <div>
                        <h3
                            className="ecard__title"
                            style={!showPoster ? { fontSize: getTitleSize(post.title) } : undefined}
                        >
                            {post.title}
                        </h3>
                        <p className="ecard__excerpt">{post.content}</p>
                    </div>
                    <div className="ecard__footer">
                        <div className="ecard__rating">{renderStars(post.rating)}</div>
                    </div>
                </div>

                {/* ── Hover overlay ── */}
                <div className="ecard__overlay">
                    <div className="ecard__overlay-inner">
                        <p className="ecard__ov-user">@{post.username}</p>
                        <p className="ecard__ov-title">{post.title}</p>
                        {post.venue && <p className="ecard__ov-venue">{post.venue}</p>}
                        {eventDate && <p className="ecard__ov-date">{eventDate}</p>}
                        <div className="ecard__ov-stars">{renderStars(post.rating)}</div>
                        <span className="ecard__ov-cta">
                            View post <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                    </div>
                </div>

            </Link>
        </div>
    );
}

export default EnergeticPostCard;
