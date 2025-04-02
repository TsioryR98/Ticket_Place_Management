import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = "/",
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Bouton Précédent */}
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          &lt;
        </Link>
      )}

      {/* Numéros de page */}
      {getPageNumbers().map((pageNum) => (
        <Link
          key={pageNum}
          href={`${baseUrl}?page=${pageNum}`}
          className={`px-3 py-1 border rounded ${
            pageNum === currentPage
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {pageNum}
        </Link>
      ))}

      {/* Bouton Suivant */}
      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          &gt;
        </Link>
      )}
    </div>
  );
}
