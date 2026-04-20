import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import "../../styles/components/noisy-post-card.css";

// ── Adjustable palettes
const COLOR_PALETTES = [
    { bg: "#f3b43e", text: "#0d0d0d" },
    { bg: "#8974e4", text: "#0d0d0d" },
    { bg: "#df8bd2", text: "#0d0d0d" },
    { bg: "#414d36", text: "#c3abf6" },
    { bg: "#2b2d42", text: "#ef233c" },
    { bg: "#a13fef", text: "#f9eade" },
    { bg: "#280e8c", text: "#f9eade" },
    { bg: "#f4b4cd", text: "#833156" },
    { bg: "#ea462a", text: "#0d0d0d" },
];

// ── Card size by review length
function getCardSize(content = "") {
    const len = content.length;
    if (len > 280) return "large";
    if (len > 100) return "medium";
    return "small";
}

// ── Title font-size for color cards by title length
function getTitleSize(title = "") {
    const len = title.length;
    if (len <= 12) return "48px";
    if (len <= 22) return "36px";
    if (len <= 35) return "26px";
    return "20px";
}

function NoisyPostCard({ post, showPoster }) {
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
        : { backgroundColor: palette.bg, "--ncard-text": palette.text };

    return (
        <div
            className={`ncard ncard--${cardSize} ${showPoster ? "ncard--poster" : "ncard--color"}`}
            style={cardStyle}
        >
            <Link to={`/posts/${post.postId}`} className="ncard__link">

                {/* ── Resting state ── */}
                <div className="ncard__body">
                    <div>
                        <h3
                            className="ncard__title"
                            style={!showPoster ? { fontSize: getTitleSize(post.title) } : undefined}
                        >
                            {post.title}
                        </h3>
                        <p className="ncard__excerpt">{post.content}</p>
                    </div>
                    <div className="ncard__footer">
                        <div className="ncard__rating">{renderStars(post.rating)}</div>
                    </div>
                </div>

                {/* ── Hover overlay ── */}
                <div className="ncard__overlay">
                    <div className="ncard__overlay-inner">
                        <p className="ncard__ov-user">@{post.username}</p>
                        <p className="ncard__ov-title">{post.title}</p>
                        {post.venue && <p className="ncard__ov-venue">{post.venue}</p>}
                        {eventDate && <p className="ncard__ov-date">{eventDate}</p>}
                        <div className="ncard__ov-stars">{renderStars(post.rating)}</div>
                        <span className="ncard__ov-cta">
                            View post <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                    </div>
                </div>

            </Link>
        </div>
    );
}

export default NoisyPostCard;
