import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { checkSaves } from "./utils/postHelpers";
import HomeIntroLoader from "./components/layout/HomeIntroLoader";

import Login from './pages/Login'
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import mockEvents from "./mock/events";
import EventCard from "./components/events/EventCard";
import EventDetailPage from './pages/EventDetailPage'
import PostDetailPage from "./pages/PostDetailPage";
import WritePostPage from "./pages/WritePostPage";
import PostsPage from "./pages/PostsPage";
import FilterBar from "./components/events/FilterBar";
import MarqueeText from "./components/layout/MarqueeText";
import Register from "./pages/register";
import ForgetPassword from "./pages/ForgetPassword";
import TeamPage from "./pages/TeamPage"
import Inbox from "./pages/Inbox"
import Me from "./pages/Me";
import Chat from "./pages/Chat";
import UserProfile from "./pages/UserProfile";
import ProfilePage from "./pages/ProfilePage";
import AllEventsPage from "./pages/AllEventsPage";
import NotFoundPage from "./pages/NotFoundPage";

import './index.css'
import './styles/component.css'
import './styles/pages/home.css'

function HomePage() {
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeDate, setActiveDate] = useState("Upcoming");
  const [sortOrder, setSortOrder] = useState("Soonest");
  const [visibleCount, setVisibleCount] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [savedEventIds, setSavedEventIds] = useState([]);
  const { dbUser, authLoading } = useAuth();
  const navigate = useNavigate();
  const showcaseRef = useRef(null);
  const [showcaseProgress, setShowcaseProgress] = useState(0);
  const [activeShowcaseEvent, setActiveShowcaseEvent] = useState(null);
  const [introDone, setIntroDone] = useState(() => {
    return sessionStorage.getItem("artsyIntroPlayed") === "true";
  });

  const handleIntroFinish = () => {
    sessionStorage.setItem("artsyIntroPlayed", "true");
    setIntroDone(true);
  };

  useEffect(() => {
    setVisibleCount(8);
  }, [activeCategories, activeDate, sortOrder, searchTerm]);


  useEffect(() => {
    if (authLoading) return;
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        let url = dbUser?.userId
          ? `/ad-events/personalizedEvents/${dbUser.userId}`
          : `/ad-events`;

        let res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch events");
        let data = await res.json();

        // fallback if personalized returns empty
        if (data.length === 0 && dbUser?.userId) {
          const fallbackRes = await fetch(`/ad-events`);
          if (!fallbackRes.ok) throw new Error("Failed to fetch events");
          data = await fallbackRes.json();
        }

        const normalizedEvents = data.map((event, index) => ({
          eventId: event.eventId ?? index,
          title: event.title ?? "",
          url: event.url ?? "",
          description: event.description ?? "",
          venue: event.venue ?? "",
          startDateTime: event.startDateTime ?? "",
          posterUrl: event.posterUrl ?? event.posterURL ?? "",
          attendCount: event.attendCount ?? 0,
          reviewCount: event.reviewCount ?? 0,
          saveCount: event.saveCount ?? 0,
          eventTypeId: event.eventTypeId ?? ""
        }));

        setEvents(normalizedEvents);
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Could not load live events. Showing mock data instead.");
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [dbUser?.userId, authLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (!showcaseRef.current) return;

      const rect = showcaseRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight;
      const end = -rect.height;
      const total = start - end;
      const current = start - rect.top;
      const progress = Math.min(Math.max(current / total, 0), 1);

      setShowcaseProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (!dbUser?.userId || loading || !events.length) return;

    checkSaves(events.map((e) => e.eventId))
      .then(setSavedEventIds)
      .catch((err) => console.error("Failed to check saves:", err));
  }, [events, dbUser?.userId, loading]);

  function getEventTags(event) {
    if (event.eventTypeId === "tmdbFilm") return ["Film"];

    return event.description
      ? event.description.split(",").map(tag => tag.trim())
      : [];
  }

  const today = new Date();

  function getEventTypeLabel(eventTypeId) {
    if (eventTypeId === "tmdbFilm") return "Film";
    if (eventTypeId === "KZFzniwnSyZfZ7v7nJ") return "Music";
    if (eventTypeId === "KZFzniwnSyZfZ7v7na") return "Arts & Theatre";
    return "Other";
  }

  function formatShowcaseDate(dateString) {
    if (!dateString) return "Coming soon";

    const date = new Date(dateString.replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return "Coming soon";

    return date.toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const filteredEvents = events
    .filter((event) => {
      const matchesCategory =
        activeCategories.length === 0 ||
        activeCategories.includes(getEventTypeLabel(event.eventTypeId));

      let matchesDate = true;

      if (event.startDateTime) {
        const eventDate = new Date(event.startDateTime.replace(" ", "T"));

        if (activeDate === "Upcoming") {
          matchesDate = eventDate >= today;
        }

        if (activeDate === "This Week") {
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          matchesDate = eventDate >= today && eventDate <= nextWeek;
        }

        if (activeDate === "This Month") {
          matchesDate =
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear();
        }
      }

      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        search === "" ||
        event.title?.toLowerCase().includes(search) ||
        event.venue?.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search);

      return matchesCategory && matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = a.startDateTime
        ? new Date(a.startDateTime.replace(" ", "T"))
        : null;
      const dateB = b.startDateTime
        ? new Date(b.startDateTime.replace(" ", "T"))
        : null;

      if (!dateA) return 1;
      if (!dateB) return -1;

      return sortOrder === "Soonest"
        ? dateA - dateB
        : dateB - dateA;
    });

  const filmEventsSource = (filteredEvents.length > 0 ? filteredEvents : events).filter(
    (event) =>
      event.eventTypeId === "tmdbFilm" ||
      event.eventTypeName === "Film"
  );

  const showcaseEvents =
    filmEventsSource.length > 0
      ? filmEventsSource.slice(0, 12)
      : (filteredEvents.length > 0 ? filteredEvents : events).slice(0, 12);

  const leftRailEvents = showcaseEvents.filter((_, index) => index % 2 === 0);
  const rightRailEvents = showcaseEvents.filter((_, index) => index % 2 !== 0);

  const leftTranslate = -showcaseProgress * 220;
  const rightTranslate = showcaseProgress * 320;

  const currentShowcaseEvent =
    activeShowcaseEvent ||
    showcaseEvents[0] || {
      title: "Discover Dublin’s film scene",
      venue: "Artsy Dublin",
      description: "Browse curated screenings, theatre, music films and creative events across the city.",
      posterUrl: "",
    };

  return (

    <>

      <div className="home-header-overlay">
        <Header
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSearch={() => setSearchTerm(inputValue.trim())} />
      </div>

      <HomeIntroLoader
        events={events}
        titleTop="ARTSY DUBLIN"
        titleMiddle="FIND YOUR"
        titleBottom="NEXT EVENT"
      />
      {/* <div>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="section-bg-text">Artsy<br></br>Dublin</div>
        <div className="container">

          <div className="home-hero">
            <div className="home-hero__info"
            ><h1 className="home-hero__title">What’s On</h1>
              <p className="home-hero__subtitle">
                Discover events, films, comedy and more across Dublin
              </p>
            </div>

            <FilterBar
              activeCategories={activeCategories}
              setActiveCategories={setActiveCategories}
              activeDate={activeDate}
              setActiveDate={setActiveDate}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>

          {loading && <p className="status-message">Loading events...</p>}
          {error && <p className="status-message error">{error}</p>}
          {filteredEvents.length === 0 && !loading && (
            <p className="status-message">No matching events found.</p>
          )}

          <div className="events_grid">
            {filteredEvents.slice(0, visibleCount).map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
              // variant={getCardVariant(index)}
              />
            ))}
          </div>
          {visibleCount < filteredEvents.length && (
            <div className="show-more-wrap">
              <button
                className="show-more-btn"
                onClick={() => setVisibleCount(visibleCount + 8)}
              >
                Show More
              </button>
            </div>
          )}

          <MarqueeText />

          <CalendarSection events={events} savedEventIds={savedEventIds} />
          <Footer />
        </div>

      </div> */}

      <div className={`home-page-shell ${introDone ? "intro-done" : ""}`}>

        <div className="section-bg-text">Artsy<br />Dublin</div>

        <div className="container">
          <div className="home-hero home-hero--after-intro">
            <FilterBar
              activeCategories={activeCategories}
              setActiveCategories={setActiveCategories}
              activeDate={activeDate}
              setActiveDate={setActiveDate}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
          <section className="home-showcase" ref={showcaseRef}>
            <div className="home-showcase__intro">
              <p className="home-showcase__eyebrow">Featured Screenings</p>

              <h2 className="home-showcase__title">
                DISCOVER <br />

                <span className="word-accent">ART</span>
                <span className="dot"> • </span>

                <span className="word-red">FILM</span>
                <span className="dot"> • </span>

                <span className="word-blue">MUSIC</span>
              </h2>

              <p className="home-showcase__desc">
                Move through Dublin’s creative nights.
              </p>

              <p className="home-showcase__desc">
                Artsy Dublin helps you explore cinema, theatre, exhibitions and creative
                nights worth leaving the house for. Save events, revisit details and find
                your next cultural plan.
              </p>

              <div className="home-showcase__meta">
                <span>{getEventTypeLabel(currentShowcaseEvent.eventTypeId)}</span>
                <span>•</span>
                <span>{currentShowcaseEvent.venue || "Dublin"}</span>
                <span>•</span>
                <span>{formatShowcaseDate(currentShowcaseEvent.startDateTime)}</span>
              </div>

              <h3 className="home-showcase__event-title">
                {currentShowcaseEvent.title}
              </h3>

              <p className="home-showcase__event-desc">
                {currentShowcaseEvent.description && currentShowcaseEvent.description.length > 180
                  ? `${currentShowcaseEvent.description.slice(0, 180)}...`
                  : currentShowcaseEvent.description || "Explore this event for more details."}
              </p>

              <div className="home-showcase__actions">
                <button
                  className="home-showcase__btn home-showcase__btn--primary"
                  onClick={() =>
                    currentShowcaseEvent?.eventId &&
                    navigate(`/events/${currentShowcaseEvent.eventId}`)
                  }
                >
                  View Event
                </button>

                <button
                  className="home-showcase__btn home-showcase__btn--ghost"
                  onClick={() => navigate("/events")}
                >
                  Browse All Events
                </button>
              </div>
            </div>

            <div className="home-showcase__rails">
              <div
                className="poster-rail poster-rail--up"
                style={{ transform: `translateY(${leftTranslate}px)` }}
              >
                {[...leftRailEvents, ...leftRailEvents].map((event, index) => (
                  <button
                    key={`${event.eventId}-${index}-left`}
                    className={`poster-card ${activeShowcaseEvent?.eventId === event.eventId ? "is-active" : ""
                      }`}
                    onMouseEnter={() => setActiveShowcaseEvent(event)}
                    onFocus={() => setActiveShowcaseEvent(event)}
                    onClick={() => navigate(`/events/${event.eventId}`)}
                    type="button"
                  >
                    <img
                      src={event.posterUrl || "https://via.placeholder.com/400x600?text=No+Poster"}
                      alt={event.title}
                      className="poster-card__img"
                    />
                    <div className="poster-card__overlay">
                      <p className="poster-card__type">{getEventTypeLabel(event.eventTypeId)}</p>
                      <h4>{event.title}</h4>
                      <span>{event.venue || "Dublin"}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div
                className="poster-rail poster-rail--down"
                style={{ transform: `translateY(${rightTranslate}px)` }}
              >
                {[...rightRailEvents, ...rightRailEvents].map((event, index) => (
                  <button
                    key={`${event.eventId}-${index}-right`}
                    className={`poster-card ${activeShowcaseEvent?.eventId === event.eventId ? "is-active" : ""
                      }`}
                    onMouseEnter={() => setActiveShowcaseEvent(event)}
                    onFocus={() => setActiveShowcaseEvent(event)}
                    onClick={() => navigate(`/events/${event.eventId}`)}
                    type="button"
                  >
                    <img
                      src={event.posterUrl || "https://via.placeholder.com/400x600?text=No+Poster"}
                      alt={event.title}
                      className="poster-card__img"
                    />
                    <div className="poster-card__overlay">
                      <p className="poster-card__type">{getEventTypeLabel(event.eventTypeId)}</p>
                      <h4>{event.title}</h4>
                      <span>{event.venue || "Dublin"}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {loading && <p className="status-message">Loading events...</p>}
          {error && <p className="status-message error">{error}</p>}
          {filteredEvents.length === 0 && !loading && (
            <p className="status-message">No matching events found.</p>
          )}

          <div className="events_grid">
            {filteredEvents.slice(0, visibleCount).map((event) => (
              <EventCard key={event.eventId} event={event} savedInit={savedEventIds.includes(event.eventId)} />
            ))}
          </div>

          {visibleCount < filteredEvents.length && (
            <div className="show-more-wrap">
              <button
                className="show-more-btn"
                onClick={() => setVisibleCount(visibleCount + 8)}
              >
                Show More
              </button>
            </div>
          )}

          <MarqueeText />
          <CalendarSection events={events} savedEventIds={savedEventIds} />
          <Footer />
        </div>
      </div>
    </>
  );
}

function CalendarSection({ events, savedEventIds = [] }) {
  function isSameDay(dateA, dateB) {
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  }

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, 1 = Monday...
    const diff = day === 0 ? -6 : 1 - day; // 以 Monday 當一週開始
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getEndOfWeek(date) {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }
  const [openThisWeek, setOpenThisWeek] = useState(false);
  const [openNextWeek, setOpenNextWeek] = useState(false);

  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const startOfThisWeek = getStartOfWeek(now);
  const endOfThisWeek = getEndOfWeek(now);

  const startOfNextWeek = new Date(startOfThisWeek);
  startOfNextWeek.setDate(startOfThisWeek.getDate() + 7);
  startOfNextWeek.setHours(0, 0, 0, 0);

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
  endOfNextWeek.setHours(23, 59, 59, 999);

  const datedEvents = events
    .filter((event) => event.startDateTime)
    .map((event) => ({
      ...event,
      parsedDate: new Date(event.startDateTime),
    }))
    .sort((a, b) => a.parsedDate - b.parsedDate);

  const todayEvents = datedEvents.filter((event) =>
    isSameDay(event.parsedDate, now)
  );

  const tomorrowEvents = datedEvents.filter((event) =>
    isSameDay(event.parsedDate, tomorrow)
  );

  const thisWeekEvents = datedEvents.filter((event) => {
    return (
      event.parsedDate >= startOfThisWeek &&
      event.parsedDate <= endOfThisWeek &&
      !isSameDay(event.parsedDate, now) &&
      !isSameDay(event.parsedDate, tomorrow)
    );
  });

  const nextWeekEvents = datedEvents.filter((event) => {
    return (
      event.parsedDate >= startOfNextWeek &&
      event.parsedDate <= endOfNextWeek
    );
  });


  const hasCalendarEvents =
    todayEvents.length > 0 ||
    tomorrowEvents.length > 0 ||
    thisWeekEvents.length > 0 ||
    nextWeekEvents.length > 0;

  const upcomingEvents = datedEvents.slice(0, 6);

  return (
    <section className="calendar">
      <div className="calendar__header">
        <h2 className="calendar__title">Calendar</h2>
        <a href="#" className="calendar__link">
          ALL CREATED EVENTS →
        </a>
      </div>

      {!hasCalendarEvents && (
        <div className="calendar__fallback">
          <div className="calendar__group-header">
            <h3>Upcoming Events</h3>
            <span>↑</span>
          </div>

          <div className="calendar__grid">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard
                  key={event.eventId ?? event.title}
                  event={event}
                  savedInit={savedEventIds.includes(event.eventId)}
                />
              ))
            ) : (
              <p>No upcoming events available.</p>
            )}
          </div>
        </div>
      )}

      {hasCalendarEvents && (
        <>
          <div className="calendar__group">
            <div className="calendar__group-header">
              <h3>Today</h3>
              <span>{todayEvents.length > 0 ? "↑" : "—"}</span>
            </div>

            <div className="calendar__grid">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <EventCard key={event.eventId ?? event.title} event={event} />
                ))
              ) : (
                <p>No events today.</p>
              )}
            </div>
          </div>

          <div className="calendar__group">
            <div className="calendar__group-header">
              <h3>Tomorrow</h3>
              <span>{tomorrowEvents.length > 0 ? "↑" : "—"}</span>
            </div>

            <div className="calendar__grid">
              {tomorrowEvents.length > 0 ? (
                tomorrowEvents.map((event) => (
                  <EventCard key={event.eventId ?? event.title} event={event} />
                ))
              ) : (
                <p>No events tomorrow.</p>
              )}
            </div>
          </div>

          <div className="calendar__collapsed">
            <button
              type="button"
              className="calendar__collapsed-row"
              onClick={() => setOpenThisWeek(!openThisWeek)}
              aria-expanded={openThisWeek}
            >
              <span>This week</span>
              <span>{openThisWeek ? "↑" : "↓"}</span>
            </button>

            {openThisWeek && (
              <div className="calendar__grid">
                {thisWeekEvents.length > 0 ? (
                  thisWeekEvents.map((event) => (
                    <EventCard key={event.eventId ?? event.title} event={event} />
                  ))
                ) : (
                  <p>No more events this week.</p>
                )}
              </div>
            )}

            <button
              type="button"
              className="calendar__collapsed-row"
              onClick={() => setOpenNextWeek(!openNextWeek)}
              aria-expanded={openNextWeek}
            >
              <span>Next week</span>
              <span>{openNextWeek ? "↑" : "↓"}</span>
            </button>

            {openNextWeek && (
              <div className="calendar__grid">
                {nextWeekEvents.length > 0 ? (
                  nextWeekEvents.map((event) => (
                    <EventCard key={event.eventId ?? event.title} event={event} />
                  ))
                ) : (
                  <p>No events next week.</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          <div className="auth-layout">
            <div className="auth-bg-blur" aria-hidden="true"><HomePage /></div>
            <Login />
          </div>
        } />
        <Route path="/events" element={<AllEventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/register" element={
          <div className="auth-layout">
            <div className="auth-bg-blur" aria-hidden="true"><HomePage /></div>
            <Register />
          </div>
        } />
        <Route path="/forget-password" element={
          <div className="auth-layout">
            <div className="auth-bg-blur" aria-hidden="true"><HomePage /></div>
            <ForgetPassword />
          </div>
        } />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/me" element={<Me />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/events/:eventId/write-post/:eventAttendId" element={<WritePostPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/messages" element={<Inbox />} />
        <Route path="/messages/:conversationId" element={<Chat />} />
        <Route path="/users/:username" element={<UserProfile />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
