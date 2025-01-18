"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ApplicationForm } from "@/components/ApplicationForm";

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
  description?: string;
}

export default function JobPage() {
  const params = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockAssignment: Assignment = {
          id: Number(params.id),
          systemId: `JR-${params.id}`,
          title: "Konsult fastighetsförvaltning",
          startDate: "2025-01-07",
          endDate: "2025-03-31",
          locations: [
            {
              name: "Stockholm, Sverige",
              city: "Stockholm",
              country: "Sverige",
            },
          ],
          hoursPerWeek: 40,
          level: "SENIOR",
          legalEntityClient: { name: "Täby kommun" },
          description:
            "Vi söker en erfaren konsult inom fastighetsförvaltning för ett spännande projekt i Täby kommun. I denna roll kommer du att arbeta nära med kommunens fastighetsavdelning för att optimera förvaltningen av kommunens fastigheter. Du kommer att ansvara för att utveckla och implementera strategier för effektiv fastighetsförvaltning, samt leda projekt för att förbättra energieffektiviteten och hållbarheten i kommunens byggnader.",
        };

        setAssignment(mockAssignment);

        // Check if the assignment is in favorites
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          setIsFavorite(favorites.includes(Number(params.id)));
        }
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError("Ett fel uppstod vid hämtning av uppdraget");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [params.id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    const storedFavorites = localStorage.getItem("favorites");
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (isFavorite) {
      favorites = favorites.filter((id: number) => id !== assignment?.id);
    } else {
      favorites.push(assignment?.id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Laddar...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!assignment) {
    return (
      <div className="container mx-auto p-4">Uppdraget hittades inte.</div>
    );
  }

  const breadcrumbItems = [
    { label: "Hem", href: "/" },
    { label: "Uppdrag", href: "/" },
    { label: assignment.title, href: `/job/${assignment.id}` },
  ];

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="my-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Tillbaka till alla uppdrag
        </Link>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {assignment.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={isFavorite ? "text-red-500" : "text-gray-500"}
            >
              <Heart
                className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
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
              <span className="font-medium text-gray-600">
                Timmar per vecka:
              </span>{" "}
              {assignment.hoursPerWeek}
            </p>
            <p>
              <span className="font-medium text-gray-600">Nivå:</span>{" "}
              {assignment.level}
            </p>
            <div>
              <h3 className="font-medium text-gray-600 mb-2">Beskrivning:</h3>
              <p>{assignment.description}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
          <ApplicationForm assignmentId={assignment.id} />
        </CardFooter>
      </Card>
    </div>
  );
}
