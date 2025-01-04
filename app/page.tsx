"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";

interface Assignment {
  id: number;
  systemId: string;
  title: string;
  startDate: string;
  endDate: string;
  locations: {
    name: string;
    city: string;
    country: string;
  }[];
  hoursPerWeek: number;
  level: string;
  legalEntityClient: {
    name: string;
  };
}

function SearchFilters({ onSearch }: { onSearch: (filters: any) => void }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");

  const handleSearch = () => {
    onSearch({ search, location, level });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-300">
      <Input
        placeholder="Sök uppdrag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-grow"
      />
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Plats" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stockholm">Stockholm</SelectItem>
          <SelectItem value="goteborg">Göteborg</SelectItem>
          <SelectItem value="malmo">Malmö</SelectItem>
        </SelectContent>
      </Select>
      <Select value={level} onValueChange={setLevel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Nivå" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="junior">Junior</SelectItem>
          <SelectItem value="medior">Medior</SelectItem>
          <SelectItem value="senior">Senior</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Sök
      </Button>
    </div>
  );
}

function AssignmentCard({
  assignment,
  isFavorite,
  onToggleFavorite,
}: {
  assignment: Assignment;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg border border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {assignment.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-gray-600">Företag:</span>{" "}
            {assignment.legalEntityClient.name}
          </p>
          <p>
            <span className="font-medium text-gray-600">Plats:</span>{" "}
            {assignment.locations[0].name}
          </p>
          <p>
            <span className="font-medium text-gray-600">Period:</span>{" "}
            {new Date(assignment.startDate).toLocaleDateString("sv-SE")} -{" "}
            {new Date(assignment.endDate).toLocaleDateString("sv-SE")}
          </p>
          <p>
            <span className="font-medium text-gray-600">Timmar per vecka:</span>{" "}
            {assignment.hoursPerWeek}
          </p>
          <p>
            <span className="font-medium text-gray-600">Nivå:</span>{" "}
            {assignment.level}
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Link href={`/job/${assignment.id}`} passHref>
            <Button variant="outline">Läs mer</Button>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Ansök
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFavorite}
          className={isFavorite ? "text-red-500" : "text-gray-500"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockAssignments: Assignment[] = [
    {
      id: 1,
      systemId: "JR-39240",
      title: "Konsult fastighetsförvaltning",
      startDate: "2025-01-07",
      endDate: "2025-03-31",
      locations: [
        { name: "Stockholm, Sverige", city: "Stockholm", country: "Sverige" },
      ],
      hoursPerWeek: 40,
      level: "SENIOR",
      legalEntityClient: { name: "Täby kommun" },
    },
    {
      id: 2,
      systemId: "JR-39241",
      title: "IT-projektledare",
      startDate: "2025-02-01",
      endDate: "2025-06-30",
      locations: [
        { name: "Göteborg, Sverige", city: "Göteborg", country: "Sverige" },
      ],
      hoursPerWeek: 38,
      level: "MEDIOR",
      legalEntityClient: { name: "Göteborgs Stad" },
    },
    {
      id: 3,
      systemId: "JR-39242",
      title: "Frontend-utvecklare",
      startDate: "2025-03-15",
      endDate: "2025-09-15",
      locations: [
        { name: "Malmö, Sverige", city: "Malmö", country: "Sverige" },
      ],
      hoursPerWeek: 40,
      level: "JUNIOR",
      legalEntityClient: { name: "Malmö Stad" },
    },
  ];

  const fetchAssignments = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/job-requests");
      if (!res.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await res.json();
      console.log(data);
      setAssignments(data.content);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError("Ett fel uppstod vid hämtning av uppdrag");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleSearch = (filters: any) => {
    console.log("Searching with filters:", filters);
    fetchAssignments(filters);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id];

      // Save favorites to localStorage
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Konsultuppdrag
          </h1>
          <Link href="/saved-assignments" passHref>
            <Button variant="outline" className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Sparade uppdrag
            </Button>
          </Link>
        </div>
        <SearchFilters onSearch={handleSearch} />
        {isLoading ? (
          <p className="text-center text-gray-600">Laddar uppdrag...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                isFavorite={favorites.includes(assignment.id)}
                onToggleFavorite={() => toggleFavorite(assignment.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
