// event card component, used in PostDetailPage

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faPen, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/postHelpers";

export function extractPosterColor(url, callback) {
    if (!url) return callback(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 60;
            canvas.height = 60;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            ctx.drawImage(img, 0, 0, 60, 60);
            const data = ctx.getImageData(0, 0, 60, 60).data;
            let r = 0, g = 0, b = 0, n = 0;
            for (let i = 0; i < data.length; i += 16) {
                r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
            }
            r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
            // Return the raw dominant colour — callers lighten for their own use
            callback(`rgb(${r},${g},${b})`);
        } catch {
            callback(null);
        }
    };
    img.onerror = () => callback(null);
    img.src = url;
}

function lightenColor(color) {
    const m = color?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!m) return color;
    const lighten = c => Math.round(Number(c) * 0.45 + 255 * 0.55);
    return `rgb(${lighten(m[1])},${lighten(m[2])},${lighten(m[3])})`;
}

function ReviewedEventCard({ event, onColorExtracted }) {
    const [bgColor, setBgColor] = useState(null);

    useEffect(() => {
        if (event?.posterUrl) {
            extractPosterColor(event.posterUrl, (color) => {
                if (color) {
                    setBgColor(lightenColor(color)); // card uses lightened version
                    onColorExtracted?.(color);       // parent gets raw vivid colour
                }
            });
        }
    }, [event?.posterUrl]);

    if (!event) return <div className="rec rec--skeleton" />;

    const formattedDate = event.startDateTime ? formatDate(event.startDateTime) : "Date TBA";
    const category = event.description ? event.description.split(",")[0].trim() : null;

    return (
        <div className="rec" style={bgColor ? { backgroundColor: bgColor } : undefined}>

            {/* Poster photo — portrait crop */}
            <Link to={`/events/${event.eventId}`} className="rec__poster-link">
                <div className="rec__poster-wrap">
                    {event.posterUrl
                        ? <img src={event.posterUrl} alt={event.title} className="rec__poster" />
                        : <div className="rec__poster-placeholder" />
                    }
                </div>
            </Link>

            {/* Info block */}
            <Link to={`/events/${event.eventId}`} className="rec__info-link">
                <div className="rec__info">
                    <span className="rec__eyebrow">♦ Reviewed Event</span>
                    <h3 className="rec__title">{event.title}</h3>
                    {category && <p className="rec__category">{category}</p>}
                    <p className="rec__date">{formattedDate}</p>
                    {event.venue && <p className="rec__venue">{event.venue}</p>}
                </div>
            </Link>

            {/* Stats */}
            <div className="rec__stats">
                <div className="event-stat">
                    <FontAwesomeIcon icon={faBookmark} className="event-stat__icon" />
                    <span>{event.saveCount ?? 0}</span>
                    <span className="event-stat__label">saved</span>
                </div>
                <div className="event-stat">
                    <FontAwesomeIcon icon={faPen} className="event-stat__icon" />
                    <span>{event.reviewCount ?? 0}</span>
                    <span className="event-stat__label">reviews</span>
                </div>
                <div className="event-stat">
                    <FontAwesomeIcon icon={faUserCheck} className="event-stat__icon" />
                    <span>{event.attendCount ?? 0}</span>
                    <span className="event-stat__label">attended</span>
                </div>
            </div>
        </div>
    );
}

export default ReviewedEventCard;
