import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleNavigation = (pageNum: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });

    params.set("page", pageNum.toString());
    const url = `${baseUrl}?${params.toString()}#events`;
    router.push(url);
  };

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

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      {/* Bouton Précédent */}
      {currentPage > 1 && (
        <button
          onClick={() => handleNavigation(currentPage - 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
          aria-label="Page précédente"
        >
          &lt;
        </button>
      )}

      {/* Première page */}
      {!pageNumbers.includes(1) && (
        <>
          <button
            onClick={() => handleNavigation(1)}
            className={`px-4 py-2 border rounded-md ${
              1 === currentPage ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            1
          </button>
          {!pageNumbers.includes(2) && <span className="px-2">...</span>}
        </>
      )}

      {/* Pages centrales */}
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handleNavigation(pageNum)}
          className={`px-4 py-2 border rounded-md ${
            pageNum === currentPage
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Dernière page */}
      {!pageNumbers.includes(totalPages) && totalPages > 1 && (
        <>
          {!pageNumbers.includes(totalPages - 1) && (
            <span className="px-2">...</span>
          )}
          <button
            onClick={() => handleNavigation(totalPages)}
            className={`px-4 py-2 border rounded-md ${
              totalPages === currentPage
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Bouton Suivant */}
      {currentPage < totalPages && (
        <button
          onClick={() => handleNavigation(currentPage + 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
          aria-label="Page suivante"
        >
          &gt;
        </button>
      )}
    </div>
  );
}
