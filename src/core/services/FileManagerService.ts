import { PermissionsAndroid } from 'react-native';

import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import * as Keychain from 'react-native-keychain';

import { API_URL_RU, API_URL_USA, DEFAULT_API_URL } from '#env';

import { STRINGS } from '#localization';

import { __DEVELOPER__ } from '#config';

import { IS_IOS } from '#styles';

import { store } from '#store';

export type UIAttachment = { name: string | null; uri: string | null };

class FileManagerService {
  static async upload(
    url: string,
    data: Record<string, any | undefined>,
    files: UIAttachment[],
    fileField = 'files[]',
  ) {
    const form: {
      name: string;
      data: string;
      filename?: string;
    }[] = Object.entries(data).map(([key, value]) => ({
      name: key,
      data: value,
    }));

    files.forEach(el =>
      form.push({
        name: fileField,
        filename: `${el.name}`,
        data: `${RNFetchBlob.wrap(
          `${IS_IOS ? decodeURIComponent(el.uri?.substring(7)!) : el.uri}`,
        )}`,
      }),
    );

    const credentials = await Keychain.getGenericPassword();

    const result = await RNFetchBlob.fetch(
      'POST',
      `${
        __DEVELOPER__
          ? (store.getState() as any).app.region === 'RU'
            ? API_URL_RU
            : API_URL_USA
          : DEFAULT_API_URL
      }${url}`,
      {
        Authorization: credentials ? `Bearer ${credentials.password}` : '',
        'Content-type': 'multipart/form-data',
      },
      form,
    );

    return result;
  }

  static async download(url: string, filename: string) {
    if (!IS_IOS) {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (permission === 'denied') {
        return;
      }
      if (permission !== 'granted') {
        return;
      }
    }

    const credentials = await Keychain.getGenericPassword();

    const result = await RNFetchBlob.config({
      fileCache: true,
      path: RNFetchBlob.fs.dirs.DownloadDir + '/' + filename,
      addAndroidDownloads: {
        title: filename,
        description: `${STRINGS.formatString(
          STRINGS.DOWNLOAD_SERVICE.androidNotificationTitle,
          filename,
        )}`,
        useDownloadManager: true,
        notification: true,
      },
    }).fetch(
      'GET',
      `${
        __DEVELOPER__
          ? (store.getState() as any).app.region === 'RU'
            ? API_URL_RU
            : API_URL_USA
          : DEFAULT_API_URL
      }${url}`,
      {
        Authorization: credentials ? `Bearer ${credentials.password}` : '',
      },
    );

    IS_IOS && FileViewer.open(result.path());

    IS_IOS && result.flush();

    return result;
  }
}

export default FileManagerService;
