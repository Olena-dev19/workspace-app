export default function ItemsSkeleton() {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{ height: 40, background: "#f3f3f3", borderRadius: 6 }}
        />
      ))}
    </div>
  );
}
