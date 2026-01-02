import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faUser, faSearch, faSpinner, faLink } from "@fortawesome/free-solid-svg-icons";
import SearchUser from "@data/repositories/userImps/SearchUser";
import { searchUserExe } from "@domain/usecases/user/searchUserExe";

const SpeakerCard = ({ speaker, index, onRemove, onChange, style }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search logic per card
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchUserExe(new SearchUser(), searchQuery);
          setSearchResults(results || []);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectUser = (user) => {
    const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim() || user.username;
    onChange(index, "name", fullName);
    onChange(index, "users_permissions_users", user.id);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div style={{ 
      padding: '1.5rem', 
      border: '3px solid var(--border-dark)', 
      boxShadow: 'var(--shadow-solid)',
      backgroundColor: 'var(--white)',
      position: 'relative',
      animation: 'fadeInUp 0.3s ease'
    }}>
      <button 
        type="button" 
        onClick={() => onRemove(index)}
        style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-red)',
          color: 'var(--white)',
          border: '3px solid var(--border-dark)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 2px 0 var(--border-dark)',
          zIndex: 2
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Search for User Section */}
        <div style={{ position: 'relative' }}>
          <label className={style.formLabel} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FontAwesomeIcon icon={faSearch} /> Find Platform User
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className={style.formControl}
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '0.85rem', paddingLeft: '35px' }}
            />
            <FontAwesomeIcon 
              icon={isSearching ? faSpinner : faSearch} 
              spin={isSearching}
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }} 
            />
          </div>

          {/* Results Dropdown */}
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--white)',
              border: '3px solid var(--border-dark)',
              boxShadow: 'var(--shadow-solid)',
              zIndex: 10,
              marginTop: '5px',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {searchResults.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--main-bg-color)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <FontAwesomeIcon icon={faUser} size="sm" />
                  <div>
                    <span style={{ fontWeight: '700' }}>@{user.username}</span>
                    <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>({user.firstname} {user.lastname})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Data Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', borderTop: '2px solid var(--border-light)', paddingTop: '1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: 'var(--main-bg-color)', 
            border: '3px solid var(--border-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'var(--text-muted)',
            position: 'relative'
          }}>
            <FontAwesomeIcon icon={faUser} />
            {speaker.users_permissions_users && (
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                right: '-5px',
                backgroundColor: 'var(--card-green)',
                padding: '2px 6px',
                fontSize: '0.6rem',
                border: '2px solid var(--border-dark)',
                fontWeight: '800',
                color: 'var(--black)'
              }}>LINKED</div>
            )}
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className={style.formGroup} style={{ marginBottom: 0 }}>
              <label className={style.formLabel} style={{ fontSize: '0.9rem' }}>Full Name *</label>
              <input
                type="text"
                className={style.formControl}
                placeholder="Speaker Name"
                value={speaker.name}
                onChange={(e) => onChange(index, "name", e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={style.formGroup} style={{ marginBottom: 0 }}>
                <label className={style.formLabel} style={{ fontSize: '0.9rem' }}>Title</label>
                <input
                  type="text"
                  className={style.formControl}
                  placeholder="e.g. Lead Engineer"
                  value={speaker.title}
                  onChange={(e) => onChange(index, "title", e.target.value)}
                />
              </div>
              <div className={style.formGroup} style={{ marginBottom: 0 }}>
                <label className={style.formLabel} style={{ fontSize: '0.9rem' }}>LinkedIn</label>
                <input
                  type="text"
                  className={style.formControl}
                  placeholder="Profile URL"
                  value={speaker.linkedin || ""}
                  onChange={(e) => onChange(index, "linkedin", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepSpeakers = ({ dataSetter, storeName, style }) => {
  const dispatch = useDispatch();
  const speakersFromStore = useSelector((state) => state[storeName].speakers) || [];
  
  const [speakers, setSpeakers] = useState(speakersFromStore);
  const [err, setErr] = useState("");

  const handleAddSpeaker = () => {
    setSpeakers([...speakers, { name: "", title: "", linkedin: "", users_permissions_users: null }]);
  };

  const handleRemoveSpeaker = (index) => {
    const newSpeakers = speakers.filter((_, i) => i !== index);
    setSpeakers(newSpeakers);
  };

  const handleSpeakerChange = (index, field, value) => {
    const newSpeakers = speakers.map((s, i) => 
      i === index ? { ...s, [field]: value } : s
    );
    setSpeakers(newSpeakers);
  };

  useValidateInputEffect({
    fieldName: "speakers",
    setProberty: dataSetter,
    dispatch,
    value: speakers,
    currentFieldValue: speakersFromStore,
    condition: speakers.length > 0 && speakers.every(s => s.name?.trim().length > 0),
    setError: setErr,
    validationFunc: (val) => {
        if (val.length === 0) return val;
        if (val.some(s => !s.name?.trim())) {
            throw new Error("Each speaker must have a name");
        }
        return val;
    },
    errorMessage: "Please provide a name for each speaker",
  });

  return (
    <div className={`${style.step} ${style.active}`}>
      <div className={style.formGroup}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 className={style.stepTitle}>Event Speakers</h3>
            <p className={style.stepSubtitle}>Highlight the experts leading the session</p>
          </div>
          <button 
            type="button" 
            onClick={handleAddSpeaker}
            className={`${style.btn} ${style.btnPrimary}`}
            style={{ minWidth: 'auto', padding: '0.5rem 1rem' }}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} /> Add Speaker
          </button>
        </div>

        <div className={style.speakersList} style={{ display: 'grid', gap: '1.5rem' }}>
          {speakers.map((speaker, index) => (
            <SpeakerCard 
              key={index}
              index={index}
              speaker={speaker}
              onRemove={handleRemoveSpeaker}
              onChange={handleSpeakerChange}
              style={style}
            />
          ))}
          
          {speakers.length === 0 && (
            <div style={{ 
              padding: '3rem', 
              textAlign: 'center', 
              border: '3px dashed var(--border-medium)',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--white)'
            }}>
              No speakers added yet. Click "Add Speaker" to start.
            </div>
          )}

          {err && <div className={style.error} style={{ marginTop: '1rem' }}>{err}</div>}
        </div>
      </div>
    </div>
  );
};

export default StepSpeakers;
