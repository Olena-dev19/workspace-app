import { useState } from "react";

export function useSelection() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const clear = () => setSelected([]);

  return { selected, toggle, clear };
}
