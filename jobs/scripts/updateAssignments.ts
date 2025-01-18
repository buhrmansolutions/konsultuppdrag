const main = async () => {
  console.log("Running updateAssignmentsJob");
  const packageJson = (await import("../package.json", {
    assert: { type: "json" },
  })).default;
  console.log(packageJson);
  const { updateAssignmentsJob } = await import(`../${packageJson.main}`);
  await updateAssignmentsJob();
  console.log("updateAssignmentsJob completed");
};

main();
