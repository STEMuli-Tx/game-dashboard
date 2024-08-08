import React, { useState } from 'react';
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
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
  });

  return (
    <section className="container">
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  );
}

export default DragNDrop;
