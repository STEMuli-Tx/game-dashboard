import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ImageUpload from './image-upload';
import {
  createDraftItem,
  getUploadUrls,
  uploadToBlob,
  getCatalogConfig,
} from '../../../utils/playfab-service';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

const CreateItemForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [contentTypes, setContentTypes] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchCatalogConfig = async () => {
      try {
        const catalogConfig = await getCatalogConfig();
        setContentTypes(catalogConfig.ContentTypes);

        setTags(catalogConfig.Tags);
      } catch (error) {
        console.error('Error fetching catalog config:', error);
        toast.error('Failed to fetch catalog config');
      }
    };

    fetchCatalogConfig();
  }, []);

  const handleThumbnailChange = (file) => {
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleScreenshotChange = (file) => {
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const files = [];
      if (thumbnailFile) {
        files.push({ file: thumbnailFile, name: `thumbnail_${thumbnailFile.name}` });
      }
      if (screenshotFile) {
        files.push({ file: screenshotFile, name: `screenshot_${screenshotFile.name}` });
      }

      const uploadUrls = await getUploadUrls(files.map((f) => f.name));

      const uploadPromises = files.map(async (fileInfo, index) => {
        const uploadInfo = uploadUrls[index];
        await uploadToBlob(uploadInfo.Url, fileInfo.file);
        return {
          Type: fileInfo.name.startsWith('thumbnail_') ? 'Thumbnail' : 'Screenshot',
          Url: uploadInfo.Url,
          Id: uploadInfo.Id,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      const payload = {
        Item: {
          Type: 'ugc',
          Title: {
            NEUTRAL: data.title,
          },
          Description: {
            NEUTRAL: data.description,
          },
          Images: uploadedImages,
          DisplayProperties: {
            onHover: data.onHover,
            effectDuration: data.effectDuration,
            infectionDistance: data.infectionDistance,
            infectedDuration: data.infectedDuration,
          },
          IsHidden: false,
          Tags: data.tags,
          ContentType: data.contentType,
        },
        Publish: true,
      };

      const response = await createDraftItem(payload);
      toast.success('Item created successfully!');
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error(error.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: '600px', mx: 'auto', p: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        Create Item
      </Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        {...register('title', { required: 'Title is required' })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        {...register('description', { required: 'Description is required' })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <ImageUpload
        label="Thumbnail Image"
        onChange={handleThumbnailChange}
        preview={thumbnailPreview}
      />
      <ImageUpload
        label="Screenshot Image"
        onChange={handleScreenshotChange}
        preview={screenshotPreview}
      />
      <TextField label="On Hover Text" fullWidth margin="normal" {...register('onHover')} />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="Effect Duration (seconds)"
            type="number"
            fullWidth
            margin="normal"
            {...register('effectDuration')}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Infection Distance (meters)"
            type="number"
            fullWidth
            margin="normal"
            {...register('infectionDistance')}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Infected Duration (seconds)"
            type="number"
            fullWidth
            margin="normal"
            {...register('infectedDuration')}
          />
        </Grid>
      </Grid>
      <FormControl fullWidth margin="normal">
        <InputLabel>Content Type</InputLabel>
        <Select
          label="Content Type"
          {...register('contentType', { required: 'Content Type is required' })}
          error={!!errors.contentType}
        >
          {contentTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Tags</InputLabel>
        <Select
          label="Tags"
          multiple
          {...register('tags')}
          defaultValue={[]}
          onChange={(e) => setValue('tags', e.target.value)}
        >
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Creating Item...' : 'Create Item'}
      </Button>
    </Box>
  );
};

export default CreateItemForm;
