import './Tracklist.css';

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};


const TrackList = ({ tracks }) => {
  return (
    <div className="tracklist-container">
      <h2>Tracklist</h2>
      <div className="tracklist">
        {tracks.map((track, index) => (
          <div key={track.id || index} className="track-row">
            <div className="track-number">{track.track_number}</div>
            <div className="track-info">
              <p className="track-title">{track.name}</p>
              <p className="track-artist">{track.artist}</p>
            </div>
            <div className="track-duration">{formatDuration(track.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
