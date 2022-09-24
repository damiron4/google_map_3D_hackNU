import React from 'react'
import { Helmet } from 'react-helmet'
import './main.css';

function App() {
  return (
    <div className="main-container">
      <Helmet>
        <title>exported project</title>
      </Helmet>
      <div className="main-main">
        <div className="main-timeline">
          <img
            src="/playground_assets/timline1719-9gjh.svg"
            alt="Timline1719"
            className="main-timline"
          />
          <img
            src="/playground_assets/timelinescrolldot1719-0ayr-200h.png"
            alt="TimelineScrollDot1719"
            className="main-timeline-scroll-dot"
          />
        </div>
        <img
          src="/playground_assets/sidebar1524-w7pe-700w.png"
          alt="Sidebar1524"
          className="main-sidebar"
        />
        <div className="main-user3">
          <span className="main-text">
            <span>Bob</span>
          </span>
          <span className="main-text02">
            <span>Last seen 14 min ago</span>
          </span>
          <div className="main-avatar">
            <img
              src="/playground_assets/ellipse1i177-bv8f-200h.png"
              alt="Ellipse1I177"
              className="main-ellipse1"
            />
            <img
              src="/playground_assets/image1i177-5yf-200h.png"
              alt="image1I177"
              className="main-image1"
            />
          </div>
          <div className="main-g-p-sbutton">
            <img
              src="/playground_assets/ellipse3i177-pu4l-200h.png"
              alt="Ellipse3I177"
              className="main-ellipse3"
            />
            <img
              src="/playground_assets/gps1i177-di7o-200w.png"
              alt="gps1I177"
              className="main-gps1"
            />
          </div>
        </div>
        <div className="main-user2">
          <span className="main-text04">
            <span>Alice</span>
          </span>
          <span className="main-text06">
            <span>Last seen 14 min ago</span>
          </span>
          <div className="main-avatar1">
            <img
              src="/playground_assets/ellipse1i176-fk7r-200h.png"
              alt="Ellipse1I176"
              className="main-ellipse11"
            />
            <img
              src="/playground_assets/image1i176-gg5-200h.png"
              alt="image1I176"
              className="main-image11"
            />
          </div>
          <div className="main-g-p-sbutton1">
            <img
              src="/playground_assets/ellipse3i176-i8bq-200h.png"
              alt="Ellipse3I176"
              className="main-ellipse31"
            />
            <img
              src="/playground_assets/gps1i176-5l0q-200w.png"
              alt="gps1I176"
              className="main-gps11"
            />
          </div>
        </div>
        <div className="main-user1">
          <span className="main-text08">
            <span>Charlie</span>
          </span>
          <span className="main-text10">
            <span>Last seen 14 min ago</span>
          </span>
          <div className="main-avatar2">
            <img
              src="/playground_assets/ellipse1i153-mp8r-200h.png"
              alt="Ellipse1I153"
              className="main-ellipse12"
            />
            <img
              src="/playground_assets/image1i153-q3xc-200h.png"
              alt="image1I153"
              className="main-image12"
            />
          </div>
          <div className="main-g-p-sbutton2">
            <img
              src="/playground_assets/ellipse3i153-exm-200h.png"
              alt="Ellipse3I153"
              className="main-ellipse32"
            />
            <img
              src="/playground_assets/gps1i153-5wy-200w.png"
              alt="gps1I153"
              className="main-gps12"
            />
          </div>
        </div>
        <div className="main-searchbar">
          <div className="main-group3">
            <span className="main-text12">
              <span>Find me</span>
            </span>
          </div>
          <img
            src="/playground_assets/searchsign1662-jyln-200h.png"
            alt="Searchsign1662"
            className="main-searchsign"
          />
        </div>
        <img
          src="/playground_assets/headbar2335-3m04-200h.png"
          alt="Headbar2335"
          className="main-headbar"
        />
      </div>
    </div>
  );
}

export default App;
