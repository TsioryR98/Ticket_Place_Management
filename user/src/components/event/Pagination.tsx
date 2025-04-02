import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  searchParams?: Record<string, string | null>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = "/",
  searchParams = {},
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

  const constructUrl = (pageNum: number) => {
    const params = new URLSearchParams();

    // Préserver tous les paramètres de recherche existants
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });

    params.set("page", pageNum.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Bouton Précédent */}
      {currentPage > 1 && (
        <Link
          href={constructUrl(currentPage - 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center gap-1"
          aria-label="Page précédente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Précédent
        </Link>
      )}

      {/* Première page */}
      {currentPage > 3 && (
        <>
          <Link
            href={constructUrl(1)}
            className={`px-4 py-2 border rounded-md ${
              1 === currentPage ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            1
          </Link>
          {currentPage > 4 && <span className="px-2 py-2">...</span>}
        </>
      )}

      {/* Numéros de page */}
      {getPageNumbers().map((pageNum) => (
        <Link
          key={pageNum}
          href={constructUrl(pageNum)}
          className={`px-4 py-2 border rounded-md ${
            pageNum === currentPage
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {pageNum}
        </Link>
      ))}

      {/* Dernière page */}
      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className="px-2 py-2">...</span>
          )}
          <Link
            href={constructUrl(totalPages)}
            className={`px-4 py-2 border rounded-md ${
              totalPages === currentPage
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Bouton Suivant */}
      {currentPage < totalPages && (
        <Link
          href={constructUrl(currentPage + 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center gap-1"
          aria-label="Page suivante"
        >
          Suivant
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      )}
    </div>
  );
}
