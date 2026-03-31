import { useParams } from "react-router-dom";
import mockEvents from "../mock/events";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import '../index.css'
import '../styles/pages/event-detail.css'



function EventDetailPage() {
    const { id } = useParams();

    const event = mockEvents.find(
        (item) => item.eventId === Number(id)
    );

    if (!event) {
        return <p>Event not found</p>;
    }

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
        <>

            <div className="container">
                <Header />
                <main className="event-detail">
                    <div className="event-detail_image-wrap">
                        <img
                            src={event.posterUrl}
                            alt={event.title}
                            className="event-detail_image"
                        />
                    </div>

                    <div className="event-detail_content">
                        <p className="event-detail_category">
                            {event.description || "Arts & Culture"}
                        </p>

                        <h1 className="event-detail_title">{event.title}</h1>

                        <p className="event-detail_time">{formattedDate}</p>
                        <p className="event-detail_venue">{event.venue || "Venue TBA"}</p>

                        <p className="event-detail_description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is where
                            your event detail description can go later when backend data is ready.
                        </p>
                    </div>
                </main>
            </div>

            <Footer />
        </>
    );
}

export default EventDetailPage;