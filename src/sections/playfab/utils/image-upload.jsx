import React from 'react';
import { Upload } from 'lucide-react';
import { Box, Button, Typography } from '@mui/material';

const ImageUpload = ({ label, onChange, preview }) => {
  const inputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" gutterBottom>
        {label}
      </Typography>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'grey.400',
          borderRadius: 1,
          p: 2,
          textAlign: 'center',
        }}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => inputRef.current?.click()}
          startIcon={<Upload />}
        >
          Choose File
        </Button>
        {preview && (
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{ mt: 2, maxWidth: '100%', borderRadius: 1 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload;
