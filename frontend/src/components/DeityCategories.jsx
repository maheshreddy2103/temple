
import { useEffect, useState } from 'react'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001'

function DeityCategories({
  selectedDeity = 'all',
  setSelectedDeity
}) {
  const [deities, setDeities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchDeities() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/api/deities`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        if (!data.success || !Array.isArray(data.deities)) {
          throw new Error('Invalid deity API response')
        }

        setDeities(data.deities)
      } catch (err) {
        if (controller.signal.aborted) return

        console.error('Failed to load deities:', err)

        setError(
          'Unable to load deities from the database.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchDeities()

    return () => controller.abort()
  }, [retryCount])

  function handleSelect(deityName) {
    setSelectedDeity(deityName)

    document.getElementById('temples')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <section
      id="deities"
      className="deity-gallery-section"
    >
      <div className="section-heading">
        <span className="section-label">
          DIVINE EXPLORATION
        </span>

        <h2>Explore by Deity</h2>

        <p>
          Select a deity to discover associated temples.
        </p>
      </div>

      {error && (
        <div className="deity-api-message" role="alert">
          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              setRetryCount(count => count + 1)
            }
          >
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <p className="deity-api-message" role="status">
          Loading deities...
        </p>
      )}

      {!loading && !error && (
        <div className="deity-compact-grid">

          {/* All Deities */}
          <button
            type="button"
            className={`deity-compact-item ${
              selectedDeity === 'all' ? 'active' : ''
            }`}
            aria-pressed={selectedDeity === 'all'}
            onClick={() => handleSelect('all')}
          >
            <div className="deity-compact-image">
              <span className="deity-all-icon">
                🛕
              </span>
            </div>

            <span className="deity-compact-name">
              All Deities
            </span>
          </button>

          {/* Deities from MySQL */}
          {deities.map(deity => (
            <button
              type="button"
              key={deity.id}
              className={`deity-compact-item ${
                selectedDeity === deity.name ? 'active' : ''
              }`}
              aria-pressed={selectedDeity === deity.name}
              onClick={() => handleSelect(deity.name)}
            >
              <div className="deity-compact-image">
                {deity.image ? (
                  <img
                    src={deity.image}
                    alt={deity.name}
                    loading="lazy"
                    onError={event => {
                      event.currentTarget.style.display =
                        'none'
                    }}
                  />
                ) : (
                  <span className="deity-all-icon">
                    🙏
                  </span>
                )}
              </div>

              <span className="deity-compact-name">
                {deity.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && deities.length === 0 && (
        <p className="deity-api-message">
          No deity records found in the database.
        </p>
      )}
    </section>
  )
}

export default DeityCategories


