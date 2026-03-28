function EventCard({ event }) {

    const formattedDate = event.startDateTime
        ? new Date(event.startDateTime)
            .toLocaleString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })
            .replace(",", "")
        : "Date to be announced";

    return (
        <div className="event-card">
            <a
                href={event.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="event-card__link"
            >
                <div className="event-card__image-wrap">
                    <img
                        src={event.posterUrl}
                        alt={event.title}
                        className="event-card__image"
                    />
                </div>

                <div className="event-card__content">
                    <p className="event-card__category">
                        {event.description || "Arts & Culture"}
                    </p>

                    <h3 className="event-card__title">
                        {event.title}
                    </h3>

                    <div className="event-card__meta">
                        <p className="event-card__time">{formattedDate}</p>
                        <p className="event-card__venue">{event.venue || "Venue TBA"}</p>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default EventCard;