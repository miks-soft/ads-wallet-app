import React, { useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import FastImage from 'react-native-fast-image';

import { Button } from '#ui-kit';
import Text from '#ui-kit/Text';

import { ENUMS, STRINGS } from '#localization';

import { useLazyGetTempLinkQuery } from '#api/controllers/Finance';

import FileManagerService from '#services/FileManagerService';
import DateFormatter from '#services/formatters/Date';

import Images from '#config/images';

import Debug from '#utils/debug';

import { shadow } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOFinanceDocument } from '#generated/types';

const MapExtensionLogo = {
  xlsx: Images.XLSXLogo,
  xls: Images.XLSXLogo,
  doc: Images.DOCLogo,
  docx: Images.DOCLogo,
  pdf: Images.PDFLogo,
};

const Document: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOFinanceDocument;
  }>
> = ({ containerStyle, item }) => {
  const colors = useColors();
  const styles = getStyles(colors);

  const [isLoading, setIsLoading] = useState(false);
  const [getTempLink] = useLazyGetTempLinkQuery({});
  const t = STRINGS.COMPONENT_DOCUMENT;

  const MapDocTypeColor = {
    act: colors.primary.normal,
    invoice: colors.success,
  };

  const onDownload = async () => {
    setIsLoading(true);

    try {
      const tempLink = await getTempLink({
        path: {
          id: item?.id!,
        },
      }).unwrap();

      if (!tempLink) {
        return;
      }

      await FileManagerService.download(tempLink, item?.file_name!);
    } catch (e) {
      Debug.error('error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const extension = item?.file_name?.split(
    '.',
  )[1] as keyof typeof MapExtensionLogo;

  return (
    <View style={containerStyle}>
      <View style={[styles.wrapper, shadow.style]}>
        <View style={styles.main}>
          <View style={styles.logoContainer}>
            <Text weight="300">
              {
                //@ts-expect-error TODO FIX DOCS
                DateFormatter.humanizeDate(item?.stored_at)
              }
            </Text>
            <FastImage
              source={MapExtensionLogo[extension]}
              style={styles.logo}
            />
          </View>
          <View style={styles.sidebar}>
            <View style={styles.line}>
              <Text>{t.fileNumber}</Text>
              <Text weight="500">{item?.number}</Text>
            </View>
            <View style={styles.line}>
              <Text>{t.extension}</Text>
              <Text
                color={
                  MapDocTypeColor[item?.file_type as keyof typeof ENUMS.DocType]
                }
                weight="500"
              >
                {ENUMS.DocType[item?.file_type as keyof typeof ENUMS.DocType]}
              </Text>
            </View>

            <Button
              isLoading={isLoading}
              size="small"
              style={styles.button}
              onPress={onDownload}
            >
              {t.download}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.white,
    },
    line: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    logo: {
      aspectRatio: 1,
    },
    logoContainer: {
      marginRight: 16,
    },
    main: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sidebar: {
      flex: 1,
      gap: 4,
    },
    button: {
      marginTop: 4,
    },
  });

export default Document;
