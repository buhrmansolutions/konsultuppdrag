export default async function handler(req, res) {
  const url = "https://app.verama.com/api/public/job-requests";

  try {
    // Forward the request to the external API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Add any necessary headers, such as authorization or others
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer YOUR_TOKEN', // if required
      },
      // If you want to pass query parameters, you can extract them from `req.query`
      // If needed, you can forward the request body as well, depending on the HTTP method
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse and return the JSON data
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
