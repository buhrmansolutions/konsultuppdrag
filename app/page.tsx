"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJobRequests } from "@/pages/api/job-requests";

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

function ApplicationForm({ assignmentId }: { assignmentId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting application", {
      assignmentId,
      name,
      email,
      phone,
      resume,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Ansök
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ansök till uppdrag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Namn</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="resume">CV</Label>
            <Input
              id="resume"
              type="file"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Skicka ansökan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
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
      <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
        <ApplicationForm assignmentId={assignment.id} />
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
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
    // setIsLoading(true);
    // setError(null);
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   setAssignments(mockAssignments);
    // } catch (error) {
    //   console.error("Error fetching assignments:", error);
    //   setError("Ett fel uppstod vid hämtning av uppdrag");
    // } finally {
    //   setIsLoading(false);
    // }
    setIsLoading(true);
    try {
      const data = await getJobRequests();
      setAssignments(data.content);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSearch = (filters: any) => {
    console.log("Searching with filters:", filters);
    fetchAssignments(filters);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 py-8">
          Konsultuppdrag
        </h1>
        <SearchFilters onSearch={handleSearch} />
        {isLoading ? (
          <p className="text-center text-gray-600">Laddar uppdrag...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
