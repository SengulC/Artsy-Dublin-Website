import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from "react";

import Login from './pages/Login'

import logo from './assets/images/logo.png'
import bgl from './assets/images/bgl.png'
import test from './assets/images/test.jpg'
import './index.css'
import './App.css'

function HomePage() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3005/events")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setEvents(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <div className="container">
        <header className="header">
          <a href="/" className="header_logo">
            <img src={logo} alt="Artsy Dublin logo" />
          </a>

          <div className="header-inner">


            <div className="header__search">
              <input type="text" placeholder="Search" />
            </div>

            <nav className="header__nav">
              <a href="#">Events</a>
              <a href="#">Community</a>
              <a href="#">Message</a>
            </nav>

            <div className="header__user">
              👤
            </div>
          </div>

        </header>
        <div className="bgl">
          <img src={bgl} alt="" />
        </div>
        <h1>#Exhibtion</h1>

        <div className="events_grid">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <a href={event.url} target="_blank" rel="noopener noreferrer">

                <img src={test} alt={event.name} />

                <h3>{event.name}</h3>

              </a>

              <p>Monday 31 August 2021</p>

              <span>10 Attendees</span>
            </div>
          ))}
        </div>

        {/* footer section */}
        <footer className="footer">

          {/* CTA */}
          <div className="footer_cta">
            <h2 className="footer_title">Request More Information</h2>
            <p className="footer_text">
              Lift Media, LLC is a clinical stage healthcare company which is developing a unique.
            </p>
            <button className="footer_btn">Contact Us</button>
          </div>

          {/* Main Footer */}
          <div className="footer_main container">

            <div className="footer_logo">
              <img src={logo} alt="logo" />
            </div>

            <nav className="footer_nav">
              <a href="#">Team</a>
              <a href="#">Case Studies</a>
              <a href="#">Publications</a>
            </nav>

            <div className="footer_social">
              <span>🔗</span>
              <span>🔗</span>
              <span>🔗</span>
            </div>

          </div>

          {/* Bottom */}
          <div className="footer_bottom">
            © 2019 Bostel, LLC
          </div>

        </footer>
      </div>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
