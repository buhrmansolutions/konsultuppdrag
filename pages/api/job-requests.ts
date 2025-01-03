import { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

const AssignmentSchema = z.object({
  id: z.number(),
  systemId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  locations: z.array(
    z.object({
      name: z.string(),
      city: z.string(),
      country: z.string(),
    })
  ),
  hoursPerWeek: z.number(),
  level: z.string(),
  legalEntityClient: z.object({
    name: z.string(),
  }),
});

const JobRequestResponseSchema = z.object({
  content: z.array(AssignmentSchema),
});

type JobRequestResponse = z.infer<typeof JobRequestResponseSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JobRequestResponse | { error: string }>
) {
  const url = "https://app.verama.com/api/public/job-requests";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const rawData = await response.json();

    // Validate the response data
    const validatedData = JobRequestResponseSchema.parse(rawData);
    res.status(200).json(validatedData);
  } catch (error) {
    console.error(
      "Error fetching data:",
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
  const data: JobRequestResponse = await res.json();
  return data;
};
