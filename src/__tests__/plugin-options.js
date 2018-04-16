import { schema } from '../plugin-options';

const getAwsCredentials = () => {
  return {
    secretAccessKey: 'ha',
    accessKeyId: 'no',
  };
};

test('it throws when aws key is not specified', async () => {
  try {
    await schema.validate({
      buckets: ['test'],
    });
  } catch (e) {
    expect(e.message).toEqual(
      expect.stringMatching(/aws.+is a required field/)
    );
  }
});

test('it throws when buckets are not defined', async () => {
  try {
    await schema.validate({
      aws: getAwsCredentials(),
    });
  } catch (e) {
    expect(e.message).toBe('buckets is a required field');
  }
});

test('it throws when empty buckets', async () => {
  try {
    await schema.validate({
      aws: getAwsCredentials(),
      buckets: [],
    });
  } catch (e) {
    expect(e.message).toBe('buckets is a required field');
  }
});

test('it passes with correct config', async () => {
  try {
    await schema.validate({
      aws: getAwsCredentials(),
      buckets: ['photos.dustinschau.com'],
    });
  } catch (e) {
    expect(e).toEqual(expect.any(Error));
  } finally {
    expect.assertions(0);
  }
});
