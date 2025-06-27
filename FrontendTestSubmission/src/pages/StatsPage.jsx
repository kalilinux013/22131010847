import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";

export default function StatsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    setData(items);
  }, []);

  return (
    <Container>
      <Typography variant="h4">Statistics</Typography>
      {data.map((item) => (
        <Box key={item.id} mt={2} p={2} border={"1px solid #ccc"}>
          <Typography>Shortcode: {item.shortcode}</Typography>
          <Typography>Created: {new Date(item.created).toLocaleString()}</Typography>
          <Typography>Expires: {new Date(item.expiry).toLocaleString()}</Typography>
          <Typography>Total Clicks: {item.clicks.length}</Typography>
          {item.clicks.map((c, i) => (
            <Box key={i}>
              <Typography variant="body2">Click {i + 1} - {new Date(c.timestamp).toLocaleString()} - {c.source || "unknown"} - {c.geo || "N/A"}</Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Container>
  );
}
