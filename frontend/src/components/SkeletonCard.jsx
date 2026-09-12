function SkeletonCard() {
  return (
    <div>
      <div
        className="skeleton-pulse"
        style={{
          width: '100%',
          aspectRatio: '2/3',
          borderRadius: '8px',
          background: '#2a2a2a',
        }}
      />
      <div
        className="skeleton-pulse"
        style={{ width: '80%', height: '14px', marginTop: '10px', borderRadius: '4px', background: '#2a2a2a' }}
      />
      <div
        className="skeleton-pulse"
        style={{ width: '50%', height: '12px', marginTop: '6px', borderRadius: '4px', background: '#2a2a2a' }}
      />
    </div>
  );
}

export default SkeletonCard;