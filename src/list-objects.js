import AWS from 'aws-sdk';

/*
 * This is currently limited to 1000 objects by S3
 * if needed, NextContinuationToken can probably be used to get all
 */
export const listObjects = (bucket, config = {}, maxKeys = 1000) => {
  AWS.config.update(config);

  const s3 = new AWS.S3();

  const buckets = [].concat(bucket);

  return Promise.all(
    buckets.map(bucket => {
      return s3
        .listObjectsV2({
          MaxKeys: maxKeys,
          ...(typeof bucket === 'string' ? { Bucket: bucket } : bucket),
        })
        .promise();
    })
  );
};
