import { useEffect, useState } from 'react'

import tirumalaImage from '../assets/temples/tirumala.jpg'
import meenakshiImage from '../assets/temples/meenakshi.jpg'
import brihadeeshwaraImage from '../assets/temples/brihadeeshwara.jpg'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001'

const localImages = {
  'Tirumala Venkateswara Temple': tirumalaImage,
  'Meenakshi Amman Temple': meenakshiImage,
  'Brihadeeswara Temple': brihadeeshwaraImage
}

function Temples({
  search = '',
  selectedState = 'all',
  selectedDeity = 'all',
  setSelectedTemple,
  favorites = [],
  setFavorites
}) {
  const [temples, setTemples] = useState([])
  const [deities, setDeities] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const [showAddTemple, setShowAddTemple] = useState(false)
  const [addingTemple, setAddingTemple] = useState(false)
  const [addMessage, setAddMessage] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  
const [showNewDeity, setShowNewDeity] = useState(false)
const [newDeityName, setNewDeityName] = useState('')
const [addingDeity, setAddingDeity] = useState(false)
const [deityMessage, setDeityMessage] = useState('')

  const [form, setForm] = useState({
    name: '',
    city: '',
    state: '',
    deity: '',
    description: '',
    history: '',
    significance: '',
    timings: '',
    festivals: '',
    howToReach: '',
    officialWebsite: '',
    image: null
  })

  async function fetchTemples() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/api/temples`
      )

      if (!response.ok) {
        throw new Error(
          `Backend returned HTTP ${response.status}`
        )
      }

      const data = await response.json()

      if (!data.success || !Array.isArray(data.temples)) {
        throw new Error('Invalid response from backend')
      }

      setTemples(data.temples)
    } catch (err) {
      console.error('Failed to load temples:', err)

      setError(
        'Unable to load temples. Check your backend and MySQL connection.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function fetchDeities() {
    try {
      const response = await fetch(
        `${API_URL}/api/deities`
      )

      if (!response.ok) {
        throw new Error('Unable to load deities')
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.deities)) {
        setDeities(data.deities)
      }
    } catch (err) {
      console.error('Failed to load deities:', err)
    }
  }

  useEffect(() => {
    fetchTemples()
    fetchDeities()
    
async function handleAddDeity() {
  const name = newDeityName.trim()

  if (!name) {
    setDeityMessage('Please enter a deity name.')
    return
  }

  try {
    setAddingDeity(true)
    setDeityMessage('')

    const response = await fetch(`${API_URL}/api/deities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })

    const data = await response.json()

    if (response.status === 409) {
      await fetchDeities()

      const existingDeity = deities.find(
        (deity) => deity.name.toLowerCase() === name.toLowerCase()
      )

      if (existingDeity) {
        setForm((previous) => ({
          ...previous,
          deity: existingDeity.name
        }))
      }

      setDeityMessage('This deity already exists.')
      return
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to add deity.')
    }

    const savedDeity = data.deity

    await fetchDeities()

    setForm((previous) => ({
      ...previous,
      deity: savedDeity.name
    }))

    setNewDeityName('')
    setShowNewDeity(false)
    setDeityMessage(`${savedDeity.name} added and selected successfully!`)
  } catch (error) {
    console.error('ADD DEITY ERROR:', error)
    setDeityMessage(error.message || 'Unable to add deity.')
  } finally {
    setAddingDeity(false)
  }
}

  }, [retryCount])

  const filteredTemples = temples.filter((temple) => {
    const query = search.trim().toLowerCase()

    const matchesSearch =
      !query ||
      [
        temple.name,
        temple.city,
        temple.state,
        temple.deity
      ].some((value) =>
        String(value || '').toLowerCase().includes(query)
      )

    const matchesState =
      selectedState === 'all' ||
      temple.state === selectedState

    const matchesDeity =
      selectedDeity === 'all' ||
      temple.deity === selectedDeity

    return matchesSearch && matchesState && matchesDeity
  })

  function toggleFavorite(templeId) {
    setFavorites((previous) =>
      previous.includes(templeId)
        ? previous.filter((id) => id !== templeId)
        : [...previous, templeId]
    )
  }

  function getTempleImage(temple) {
    if (localImages[temple.name]) {
      return localImages[temple.name]
    }

    if (!temple.image) {
      return ''
    }

    if (
      temple.image.startsWith('http://') ||
      temple.image.startsWith('https://')
    ) {
      return temple.image
    }

    return `${API_URL}${temple.image}`
  }

  function openDetails(temple) {
    setSelectedTemple({
      ...temple,
      location: [temple.city, temple.state]
        .filter(Boolean)
        .join(', '),
      image: getTempleImage(temple)
    })
  }

  function handleFormChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setForm((previous) => ({
      ...previous,
      image: file
    }))

    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  function resetForm() {
    setForm({
      name: '',
      city: '',
      state: '',
      deity: '',
      description: '',
      history: '',
      significance: '',
      timings: '',
      festivals: '',
      howToReach: '',
      officialWebsite: '',
      image: null
    })

    setImagePreview('')
    setAddMessage('')
  }

  async function handleAddTemple(event) {
    event.preventDefault()

    if (!form.name.trim() || !form.state.trim() || !form.deity) {
      setAddMessage(
        'Temple name, state and deity are required.'
      )
      return
    }

    try {
      setAddingTemple(true)
      setAddMessage('')

      const formData = new FormData()

      formData.append('name', form.name)
      formData.append('city', form.city)
      formData.append('state', form.state)
      formData.append('deity', form.deity)
      formData.append('description', form.description)
      formData.append('history', form.history)
      formData.append('significance', form.significance)
      formData.append('timings', form.timings)
      formData.append('festivals', form.festivals)
      formData.append('howToReach', form.howToReach)
      formData.append('officialWebsite', form.officialWebsite)

      if (form.image) {
        formData.append('image', form.image)
      }

      const response = await fetch(
        `${API_URL}/api/temples`,
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to add temple'
        )
      }

      setAddMessage('Temple added successfully! 🛕')

      resetForm()

      // Reload database data.
      await fetchTemples()

      setTimeout(() => {
        setShowAddTemple(false)
        setAddMessage('')
      }, 1200)
    } catch (err) {
      console.error('ADD TEMPLE ERROR:', err)

      setAddMessage(
        err.message || 'Unable to add temple'
      )
    } finally {
      setAddingTemple(false)
    }
  }

  if (loading) {
    return (
      <div className="temple-results-message" role="status">
        <p>🛕 Loading temples from database...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="temple-results-message" role="alert">
        <p>{error}</p>

        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      {/* ADD TEMPLE BUTTON */}
      <div className="add-temple-toolbar">
        <button
          type="button"
          className="add-temple-button"
          onClick={() => {
            setShowAddTemple((value) => !value)
            setAddMessage('')
          }}
        >
          {showAddTemple ? '✕ Close' : '＋ Add Temple'}
        </button>
      </div>

      {/* ADD TEMPLE FORM */}
      {showAddTemple && (
        <section className="add-temple-panel">
          <div className="add-temple-header">
            <div>
              <h2>Add New Temple</h2>
              <p>
                Add the temple details and upload its image.
              </p>
            </div>
          </div>

          <form
            className="add-temple-form"
            onSubmit={handleAddTemple}
          >
            <div className="add-temple-form-grid">

              <div className="form-field">
                <label htmlFor="temple-name">
                  Temple Name *
                </label>

                <input
                  id="temple-name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter temple name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="temple-deity">
                  Deity *
                </label>

                <select
                  id="temple-deity"
                  name="deity"
                  value={form.deity}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">
                    Select deity
                  </option>

                  {deities.map((deity) => (
                    <option
                      key={deity.id}
                      value={deity.name}
                    >
                      {deity.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="temple-city">
                  City
                </label>

                <input
                  id="temple-city"
                  name="city"
                  value={form.city}
                  onChange={handleFormChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="form-field">
                <label htmlFor="temple-state">
                  State *
                </label>

                <input
                  id="temple-state"
                  name="state"
                  value={form.state}
                  onChange={handleFormChange}
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="temple-description">
                  Description
                </label>

                <textarea
                  id="temple-description"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Short description"
                  rows="3"
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="temple-history">
                  History
                </label>

                <textarea
                  id="temple-history"
                  name="history"
                  value={form.history}
                  onChange={handleFormChange}
                  placeholder="Temple history"
                  rows="4"
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="temple-significance">
                  Significance
                </label>

                <textarea
                  id="temple-significance"
                  name="significance"
                  value={form.significance}
                  onChange={handleFormChange}
                  placeholder="Religious or historical significance"
                  rows="3"
                />
              </div>

              <div className="form-field">
                <label htmlFor="temple-timings">
                  Timings
                </label>

                <input
                  id="temple-timings"
                  name="timings"
                  value={form.timings}
                  onChange={handleFormChange}
                  placeholder="6:00 AM - 9:00 PM"
                />
              </div>

              <div className="form-field">
                <label htmlFor="temple-festivals">
                  Festivals
                </label>

                <input
                  id="temple-festivals"
                  name="festivals"
                  value={form.festivals}
                  onChange={handleFormChange}
                  placeholder="Major festivals"
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="temple-how-to-reach">
                  How to Reach
                </label>

                <textarea
                  id="temple-how-to-reach"
                  name="howToReach"
                  value={form.howToReach}
                  onChange={handleFormChange}
                  placeholder="Travel and transportation information"
                  rows="3"
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="temple-website">
                  Official Website
                </label>

                <input
                  id="temple-website"
                  name="officialWebsite"
                  type="url"
                  value={form.officialWebsite}
                  onChange={handleFormChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="temple-image">
                  Temple Image
                </label>

                <input
                  id="temple-image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                <small>
                  JPG, PNG or WEBP — maximum 5 MB
                </small>

                {imagePreview && (
                  <div className="add-temple-image-preview">
                    <img
                      src={imagePreview}
                      alt="Temple preview"
                    />
                  </div>
                )}
              </div>

            </div>

            {addMessage && (
              <div
                className="add-temple-message"
                role="status"
              >
                {addMessage}
              </div>
            )}

            <div className="add-temple-actions">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowAddTemple(false)
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={addingTemple}
              >
                {addingTemple
                  ? 'Adding Temple...'
                  : '🛕 Add Temple'}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="temple-results-count">
        Showing {filteredTemples.length} of {temples.length} temples
      </div>

      {filteredTemples.length === 0 ? (
        <div className="temple-results-message">
          <p>No temples found matching your filters.</p>
        </div>
      ) : (
        <div className="temple-container">
          {filteredTemples.map((temple) => {
            const isFavorite = favorites.includes(temple.id)
            const image = getTempleImage(temple)

            return (
              <article
                className="temple-card"
                key={temple.id}
              >
                <div className="temple-image-wrapper">
                  <div className="temple-image-fallback">
                    🛕
                  </div>

                  {image && (
                    <img
                      src={image}
                      alt={temple.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                </div>

                <h2>{temple.name}</h2>

                <p>
                  📍 {[temple.city, temple.state]
                    .filter(Boolean)
                    .join(', ')}
                </p>

                <p>
                  🙏 {temple.deity ||
                    'Deity information unavailable'}
                </p>

                {temple.description && (
                  <p className="temple-description-preview">
                    {temple.description}
                  </p>
                )}

                <div className="temple-actions">
                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite(temple.id)
                    }
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? `Remove ${temple.name} from favorites`
                        : `Add ${temple.name} to favorites`
                    }
                  >
                    {isFavorite
                      ? '❤️ Saved'
                      : '🤍 Favorite'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openDetails(temple)
                    }
                  >
                    View Details →
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}

export default Temples
