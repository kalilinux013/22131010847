export async function log(stack, level, pkg, message) {
  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });
    const result = await response.json();
    console.log("Logged:", result.logID);
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
}
