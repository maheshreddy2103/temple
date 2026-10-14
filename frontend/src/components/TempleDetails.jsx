
import { useEffect } from 'react'

function TempleDetails({ temple, setSelectedTemple }) {
  useEffect(() => {
    if (!temple) return

    window.scrollTo({ top: 0, behavior: 'smooth' })

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedTemple(null)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [temple, setSelectedTemple])

  if (!temple) {
    return null
  }

  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${temple.name}, ${temple.location}`
    )}`

  const details = [
    {
      title: 'Main Deity',
      value: temple.deity,
      icon: '🙏'
    },
    {
      title: 'Location',
      value: temple.location,
      icon: '📍'
    },
    {
      title: 'Darshan Timings',
      value: temple.timings || 'Timings to be updated',
      icon: '🕒'
    },
    {
      title: 'Major Festivals',
      value: temple.festivals || 'Festival details to be updated',
      icon: '🪔'
    }
  ]

  return (
    <div className="temple-page">

      <div className="temple-page-topbar">
        <button
          type="button"
          className="temple-back-btn"
          onClick={() => setSelectedTemple(null)}
        >
          ← Back to Temples
        </button>
      </div>

      <div className="temple-page-hero">
        <img
          src={temple.image}
          alt={temple.name}
        />

        <div className="temple-page-hero-content">
          <span>DISCOVER SACRED INDIA</span>
          <h1>{temple.name}</h1>
          <p>📍 {temple.location}</p>
        </div>
      </div>

      <div className="temple-page-container">

        <div className="temple-page-intro">
          <span className="temple-page-label">
            SACRED DESTINATION
          </span>

          <h2>About {temple.name}</h2>

          <p>{temple.description}</p>
        </div>

        <section className="temple-info-section">
          <h2>Temple Information</h2>

          <div className="temple-info-grid">
            {details.map((detail) => (
              <div
                className="temple-info-card"
                key={detail.title}
              >
                <span className="temple-info-icon">
                  {detail.icon}
                </span>

                <div>
                  <h3>{detail.title}</h3>
                  <p>{detail.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="temple-history-section">
          <h2>History & Significance</h2>

          <p>
            {temple.history ||
              'Detailed historical information and spiritual significance will be added soon.'}
          </p>
        </section>

        <section className="temple-gallery-section">
          <h2>Temple Gallery</h2>

          <div className="temple-gallery-grid">
            {(temple.gallery?.length
              ? temple.gallery
              : [temple.image]
            ).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${temple.name} - ${index + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        </section>

        <section className="temple-directions-section">
          <h2>How to Reach</h2>

          <p>
            {temple.howToReach ||
              `Explore directions and travel options to ${temple.name} in ${temple.location}.`}
          </p>
          {temple.officialWebsite && (
          <a
            className="temple-maps-btn"
            href={temple.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 Official Temple Information ↗
          </a>)}
        </section>

      </div>
    </div>
  )
}

export default TempleDetails
