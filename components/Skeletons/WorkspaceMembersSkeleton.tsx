export default function WorkspaceMembersSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 200,
            height: 28,
            background: "#eee",
            borderRadius: 6,
          }}
        />
      ))}
    </div>
  );
}
