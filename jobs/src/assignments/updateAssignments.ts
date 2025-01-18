import { db } from "db";
import { z } from "zod";

// Reuse the same schema from job-requests.ts
const AssignmentSchema = z.object({
  id: z.number().transform((id) => id.toString()),
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

export async function updateAssignmentsJob(): Promise<void> {
  try {
    // Fetch assignments from the API
    const response = await fetch("https://app.verama.com/api/public/job-requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch assignments: ${response.statusText}`);
    }

    const rawData = await response.json();
    const validatedData = JobRequestResponseSchema.parse(rawData);
    const assignments = validatedData.content;

    // Create missing legal entity clients in the database
    for (const assignment of assignments) {
      await db.legalEntityClient.upsert({
        where: { name: assignment.legalEntityClient.name, },
        create: { name: assignment.legalEntityClient.name },
        update: {}, // No updates needed if it exists
      });
    }

    // Create assignments in the database
    let createdCount = 0;
    for (const assignment of assignments) {
      // Check if assignment already exists based on sourceId
      const existingAssignment = await db.assignment.findFirst({
        where: { sourceId: assignment.id },
      });

      if (!existingAssignment) {
        await db.assignment.create({
          data: {
            sourceId: assignment.id,
            title: assignment.title,
            startDate: new Date(assignment.startDate),
            endDate: new Date(assignment.endDate),
            hoursPerWeek: assignment.hoursPerWeek,
            level: assignment.level,
            legalEntityClient: {
              connect: { name: assignment.legalEntityClient.name },
            },
            locations: {
              create: assignment.locations.map((location) => ({
                name: location.name,
                city: location.city,
                country: location.country,
              })),
            },
          },
        });
        createdCount++;
      }
    }

    console.log(`Created ${createdCount} new assignments`);
  } catch (error) {
    console.error("Error executing job:", error);
    throw error;
  }
}
