const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.");
  process.exit(1);
}

const url = `https://${SUPABASE_URL}/rest/v1/unanswered_comments_24h?order=created_at.asc&limit=50`;

async function main() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`HTTP error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      if (text) console.error(text);
      process.exit(1);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected response format: expected an array.");
      process.exit(1);
    }

    const result = {
      count: data.length,
      oldest_3: data.slice(0, 3)
    };

    console.log(JSON.stringify(result));
  } catch (err) {
    console.error("Fetch error:", err.message);
    process.exit(1);
  }
}

main();
