import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-5 h-5 text-gray-400" />}
            <Link
              href={item.href}
              className={`inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ${
                index === items.length - 1
                  ? "text-gray-500 hover:text-gray-700"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
