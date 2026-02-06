import pkg from '@acsbe/accessflow-sdk';
const { globalTeardown: accessFlowSdkGlobalTeardown } = pkg;

export default async function globalTeardown() {
  console.log('Running accessFlow SDK global teardown...');
  await accessFlowSdkGlobalTeardown();
  console.log('accessFlow SDK teardown complete!');
}
