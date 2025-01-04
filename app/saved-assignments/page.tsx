"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

function AssignmentCard({
  assignment,
  onRemove,
}: {
  assignment: Assignment;
  onRemove: () => void;
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
          onClick={onRemove}
          className="text-red-500"
        >
          <Heart className="h-5 w-5 fill-current" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SavedAssignments() {
  const [savedAssignments, setSavedAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchSavedAssignments = async () => {
      // In a real application, you would fetch the saved assignments from an API
      // For this example, we'll use mock data and filter based on saved IDs
      const storedFavorites = localStorage.getItem("favorites");
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

      const mockAssignments: Assignment[] = [
        {
          id: 1,
          systemId: "JR-39240",
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

      const filteredAssignments = mockAssignments.filter((assignment) =>
        favoriteIds.includes(assignment.id)
      );
      setSavedAssignments(filteredAssignments);
    };

    fetchSavedAssignments();
  }, []);

  const removeAssignment = (id: number) => {
    setSavedAssignments((prev) =>
      prev.filter((assignment) => assignment.id !== id)
    );

    // Update localStorage
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      const updatedFavorites = favorites.filter(
        (favId: number) => favId !== id
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const breadcrumbItems = [
    { label: "Hem", href: "/" },
    { label: "Sparade uppdrag", href: "/saved-assignments" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-between items-center my-6">
          <h1 className="text-4xl font-bold text-gray-800">Sparade uppdrag</h1>
          <Link href="/" passHref>
            <Button variant="outline">Tillbaka till alla uppdrag</Button>
          </Link>
        </div>
        {savedAssignments.length === 0 ? (
          <p className="text-center text-gray-600">
            Du har inga sparade uppdrag.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onRemove={() => removeAssignment(assignment.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
