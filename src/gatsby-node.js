import crypto from 'crypto';

import { listObjects } from './list-objects';
import { schema } from './plugin-options';
import { downloadImageFile } from './download-image-file';

const createContentDigest = obj =>
  crypto
    .createHash('md5')
    .update(JSON.stringify(obj))
    .digest('hex');

const isImage = object => /\.(jpe?g|png|webp|tiff?)$/i.test(object);
const getBucketName = () => {};

export async function sourceNodes(
  { boundActionCreators, store, cache },
  pluginOptions
) {
  const { createNode, touchNode } = boundActionCreators;

  const { aws: awsConfig, buckets: bucketsConfig } = await schema.validate(
    pluginOptions
  );

  const buckets = await listObjects(bucketsConfig, awsConfig);

  await Promise.all(
    buckets.map(({ Contents, ...rest }, index) => {
      return Promise.all(
        Contents.map(async content => {
          const { Key } = content;
          const node = {
            ...rest,
            ...content,
            Url: `https://s3.amazonaws.com/${rest.Name}/${Key}`,
            id: `s3-${Key}`,
            children: [],
            parent: '__SOURCE__',
            internal: {
              type: 'S3Object',
              contentDigest: createContentDigest(content),
              content: JSON.stringify(content),
            },
          };

          createNode(node);

          if (isImage(Key)) {
            const extension = Key.split('.').pop();
            const imageNode = {
              ...node,
              extension,
              id: `s3-image-${Key}`,
              internal: {
                type: 'S3Image',
                contentDigest: createContentDigest(content),
                content: JSON.stringify(content),
              },
            };
            const clone = await downloadImageFile(imageNode, {
              store,
              cache,
              createNode,
              touchNode,
            });
            createNode(clone);
          }
        })
      );
    })
  );

  return buckets;
}
