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
    const maxVisible = 5; // Nombre maximum de pages visibles
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Ajuster si on est trop proche de la fin
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Générer les numéros de page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const constructUrl = (pageNum: number) => {
    const params = new URLSearchParams();

    // Conserver les paramètres existants
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });

    params.set("page", pageNum.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      {/* Bouton Précédent */}
      {currentPage > 1 && (
        <Link
          href={constructUrl(currentPage - 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
          aria-label="Page précédente"
        >
          &lt;
        </Link>
      )}

      {/* Première page */}
      {!pageNumbers.includes(1) && (
        <>
          <Link
            href={constructUrl(1)}
            className={`px-4 py-2 border rounded-md ${
              1 === currentPage ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            1
          </Link>
          {!pageNumbers.includes(2) && <span className="px-2">...</span>}
        </>
      )}

      {/* Pages centrales */}
      {pageNumbers.map((pageNum) => (
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
      {!pageNumbers.includes(totalPages) && totalPages > 1 && (
        <>
          {!pageNumbers.includes(totalPages - 1) && (
            <span className="px-2">...</span>
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
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
          aria-label="Page suivante"
        >
          &gt;
        </Link>
      )}
    </div>
  );
}
