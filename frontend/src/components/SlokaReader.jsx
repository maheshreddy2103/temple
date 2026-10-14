
import { useState } from 'react'
import lingashtakam from '../data/lingashtakam'
import ganeshaPancharatnam from '../data/ganeshaPancharatnam'

const stotrams = [
  {
    id: 'lingashtakam',
    title: 'Lingashtakam',
    deity: 'Lord Shiva',
    description: 'Eight devotional verses praising Lord Shiva.',
    image: '/deities/shiva.jpg',
    verses: lingashtakam,
    available: true
  },
  {
    id: 'ganesha-pancharatnam',
    title: 'Ganesha Pancharatnam',
    deity: 'Lord Ganesha',
    description: 'Five devotional verses praising Lord Ganesha.',
    image: '/deities/ganesha.jpg',
    verses: ganeshaPancharatnam,
    available: true
  },
  {
    id: 'hanuman-chalisa',
    title: 'Hanuman Chalisa',
    deity: 'Lord Hanuman',
    description: 'A devotional hymn dedicated to Lord Hanuman.',
    image: '/deities/hanuman.jpg',
    verses: [],
    available: false
  },
  {
    id: 'aditya-hridayam',
    title: 'Aditya Hridayam',
    deity: 'Lord Surya',
    description: 'A sacred hymn dedicated to Surya Deva.',
    image: '/deities/surya.jpg',
    verses: [],
    available: false
  },
  {
    id: 'vishnu-sahasranamam',
    title: 'Vishnu Sahasranamam',
    deity: 'Lord Vishnu',
    description: 'A sacred hymn of a thousand divine names.',
    image: '/deities/vishnu.jpg',
    verses: [],
    available: false
  }
]

