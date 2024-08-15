import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  dropzone: {
    border: '2px dashed blue',
    borderRadius: '5px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
  },
});

function DragNDrop({ setFiles }) {
  const classes = useStyles();
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Only accept the first file
      if (acceptedFiles.length > 0) {
        setFiles([acceptedFiles[0]]);
      }
    },
    [setFiles]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  return (
    <section className="container">
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop an .xlsx file here, or click to select a file</p>
      </div>
    </section>
  );
}

export default DragNDrop;
