import yup from 'yup';

export const schema = yup.object().shape({
  aws: yup.object().shape({
    accessKeyId: yup.string().required(),
    secretAccessKey: yup.string().required(),
    region: yup.string(),
  }),
  buckets: yup
    .array()
    .of(yup.string())
    .required(),
});
