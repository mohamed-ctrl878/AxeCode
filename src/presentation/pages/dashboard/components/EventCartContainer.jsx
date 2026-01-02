import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUsers, faCalendarAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import useGetContent from "@presentation/shared/hooks/useGetContent";
import { GetEvents } from "@data/repositories/event/GetEvents";
import { getEventsExe } from "@domain/usecases/event.js/getEventsExe";
import StatusHandler from "@presentation/shared/components/ui/StatusHandler";

const EventCartContainer = () => {
    async function caseUse() {
        return await getEventsExe(new GetEvents(), "populate=*");
    }
    
    const { load, data, error } = useGetContent({ caseUse });

    // data format depends on API, assuming standard Strapi structure
    const eventList = data?.[0]?.data || [];

    return (
        <StatusHandler loading={load} error={error} data={eventList} emptyMessage="No events found. Create your first event!">
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '2rem',
                marginTop: '1.5rem' 
            }}>
                {eventList.map((event) => (
                    <div key={event.id} style={{
                        backgroundColor: 'var(--white)',
                        border: '3px solid var(--border-dark)',
                        boxShadow: 'var(--shadow-solid)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s ease',
                        animation: 'fadeInUp 0.3s ease'
                    }}>
                        <div style={{ padding: '1.5rem', flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{
                                    backgroundColor: 'var(--card-blue)',
                                    padding: '4px 10px',
                                    border: '2px solid var(--border-dark)',
                                    fontWeight: '800',
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase'
                                }}>
                                    {event.onsite ? 'Onsite' : 'Virtual'}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)' }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>

                            <h3 style={{ 
                                color: 'var(--text-primary)', 
                                fontSize: '1.3rem', 
                                fontWeight: '800', 
                                marginBottom: '1rem',
                                textTransform: 'uppercase'
                            }}>
                                {event.title}
                            </h3>

                            <div style={{ display: 'grid', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FontAwesomeIcon icon={faCalendarAlt} style={{ width: '15px' }} />
                                    <span>{event.date}</span>
                                </div>
                                {event.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ width: '15px' }} />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FontAwesomeIcon icon={faUsers} style={{ width: '15px' }} />
                                    <span>{event.speakers?.length || 0} Speakers</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ 
                            padding: '1rem 1.5rem', 
                            borderTop: '3px solid var(--border-medium)', 
                            backgroundColor: 'var(--main-bg-color)',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <Link 
                                to={`/events/${event.documentId}`} 
                                style={{ 
                                    flex: 1, 
                                    textAlign: 'center', 
                                    padding: '0.5rem', 
                                    border: '3px solid var(--border-dark)',
                                    fontWeight: '700',
                                    backgroundColor: 'var(--white)',
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    boxShadow: '2px 2px 0 var(--border-dark)'
                                }}
                            >
                                Preview
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </StatusHandler>
    );
};

export default EventCartContainer;
