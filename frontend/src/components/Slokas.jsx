
import { useState } from 'react'

const mantras = [
  {
    id: 1,
    deity: 'Lord Shiva',
    title: 'Panchakshari Mantra',
    sanskrit: 'ॐ नमः शिवाय',
    telugu: 'ఓం నమః శివాయ',
    english: 'Om Namah Shivaya',
    meaning: 'Salutations to Lord Shiva.'
  },
  {
    id: 2,
    deity: 'Lord Ganesha',
    title: 'Ganesha Mantra',
    sanskrit: 'ॐ गं गणपतये नमः',
    telugu: 'ఓం గం గణపతయే నమః',
    english: 'Om Gam Ganapataye Namah',
    meaning: 'Salutations to Lord Ganesha.'
  },
  {
    id: 3,
    deity: 'Lord Vishnu',
    title: 'Vishnu Mantra',
    sanskrit: 'ॐ नमो नारायणाय',
    telugu: 'ఓం నమో నారాయణాయ',
    english: 'Om Namo Narayanaya',
    meaning: 'Salutations to Lord Narayana.'
  },
  {
    id: 4,
    deity: 'Lord Hanuman',
    title: 'Hanuman Mantra',
    sanskrit: 'ॐ हनुमते नमः',
    telugu: 'ఓం హనుమతే నమః',
    english: 'Om Hanumate Namah',
    meaning: 'Salutations to Lord Hanuman.'
  },
  {
    id: 5,
    deity: 'Lord Krishna',
    title: 'Krishna Mantra',
    sanskrit: 'ॐ नमो भगवते वासुदेवाय',
    telugu: 'ఓం నమో భగవతే వాసుదేవాయ',
    english: 'Om Namo Bhagavate Vasudevaya',
    meaning: 'Salutations to Lord Vasudeva.'
  },
  {
    id: 6,
    deity: 'Goddess Durga',
    title: 'Durga Mantra',
    sanskrit: 'ॐ दुं दुर्गायै नमः',
    telugu: 'ఓం దుం దుర్గాయై నమః',
    english: 'Om Dum Durgayai Namah',
    meaning: 'Salutations to Goddess Durga.'
  },
  {
    id: 7,
    deity: 'Lord Venkateswara',
    title: 'Venkateswara Mantra',
    sanskrit: 'ॐ नमो वेंकटेशाय',
    telugu: 'ఓం నమో వేంకటేశాయ',
    english: 'Om Namo Venkateshaya',
    meaning: 'Salutations to Lord Venkateswara.'
  }
]

function Slokas() {
  const [selectedDeity, setSelectedDeity] = useState('all')
  const [copiedId, setCopiedId] = useState(null)

  const filteredMantras = mantras.filter(
    (mantra) =>
      selectedDeity === 'all' ||
      mantra.deity === selectedDeity
  )

  async function copyMantra(mantra) {
    try {
      await navigator.clipboard.writeText(
        `${mantra.telugu}\n${mantra.english}`
      )
      setCopiedId(mantra.id)
    } catch (error) {
      console.error('Unable to copy mantra:', error)
    }
  }

  return (
    <section id="slokas" className="slokas-section">
      <div className="section-heading">
        <span className="section-label">
          SACRED CHANTS
        </span>

        <h2>Slokas & Mantras</h2>

        <p>
          Discover devotional mantras in Sanskrit,
          Telugu and English transliteration.
        </p>
      </div>

      <div className="mantra-filters">
        <select
          value={selectedDeity}
          onChange={(event) =>
            setSelectedDeity(event.target.value)
          }
          aria-label="Filter mantras by deity"
        >
          <option value="all">All Deities</option>

          {mantras.map((mantra) => (
            <option
              key={mantra.id}
              value={mantra.deity}
            >
              {mantra.deity}
            </option>
          ))}
        </select>
      </div>

      <div className="mantra-grid">
        {filteredMantras.map((mantra) => (
          <article className="mantra-card" key={mantra.id}>
            <span className="mantra-deity">
              {mantra.deity}
            </span>

            <h3>{mantra.title}</h3>

            <div className="mantra-sanskrit" lang="sa">
              {mantra.sanskrit}
            </div>

            <div className="mantra-telugu" lang="te">
              {mantra.telugu}
            </div>

            <p className="mantra-english">
              {mantra.english}
            </p>

            <div className="mantra-meaning">
              <strong>Meaning</strong>
              <p>{mantra.meaning}</p>
            </div>

            <button
              type="button"
              onClick={() => copyMantra(mantra)}
            >
              {copiedId === mantra.id
                ? '✓ Copied'
                : 'Copy Mantra'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Slokas

