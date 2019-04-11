import yup from 'yup';

export const schema = yup.object().shape({
  aws: yup
    .object()
    .shape({
      accessKeyId: yup.string(),
      secretAccessKey: yup.string(),
      region: yup.string(),
    })
    .default(() => ({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })),
  buckets: yup.array().required(),
});
