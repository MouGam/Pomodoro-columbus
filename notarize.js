// 이 파일은 개발자 계정 설정할 경우만 필요함

// const { notarize } = require('electron-notarize');

// exports.default = async function notarizing(context) {
//   const { electronPlatformName, appOutDir } = context;  
//   if (electronPlatformName !== 'darwin') {
//     return;
//   }

//   const appName = context.packager.appInfo.productFilename;

//   return await notarize({
//     appBundleId: 'com.yourcompany.pomodoro',
//     appPath: `${appOutDir}/${appName}.app`,
//     appleId: process.env.APPLE_ID,
//     appleIdPassword: process.env.APPLE_ID_PASSWORD,
//   });
// };
