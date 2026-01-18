'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Ajouter la logique de filtrage ici
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Rechercher un événement..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
