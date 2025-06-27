import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { log } from "../middleware/logger";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export default function ShortenerPage() {
  const [longUrl, setLongUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [result, setResult] = useState(null);

  const handleShorten = () => {
    if (!longUrl || !isValidUrl(longUrl)) {
      log("frontend", "error", "handler", "Invalid URL format");
      alert("Please enter a valid URL.");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("shortenedUrls") || "[]");

    if (shortcode && stored.find(u => u.shortcode === shortcode)) {
      log("frontend", "error", "handler", `Shortcode collision: ${shortcode}`);
      alert("Custom shortcode already in use. Please try another.");
      return;
    }

    const code = shortcode || uuidv4().slice(0, 6);
    const expiry = Date.now() + ((parseInt(validity) || 30) * 60000);
    const newEntry = {
      id: uuidv4(),
      longUrl,
      shortcode: code,
      expiry,
      created: Date.now(),
      clicks: []
    };

    stored.push(newEntry);
    localStorage.setItem("shortenedUrls", JSON.stringify(stored));
    setResult(newEntry);
    log("frontend", "info", "handler", `Shortened URL created: ${code}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Shorten a URL</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Validity (minutes)"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Custom Shortcode"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
          />
        </Grid>
      </Grid>
      <Button variant="contained" onClick={handleShorten}>Shorten</Button>

      {result && (
        <Box mt={4}>
          <Typography variant="h6">Shortened Link:</Typography>
          <Typography><strong>Short URL:</strong> {window.location.origin}/r/{result.shortcode}</Typography>
          <Typography><strong>Expires:</strong> {new Date(result.expiry).toLocaleString()}</Typography>
        </Box>
      )}
    </Container>
  );
}
