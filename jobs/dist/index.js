import cron from "node-cron";
import { updateAssignmentsJob } from "./assignments/updateAssignments.js";
// Run job immediately and then every 10 minutes
updateAssignmentsJob(); // Immediate first run
cron.schedule("*/10 * * * *", async () => {
    try {
        console.info("Running example job");
        await updateAssignmentsJob();
        console.info("Example job completed successfully");
    }
    catch (error) {
        console.error("Error running example job:", error);
    }
});
console.info("Job scheduler started");
