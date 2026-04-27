export default function WorkspaceListSkeleton() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: 16,
            borderRadius: 8,
            background: "#eee",
            height: 64,
          }}
        />
      ))}
    </div>
  );
}
