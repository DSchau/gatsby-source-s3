import { createRemoteFileNode } from 'gatsby-source-filesystem';

export function downloadImageFile(node, { store, cache, createNode, touchNode }) {
  let imageNodeId;
  const cacheKey = node.id;

  const cacheData = await cache.get(cacheKey);

  if (cacheData && node.LastModified === cacheData.LastModified) {
    imageNodeId = cacheData.imageNodeId;
    touchNode(cacheData.imageNodeId);
  }

  if (!imageNodeId) {
    try {
      const imageNode = await createRemoteFileNode({
        url: node.url,
        store,
        cache,
        createNode
      });

      if (imageNode) {
        imageNodeId = imageNode.id;

        await cache.set(cacheKey, {
          imageNodeId,
          LastModified: node.LastModified
        });
      }
    } catch (e) {} // ignore
  }

  return node;
}
