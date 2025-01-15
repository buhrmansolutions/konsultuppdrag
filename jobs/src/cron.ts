import cron from "node-cron";
import { updateAssignmentsJob } from "./assignments/updateAssignments.js";

cron.schedule("*/10 * * * *", async () => {
  try {
    console.info("Running updateAssignmentsJob");
    await updateAssignmentsJob();
    console.info("updateAssignmentsJob completed successfully");
  } catch (error) {
    console.error("Error running updateAssignmentsJob:", error);
  }
});

console.info("Job scheduler started");
