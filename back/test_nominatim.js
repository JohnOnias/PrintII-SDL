const fetch = require('node-fetch');
async function test() {
  const address = "Rua Castro, 102, Cedro - CE";
  const cleanAddress = address
    .replace(/,\s*CEP:\s*[\d\-\.]+/gi, "")
    .replace(/\(.*?\)/g, "")
    .trim()
    .replace(/,\s*$/, "");
  console.log("Clean address:", cleanAddress);
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}&limit=1`, {
    headers: { 'User-Agent': 'TestApp/1.0 (test@example.com)' }
  });
  const data = await res.json();
  console.log(data);
}
test();
