
import { useState } from 'react'

import Header from './components/Header'
import Temples from './components/Temples'
import TempleDetails from './components/TempleDetails'
import DeityCategories from './components/DeityCategories'

import tirumala from './assets/temples/tirumala.jpg'
import meenakshi from './assets/temples/meenakshi.jpg'
import brihadeeswara from './assets/temples/brihadeeshwara.jpg'
import Slokas from './components/Slokas'
import SlokaReader from './components/SlokaReader'
import './App.css'

const states = [
  {
    name: 'Andhra Pradesh',
    image: tirumala
  },
  {
    name: 'Tamil Nadu',
    image: meenakshi
  },
  {
    name: 'Karnataka',
    image: '/temples/udupi.jpg'
  },
  {
    name: 'Telangana',
    image: brihadeeswara
  }
]

function App() {
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('all')
  const [selectedTemple, setSelectedTemple] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [selectedDeity, setSelectedDeity] = useState('all')

  const scrollToTemples = () => {
    document.getElementById('temples')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const selectState = (state) => {
    setSelectedState(state)
    scrollToTemples()
  }

  return (
    <div className="app">

      <Header />

      <section
        id="home"
        className="hero"
        style={{
          backgroundImage: `linear-gradient(
            rgba(18, 20, 25, 0.70),
            rgba(18, 20, 25, 0.72)
          ), url(${tirumala})`
        }}
      >
        <div className="hero-content">

          <span className="hero-label">
            DISCOVER INDIA'S SACRED HERITAGE
          </span>

          <h1>
            Explore the Divine
            <span> Temples of India</span>
          </h1>

          <p>
            Discover ancient temples, sacred traditions,
            spiritual destinations and the stories
            behind India's magnificent heritage.
          </p>

          <div className="hero-search">
            <input
              type="text"
              placeholder="Search temples, deities, cities..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  scrollToTemples()
                }
              }}
            />

            <button
              type="button"
              onClick={scrollToTemples}
            >
              Explore
            </button>
          </div>

        </div>
      </section>

      <section className="intro-section">
        <span className="section-label">
          YOUR SPIRITUAL JOURNEY BEGINS HERE
        </span>

        <h2>
          Discover Sacred Places
        </h2>

        <p>
          Explore temples by deity, location and tradition.
          Learn about the divine heritage and architectural
          wonders of India.
        </p>

        <div className="intro-stats">
          <div>
            <strong>Temples</strong>
            <span>Sacred Destinations</span>
          </div>

          <div>
            <strong>Deities</strong>
            <span>Divine Traditions</span>
          </div>

          <div>
            <strong>States</strong>
            <span>Explore India</span>
          </div>
        </div>
      </section>

      <section id="deities" className="content-section deity-section">
        <div className="section-heading">
          <span className="section-label">
            DIVINE DISCOVERY
          </span>
          <h2>Explore Temples by Deity</h2>
          <p>
            Find sacred temples dedicated to your
            favorite deities.
          </p>
        </div>

        <DeityCategories
          selectedDeity={selectedDeity}
          setSelectedDeity={setSelectedDeity}/>

        <button
          className="section-action"
          type="button"
          onClick={scrollToTemples}
        >
          View Matching Temples →
        </button>
      </section>

      <section id="states" className="content-section state-section">
        <div className="section-heading">
          <span className="section-label">
            DISCOVER REGIONS
          </span>
          <h2>Explore Temples by State</h2>
          <p>
            Experience India's spiritual heritage,
            one state at a time.
          </p>
        </div>

        <div className="state-grid">
          {states.map((state) => (
            <button
              type="button"
              className="state-card"
              key={state.name}
              onClick={() => selectState(state.name)}
            >
              <img
                src={state.image}
                alt={state.name}
              />

              <div className="state-card-content">
                <h3>{state.name}</h3>
                <span>Explore Temples →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="temples" className="content-section temples-section">
        <div className="section-heading">
          <span className="section-label">
            SACRED DESTINATIONS
          </span>
          <h2>Explore Temples</h2>
          <p>
            Discover temples and learn about their
            history, architecture and spiritual importance.
          </p>
        </div>

        <div className="temple-filters">
          <input
            type="text"
            placeholder="Search temples..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <select
            value={selectedState}
            onChange={(event) =>
              setSelectedState(event.target.value)
            }
          >
            <option value="all">All States</option>
            <option value="Andhra Pradesh">
              Andhra Pradesh
            </option>
            <option value="Tamil Nadu">
              Tamil Nadu
            </option>
            <option value="Karnataka">
              Karnataka
            </option>
            <option value="Telangana">
              Telangana
            </option>
          </select>

          <button
            type="button"
            className="reset-btn"
            onClick={() => {
              setSearch('')
              setSelectedState('all')
              setSelectedDeity('all')
            }}
          >
            Reset Filters
          </button>
        </div>

        <Temples
          search={search}
          selectedState={selectedState}
          setSelectedTemple={setSelectedTemple}
          setFavorites={setFavorites}
          favorites={favorites}
          selectedDeity={selectedDeity}
        />
      </section>
      <Slokas />
      <SlokaReader />
      <section id="about" className="about-section">
        <span className="section-label">
          ABOUT TEMPLE EXPLORER
        </span>

        <h2>Preserving Our Sacred Heritage</h2>

        <p>
          Temple Explorer is a digital journey through
          India's temples, spirituality, architecture
          and traditions. Our aim is to help visitors
          discover sacred places and learn about their
          cultural significance.
        </p>
      </section>

      <footer className="site-footer">
        <h3>🛕 Temple Explorer</h3>
        <p>Discover the Sacred Heritage of India</p>
        <span>
          © {new Date().getFullYear()} Temple Explorer
        </span>
      </footer>

      <TempleDetails
        temple={selectedTemple}
        setSelectedTemple={setSelectedTemple}
      />

    </div>
  )
}

export default App
