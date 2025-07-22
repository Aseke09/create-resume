// routes/files.js
const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const router = express.Router();

// helper that returns a GridFSBucket instance
const getBucket = (name) =>
  new GridFSBucket(mongoose.connection.db, { bucketName: name });

router.get('/image/:id', async (req, res) => {
  let oid;
  try {
    oid = new mongoose.Types.ObjectId(req.params.id);
  } catch {
    return res.status(400).send('Bad image id');
  }

  const pipeFrom = (name) =>
    new Promise((resolve, reject) => {
      const stream = getBucket(name).openDownloadStream(oid)

      stream.on('file', (file) => {
      res.set('Content-Type', file.contentType || 'image/jpeg');
    });

      stream.on('error', reject);
      stream.pipe(res).on('error', reject).on('finish', resolve)
    });

  try {
    return await pipeFrom('profileImages');
  } catch {
    try {
      return await pipeFrom('resumeImages');
    } catch {
      // console.warn("Image not found in GridFS:", req.params.id);
      return res.sendStatus(404);
    }
  }
});

module.exports = router;