function SlokaReader() {
  const [search, setSearch] = useState('')
  const [selectedDeity, setSelectedDeity] = useState('all')
  const [selectedStotram, setSelectedStotram] = useState(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [language, setLanguage] = useState('telugu')
  const [readingMode, setReadingMode] = useState('single')
  const [fontSize, setFontSize] = useState(24)
  const [copied, setCopied] = useState(false)

  const deities = [
    ...new Set(stotrams.map((item) => item.deity))
  ]

  const filteredStotrams = stotrams.filter((item) => {
    const searchText = search.trim().toLowerCase()

    const matchesSearch =
      item.title.toLowerCase().includes(searchText) ||
      item.deity.toLowerCase().includes(searchText)

    const matchesDeity =
      selectedDeity === 'all' ||
      item.deity === selectedDeity

    return matchesSearch && matchesDeity
  })

  function openStotram(stotram) {
    if (!stotram.available || !stotram.verses.length) {
      return
    }

    setSelectedStotram(stotram)
    setCurrentIndex(0)
    setLanguage('telugu')
    setReadingMode('single')
    setCopied(false)

    document.getElementById('sloka-reader')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  function closeReader() {
    setSelectedStotram(null)
    setCurrentIndex(0)
    setReadingMode('single')
    setCopied(false)
  }

  function nextVerse() {
    if (
      selectedStotram &&
      currentIndex < selectedStotram.verses.length - 1
    ) {
      setCurrentIndex((previous) => previous + 1)
      setCopied(false)
    }
  }

  function previousVerse() {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1)
      setCopied(false)
    }
  }

  function changeLanguage(value) {
    setLanguage(value)
    setCopied(false)
  }

  function changeReadingMode(value) {
    setReadingMode(value)
    setCopied(false)
  }

  function increaseFontSize() {
    setFontSize((previous) => Math.min(36, previous + 2))
  }

  function decreaseFontSize() {
    setFontSize((previous) => Math.max(18, previous - 2))
  }

  async function copyVerse() {
    if (!selectedStotram) return

    const verses = selectedStotram.verses

    const text =
      readingMode === 'all'
        ? verses.map((verse) => verse[language]).join('\n\n')
        : verses[currentIndex][language]

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (error) {
      console.error('Copy failed:', error)
      setCopied(false)
    }
  }

  if (selectedStotram) {
    const verses = selectedStotram.verses
    const verse = verses[currentIndex]

    return (
      <section
        id="sloka-reader"
        className="sloka-reader-section"
      >
        <div className="stotram-reader-layout">

          <button
            type="button"
            className="back-library-btn"
            onClick={closeReader}
          >
            ← Back to Stotram Library
          </button>

          <div className="sloka-reader">

            <div className="sloka-reader-header">
              <span>{selectedStotram.deity}</span>

              <h2>{selectedStotram.title}</h2>

              <p>{selectedStotram.description}</p>

              <small>
                {verses.length} verses available
              </small>
            </div>

            <div className="sloka-language-buttons">
              <button
                type="button"
                className={language === 'telugu' ? 'active' : ''}
                onClick={() => changeLanguage('telugu')}
              >
                తెలుగు
              </button>

              <button
                type="button"
                className={language === 'sanskrit' ? 'active' : ''}
                onClick={() => changeLanguage('sanskrit')}
              >
                संस्कृतम्
              </button>
            </div>

            <div className="reader-toolbar">
              <button
                type="button"
                className={readingMode === 'single' ? 'active' : ''}
                onClick={() => changeReadingMode('single')}
              >
                Verse by Verse
              </button>

              <button
                type="button"
                className={readingMode === 'all' ? 'active' : ''}
                onClick={() => changeReadingMode('all')}
              >
                Read Full Stotram
              </button>
            </div>

            <div className="reader-font-controls">
              <span>Text Size</span>

              <button
                type="button"
                onClick={decreaseFontSize}
                disabled={fontSize <= 18}
                aria-label="Decrease text size"
              >
                A−
              </button>

              <span>{fontSize}px</span>

              <button
                type="button"
                onClick={increaseFontSize}
                disabled={fontSize >= 36}
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>

            {readingMode === 'single' ? (
              <div className="sloka-verse-card">
                <span className="verse-number">
                  Verse {currentIndex + 1} of {verses.length}
                </span>

                <div
                  className="sloka-text"
                  lang={language === 'telugu' ? 'te' : 'sa'}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {verse[language]}
                </div>

                <div className="sloka-meaning">
                  <h3>Meaning</h3>
                  <p>{verse.meaning}</p>
                </div>

                <button
                  type="button"
                  className="sloka-copy"
                  onClick={copyVerse}
                >
                  {copied ? '✓ Copied' : 'Copy Verse'}
                </button>
              </div>
            ) : (
              <div className="full-stotram-list">

                {verses.map((item, index) => (
                  <article
                    className="full-stotram-verse"
                    key={item.id}
                  >
                    <span className="verse-number">
                      Verse {index + 1}
                    </span>

                    <div
                      className="sloka-text"
                      lang={language === 'telugu' ? 'te' : 'sa'}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {item[language]}
                    </div>

                    <div className="sloka-meaning">
                      <h3>Meaning</h3>
                      <p>{item.meaning}</p>
                    </div>
                  </article>
                ))}

                <div className="full-stotram-copy">
                  <button
                    type="button"
                    className="sloka-copy"
                    onClick={copyVerse}
                  >
                    {copied ? '✓ Copied' : 'Copy Full Stotram'}
                  </button>
                </div>

              </div>
            )}

            {readingMode === 'single' && (
              <div className="sloka-navigation">
                <button
                  type="button"
                  onClick={previousVerse}
                  disabled={currentIndex === 0}
                >
                  ← Previous
                </button>

                <span>
                  {currentIndex + 1} / {verses.length}
                </span>

                <button
                  type="button"
                  onClick={nextVerse}
                  disabled={currentIndex === verses.length - 1}
                >
                  Next →
                </button>
              </div>
            )}

          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="sloka-reader"
      className="stotram-library-section"
    >
      <div className="section-heading">
        <span className="section-label">
          DEVOTIONAL LITERATURE
        </span>

        <h2>Stotram Library</h2>

        <p>
          Explore sacred hymns, devotional verses,
          and their meanings.
        </p>
      </div>

      <div className="stotram-library-filters">
        <input
          type="search"
          placeholder="Search stotrams or deities..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={selectedDeity}
          onChange={(event) =>
            setSelectedDeity(event.target.value)
          }
        >
          <option value="all">All Deities</option>

          {deities.map((deity) => (
            <option key={deity} value={deity}>
              {deity}
            </option>
          ))}
        </select>
      </div>

      <div className="stotram-library-grid">
        {filteredStotrams.map((stotram) => (
          <article
            className="stotram-library-card"
            key={stotram.id}
          >
            <div className="stotram-library-image">
              <img
                src={stotram.image}
                alt={stotram.deity}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </div>

            <div className="stotram-library-content">
              <span className="stotram-deity">
                {stotram.deity}
              </span>

              <h3>{stotram.title}</h3>

              <p>{stotram.description}</p>

              <button
                type="button"
                disabled={!stotram.available}
                onClick={() => openStotram(stotram)}
              >
                {stotram.available
                  ? 'Read Stotram →'
                  : 'Coming Soon'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredStotrams.length === 0 && (
        <p className="stotram-empty">
          No stotrams found.
        </p>
      )}
    </section>
  )
}

export default SlokaReader


