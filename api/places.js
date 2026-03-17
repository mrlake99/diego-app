export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query" });

  const key = process.env.GOOGLE_PLACES_API_KEY;
  const url = `https://places.googleapis.com/v1/places:searchText`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber"
      },
      body: JSON.stringify({ textQuery: query })
    });
    const data = await response.json();
    const results = (data.places || []).map(p => ({
      name: p.displayName?.text || "",
      formatted_address: p.formattedAddress || "",
      formatted_phone_number: p.nationalPhoneNumber || ""
    }));
    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ error: "Places API request failed" });
  }
}
