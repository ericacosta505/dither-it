import React, { useState, useEffect } from 'react';
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
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessedImageUrl(null);
    }
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
    setProcessedImageUrl(null);
  };

  const handleThresholdChange = (event, newValue) => {
    setThreshold(newValue);
    setProcessedImageUrl(null);
  };

  const floydSteinbergDither = (imageData, threshold) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const oldR = data[idx];
        const oldG = data[idx + 1];
        const oldB = data[idx + 2];
        
        // Apply threshold to each channel separately
        const newR = oldR < threshold ? 0 : 255;
        const newG = oldG < threshold ? 0 : 255;
        const newB = oldB < threshold ? 0 : 255;
        
        // Calculate error for each channel
        const errorR = oldR - newR;
        const errorG = oldG - newG;
        const errorB = oldB - newB;
        
        // Set new pixel values
        data[idx] = newR;
        data[idx + 1] = newG;
        data[idx + 2] = newB;
        
        // Distribute error to neighboring pixels for each channel
        if (x + 1 < width) {
          data[(y * width + x + 1) * 4] += errorR * 7/16;
          data[(y * width + x + 1) * 4 + 1] += errorG * 7/16;
          data[(y * width + x + 1) * 4 + 2] += errorB * 7/16;
        }
        if (y + 1 < height) {
          if (x > 0) {
            data[((y + 1) * width + x - 1) * 4] += errorR * 3/16;
            data[((y + 1) * width + x - 1) * 4 + 1] += errorG * 3/16;
            data[((y + 1) * width + x - 1) * 4 + 2] += errorB * 3/16;
          }
          data[((y + 1) * width + x) * 4] += errorR * 5/16;
          data[((y + 1) * width + x) * 4 + 1] += errorG * 5/16;
          data[((y + 1) * width + x) * 4 + 2] += errorB * 5/16;
          if (x + 1 < width) {
            data[((y + 1) * width + x + 1) * 4] += errorR * 1/16;
            data[((y + 1) * width + x + 1) * 4 + 1] += errorG * 1/16;
            data[((y + 1) * width + x + 1) * 4 + 2] += errorB * 1/16;
          }
        }
      }
    }
    return imageData;
  };

  const stuckiDither = (imageData, threshold) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const oldR = data[idx];
        const oldG = data[idx + 1];
        const oldB = data[idx + 2];
        
        // Apply threshold
        const newR = oldR < threshold ? 0 : 255;
        const newG = oldG < threshold ? 0 : 255;
        const newB = oldB < threshold ? 0 : 255;
        
        // Calculate error
        const errorR = oldR - newR;
        const errorG = oldG - newG;
        const errorB = oldB - newB;
        
        // Set new values
        data[idx] = newR;
        data[idx + 1] = newG;
        data[idx + 2] = newB;

        // Distribute errors using Stucki pattern
        // Current row
        if (x + 1 < width) {
          data[(y * width + x + 1) * 4] += errorR * 8/42;
          data[(y * width + x + 1) * 4 + 1] += errorG * 8/42;
          data[(y * width + x + 1) * 4 + 2] += errorB * 8/42;
        }
        if (x + 2 < width) {
          data[(y * width + x + 2) * 4] += errorR * 4/42;
          data[(y * width + x + 2) * 4 + 1] += errorG * 4/42;
          data[(y * width + x + 2) * 4 + 2] += errorB * 4/42;
        }

        // Next row
        if (y + 1 < height) {
          if (x - 2 >= 0) {
            data[((y + 1) * width + x - 2) * 4] += errorR * 2/42;
            data[((y + 1) * width + x - 2) * 4 + 1] += errorG * 2/42;
            data[((y + 1) * width + x - 2) * 4 + 2] += errorB * 2/42;
          }
          if (x - 1 >= 0) {
            data[((y + 1) * width + x - 1) * 4] += errorR * 4/42;
            data[((y + 1) * width + x - 1) * 4 + 1] += errorG * 4/42;
            data[((y + 1) * width + x - 1) * 4 + 2] += errorB * 4/42;
          }
          data[((y + 1) * width + x) * 4] += errorR * 8/42;
          data[((y + 1) * width + x) * 4 + 1] += errorG * 8/42;
          data[((y + 1) * width + x) * 4 + 2] += errorB * 8/42;
          if (x + 1 < width) {
            data[((y + 1) * width + x + 1) * 4] += errorR * 4/42;
            data[((y + 1) * width + x + 1) * 4 + 1] += errorG * 4/42;
            data[((y + 1) * width + x + 1) * 4 + 2] += errorB * 4/42;
          }
          if (x + 2 < width) {
            data[((y + 1) * width + x + 2) * 4] += errorR * 2/42;
            data[((y + 1) * width + x + 2) * 4 + 1] += errorG * 2/42;
            data[((y + 1) * width + x + 2) * 4 + 2] += errorB * 2/42;
          }
        }

        // Two rows down
        if (y + 2 < height) {
          if (x - 2 >= 0) {
            data[((y + 2) * width + x - 2) * 4] += errorR * 1/42;
            data[((y + 2) * width + x - 2) * 4 + 1] += errorG * 1/42;
            data[((y + 2) * width + x - 2) * 4 + 2] += errorB * 1/42;
          }
          if (x - 1 >= 0) {
            data[((y + 2) * width + x - 1) * 4] += errorR * 2/42;
            data[((y + 2) * width + x - 1) * 4 + 1] += errorG * 2/42;
            data[((y + 2) * width + x - 1) * 4 + 2] += errorB * 2/42;
          }
          data[((y + 2) * width + x) * 4] += errorR * 4/42;
          data[((y + 2) * width + x) * 4 + 1] += errorG * 4/42;
          data[((y + 2) * width + x) * 4 + 2] += errorB * 4/42;
          if (x + 1 < width) {
            data[((y + 2) * width + x + 1) * 4] += errorR * 2/42;
            data[((y + 2) * width + x + 1) * 4 + 1] += errorG * 2/42;
            data[((y + 2) * width + x + 1) * 4 + 2] += errorB * 2/42;
          }
          if (x + 2 < width) {
            data[((y + 2) * width + x + 2) * 4] += errorR * 1/42;
            data[((y + 2) * width + x + 2) * 4 + 1] += errorG * 1/42;
            data[((y + 2) * width + x + 2) * 4 + 2] += errorB * 1/42;
          }
        }
      }
    }
    return imageData;
  };

  const burkesDither = (imageData, threshold) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const oldR = data[idx];
        const oldG = data[idx + 1];
        const oldB = data[idx + 2];
        
        // Apply threshold
        const newR = oldR < threshold ? 0 : 255;
        const newG = oldG < threshold ? 0 : 255;
        const newB = oldB < threshold ? 0 : 255;
        
        // Calculate error
        const errorR = oldR - newR;
        const errorG = oldG - newG;
        const errorB = oldB - newB;
        
        // Set new values
        data[idx] = newR;
        data[idx + 1] = newG;
        data[idx + 2] = newB;

        // Distribute errors using Burkes pattern
        // Current row
        if (x + 1 < width) {
          data[(y * width + x + 1) * 4] += errorR * 8/32;
          data[(y * width + x + 1) * 4 + 1] += errorG * 8/32;
          data[(y * width + x + 1) * 4 + 2] += errorB * 8/32;
        }
        if (x + 2 < width) {
          data[(y * width + x + 2) * 4] += errorR * 4/32;
          data[(y * width + x + 2) * 4 + 1] += errorG * 4/32;
          data[(y * width + x + 2) * 4 + 2] += errorB * 4/32;
        }

        // Next row
        if (y + 1 < height) {
          if (x - 2 >= 0) {
            data[((y + 1) * width + x - 2) * 4] += errorR * 2/32;
            data[((y + 1) * width + x - 2) * 4 + 1] += errorG * 2/32;
            data[((y + 1) * width + x - 2) * 4 + 2] += errorB * 2/32;
          }
          if (x - 1 >= 0) {
            data[((y + 1) * width + x - 1) * 4] += errorR * 4/32;
            data[((y + 1) * width + x - 1) * 4 + 1] += errorG * 4/32;
            data[((y + 1) * width + x - 1) * 4 + 2] += errorB * 4/32;
          }
          data[((y + 1) * width + x) * 4] += errorR * 8/32;
          data[((y + 1) * width + x) * 4 + 1] += errorG * 8/32;
          data[((y + 1) * width + x) * 4 + 2] += errorB * 8/32;
          if (x + 1 < width) {
            data[((y + 1) * width + x + 1) * 4] += errorR * 4/32;
            data[((y + 1) * width + x + 1) * 4 + 1] += errorG * 4/32;
            data[((y + 1) * width + x + 1) * 4 + 2] += errorB * 4/32;
          }
          if (x + 2 < width) {
            data[((y + 1) * width + x + 2) * 4] += errorR * 2/32;
            data[((y + 1) * width + x + 2) * 4 + 1] += errorG * 2/32;
            data[((y + 1) * width + x + 2) * 4 + 2] += errorB * 2/32;
          }
        }
      }
    }
    return imageData;
  };

  const sierraDither = (imageData, threshold) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const oldR = data[idx];
        const oldG = data[idx + 1];
        const oldB = data[idx + 2];
        
        // Apply threshold
        const newR = oldR < threshold ? 0 : 255;
        const newG = oldG < threshold ? 0 : 255;
        const newB = oldB < threshold ? 0 : 255;
        
        // Calculate error
        const errorR = oldR - newR;
        const errorG = oldG - newG;
        const errorB = oldB - newB;
        
        // Set new values
        data[idx] = newR;
        data[idx + 1] = newG;
        data[idx + 2] = newB;

        // Distribute errors using Sierra pattern
        // Current row
        if (x + 1 < width) {
          data[(y * width + x + 1) * 4] += errorR * 5/32;
          data[(y * width + x + 1) * 4 + 1] += errorG * 5/32;
          data[(y * width + x + 1) * 4 + 2] += errorB * 5/32;
        }
        if (x + 2 < width) {
          data[(y * width + x + 2) * 4] += errorR * 3/32;
          data[(y * width + x + 2) * 4 + 1] += errorG * 3/32;
          data[(y * width + x + 2) * 4 + 2] += errorB * 3/32;
        }

        // Next row
        if (y + 1 < height) {
          if (x - 2 >= 0) {
            data[((y + 1) * width + x - 2) * 4] += errorR * 2/32;
            data[((y + 1) * width + x - 2) * 4 + 1] += errorG * 2/32;
            data[((y + 1) * width + x - 2) * 4 + 2] += errorB * 2/32;
          }
          if (x - 1 >= 0) {
            data[((y + 1) * width + x - 1) * 4] += errorR * 4/32;
            data[((y + 1) * width + x - 1) * 4 + 1] += errorG * 4/32;
            data[((y + 1) * width + x - 1) * 4 + 2] += errorB * 4/32;
          }
          data[((y + 1) * width + x) * 4] += errorR * 5/32;
          data[((y + 1) * width + x) * 4 + 1] += errorG * 5/32;
          data[((y + 1) * width + x) * 4 + 2] += errorB * 5/32;
          if (x + 1 < width) {
            data[((y + 1) * width + x + 1) * 4] += errorR * 4/32;
            data[((y + 1) * width + x + 1) * 4 + 1] += errorG * 4/32;
            data[((y + 1) * width + x + 1) * 4 + 2] += errorB * 4/32;
          }
          if (x + 2 < width) {
            data[((y + 1) * width + x + 2) * 4] += errorR * 2/32;
            data[((y + 1) * width + x + 2) * 4 + 1] += errorG * 2/32;
            data[((y + 1) * width + x + 2) * 4 + 2] += errorB * 2/32;
          }
        }

        // Two rows down
        if (y + 2 < height) {
          if (x - 1 >= 0) {
            data[((y + 2) * width + x - 1) * 4] += errorR * 2/32;
            data[((y + 2) * width + x - 1) * 4 + 1] += errorG * 2/32;
            data[((y + 2) * width + x - 1) * 4 + 2] += errorB * 2/32;
          }
          data[((y + 2) * width + x) * 4] += errorR * 3/32;
          data[((y + 2) * width + x) * 4 + 1] += errorG * 3/32;
          data[((y + 2) * width + x) * 4 + 2] += errorB * 3/32;
          if (x + 1 < width) {
            data[((y + 2) * width + x + 1) * 4] += errorR * 2/32;
            data[((y + 2) * width + x + 1) * 4 + 1] += errorG * 2/32;
            data[((y + 2) * width + x + 1) * 4 + 2] += errorB * 2/32;
          }
        }
      }
    }
    return imageData;
  };

  const atkinsonDither = (imageData, threshold) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const oldR = data[idx];
        const oldG = data[idx + 1];
        const oldB = data[idx + 2];
        
        // Apply threshold
        const newR = oldR < threshold ? 0 : 255;
        const newG = oldG < threshold ? 0 : 255;
        const newB = oldB < threshold ? 0 : 255;
        
        // Calculate error
        const errorR = Math.floor((oldR - newR) / 8);
        const errorG = Math.floor((oldG - newG) / 8);
        const errorB = Math.floor((oldB - newB) / 8);
        
        // Set new values
        data[idx] = newR;
        data[idx + 1] = newG;
        data[idx + 2] = newB;

        // Distribute errors using Atkinson pattern
        // Current row
        if (x + 1 < width) {
          data[(y * width + x + 1) * 4] += errorR;
          data[(y * width + x + 1) * 4 + 1] += errorG;
          data[(y * width + x + 1) * 4 + 2] += errorB;
        }
        if (x + 2 < width) {
          data[(y * width + x + 2) * 4] += errorR;
          data[(y * width + x + 2) * 4 + 1] += errorG;
          data[(y * width + x + 2) * 4 + 2] += errorB;
        }

        // Next row
        if (y + 1 < height) {
          if (x - 1 >= 0) {
            data[((y + 1) * width + x - 1) * 4] += errorR;
            data[((y + 1) * width + x - 1) * 4 + 1] += errorG;
            data[((y + 1) * width + x - 1) * 4 + 2] += errorB;
          }
          data[((y + 1) * width + x) * 4] += errorR;
          data[((y + 1) * width + x) * 4 + 1] += errorG;
          data[((y + 1) * width + x) * 4 + 2] += errorB;
          if (x + 1 < width) {
            data[((y + 1) * width + x + 1) * 4] += errorR;
            data[((y + 1) * width + x + 1) * 4 + 1] += errorG;
            data[((y + 1) * width + x + 1) * 4 + 2] += errorB;
          }
        }

        // Two rows down
        if (y + 2 < height) {
          data[((y + 2) * width + x) * 4] += errorR;
          data[((y + 2) * width + x) * 4 + 1] += errorG;
          data[((y + 2) * width + x) * 4 + 2] += errorB;
        }
      }
    }
    return imageData;
  };

  const latticeBoltzmannDither = (imageData, threshold) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Create density and velocity arrays for each color channel
    const densityR = new Float32Array(width * height);
    const densityG = new Float32Array(width * height);
    const densityB = new Float32Array(width * height);
    const velocityX = new Float32Array(width * height);
    const velocityY = new Float32Array(width * height);
    
    // Initialize density from image data
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        densityR[y * width + x] = data[idx] / 255;
        densityG[y * width + x] = data[idx + 1] / 255;
        densityB[y * width + x] = data[idx + 2] / 255;
      }
    }

    // LBM parameters
    const omega = 1.0; // Relaxation parameter
    const iterations = 5;

    // Perform LBM iterations
    for (let iter = 0; iter < iterations; iter++) {
      // Collision step
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          const ux = velocityX[idx];
          const uy = velocityY[idx];
          
          // Update density and velocity using LBM equations for each channel
          const feqR = densityR[idx] * (1 - 1.5 * (ux * ux + uy * uy));
          const feqG = densityG[idx] * (1 - 1.5 * (ux * ux + uy * uy));
          const feqB = densityB[idx] * (1 - 1.5 * (ux * ux + uy * uy));
          
          densityR[idx] += omega * (feqR - densityR[idx]);
          densityG[idx] += omega * (feqG - densityG[idx]);
          densityB[idx] += omega * (feqB - densityB[idx]);
        }
      }

      // Streaming
      for (let y = height - 1; y > 0; y--) {
        for (let x = width - 1; x > 0; x--) {
          const idx = y * width + x;
          velocityX[idx] = velocityX[idx - 1];
          velocityY[idx] = velocityY[idx - width];
        }
      }
    }

    // Apply dithering based on LBM results
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const dR = densityR[y * width + x] * 255;
        const dG = densityG[y * width + x] * 255;
        const dB = densityB[y * width + x] * 255;
        
        // Apply threshold with LBM influence for each channel
        data[idx] = dR < threshold ? 0 : 255;
        data[idx + 1] = dG < threshold ? 0 : 255;
        data[idx + 2] = dB < threshold ? 0 : 255;
      }
    }
    
    return imageData;
  };

  const handleApplyEffect = async () => {
    if (!selectedImage) return;

    const img = new Image();
    img.src = previewUrl;
    
    await new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let processedData;
        
        if (algorithm === 'floydSteinberg') {
          processedData = floydSteinbergDither(imageData, threshold);
        } else if (algorithm === 'stucki') {
          processedData = stuckiDither(imageData, threshold);
        } else if (algorithm === 'burkes') {
          processedData = burkesDither(imageData, threshold);
        } else if (algorithm === 'sierra') {
          processedData = sierraDither(imageData, threshold);
        } else if (algorithm === 'atkinson') {
          processedData = atkinsonDither(imageData, threshold);
        } else if (algorithm === 'latticeBoltzmann') {
          processedData = latticeBoltzmannDither(imageData, threshold);
        }
        
        ctx.putImageData(processedData, 0, 0);
        setProcessedImageUrl(canvas.toDataURL());
        resolve();
      };
    });
  };

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.download = 'dithered-image.png';
      link.href = processedImageUrl;
      link.click();
    }
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
          <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>Original</Typography>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </Box>
            {processedImageUrl && (
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom>Processed</Typography>
                <img
                  src={processedImageUrl}
                  alt="Processed"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              </Box>
            )}
          </Box>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Dithering Algorithm</InputLabel>
          <Select value={algorithm} onChange={handleAlgorithmChange} label="Dithering Algorithm">
            <MenuItem value="floydSteinberg">Floyd-Steinberg</MenuItem>
            <MenuItem value="stucki">Stucki</MenuItem>
            <MenuItem value="burkes">Burkes</MenuItem>
            <MenuItem value="sierra">Sierra</MenuItem>
            <MenuItem value="atkinson">Atkinson</MenuItem>
            <MenuItem value="latticeBoltzmann">Lattice Boltzmann</MenuItem>
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
            disabled={!processedImageUrl}
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