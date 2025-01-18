import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "db";

const retrieveAssignments = async () =>
  db.assignment.findMany({
    select: {
      id: true,
      sourceId: true,
      title: true,
      startDate: true,
      endDate: true,
      locations: true,
      hoursPerWeek: true,
      level: true,
      legalEntityClient: {
        select: {
          name: true,
        },
      },
    },
  });

export type Assignment = Awaited<ReturnType<typeof retrieveAssignments>>[number];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Assignment[] | { error: string }>
) {
  try {
    const assignments = await retrieveAssignments();

    res.status(200).json(assignments);
  } catch (error) {
    console.error(
      "Error fetching data from database:",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json({ error: "Internal server error" });
  }
}

const path = "/api/job-requests";
export const getJobRequests = async () => {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("Failed to fetch assignments");
  }
  const data: Assignment[] = await res.json();
  return data;
};
