import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Select,
  MenuItem,
  Button,
  Slider,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [algorithm, setAlgorithm] = useState('floydSteinberg');
  const [threshold, setThreshold] = useState(128);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };

  const handleThresholdChange = (event, newValue) => {
    setThreshold(newValue);
  };

  const handleApplyEffect = () => {
    console.log('Applying effect...');
  };

  const handleDownload = () => {
    console.log('Downloading...');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Dither It
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <input
            accept="image/*"
            type="file"
            id="image-upload"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span" fullWidth>
              Upload Image
            </Button>
          </label>
        </Box>

        {previewUrl && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </Box>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Dithering Algorithm</InputLabel>
          <Select value={algorithm} onChange={handleAlgorithmChange} label="Dithering Algorithm">
            <MenuItem value="floydSteinberg">Floyd-Steinberg</MenuItem>
            <MenuItem value="ordered">Ordered Dithering</MenuItem>
            <MenuItem value="random">Random Dithering</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Threshold</Typography>
          <Slider
            value={threshold}
            onChange={handleThresholdChange}
            min={0}
            max={255}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleApplyEffect}
            disabled={!selectedImage}
            fullWidth
          >
            Apply Effect
          </Button>
          <Button
            variant="outlined"
            onClick={handleDownload}
            disabled={!selectedImage}
            fullWidth
          >
            Download
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default App; 