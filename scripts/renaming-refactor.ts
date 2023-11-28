import fs from 'fs';

const script = () => {
  const rename = (_dir: string, file: string) => {
    fs.rename(_dir + `/${file}`, _dir + '/layout.tsx', err => {});
  };

  const scanDirectory = (dir: string) => {
    const directories = fs.readdirSync(dir);

    directories.forEach(directoryOrFile => {
      const isDirectory = !directoryOrFile.includes('.');

      if (isDirectory) {
        scanDirectory(dir + `/${directoryOrFile}`);
      }

      if (!isDirectory) {
        if (directoryOrFile.includes('View')) {
          rename(dir, directoryOrFile);
        }
      }
    });
  };

  scanDirectory('/Users/artemkalugin/ADSWalletrn/src/modals');
};

script();

export default script;

export const parser = 'tsx';
