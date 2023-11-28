import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

import { Loader } from '#ui-kit';
import Text, { H4 } from '#ui-kit/Text';

import FileManagerService from '#services/FileManagerService';

import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

import { DTOAttachment } from '#generated/types';
const Attachment: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOAttachment;
    attachmentDownloadBase: string;
    overrideColors: MessageAttachmentColorScheme;
  }>
> = ({
  containerStyle,
  item,
  overrideColors,
  attachmentDownloadBase = '/tracker/attachment',
}) => {
  const colorScheme = useComponentsColors('MessageAttachemnt', overrideColors);
  const styles = getStyles(colorScheme);
  const [isLoading, setIsLoading] = useState(false);

  const onDownload = async () => {
    setIsLoading(true);
    try {
      await FileManagerService.download(
        `${attachmentDownloadBase}/${item?.id}/download`,
        item?.filename!,
      );
    } catch (e) {}
    setIsLoading(false);
  };

  return (
    <TouchableOpacity
      key={item?.id}
      style={[styles.attachment, containerStyle]}
      onPress={() => (isLoading ? undefined : onDownload())}
    >
      <View style={styles.iconContainer}>
        {isLoading ? (
          <Loader inverted />
        ) : (
          <View style={styles.attachmentIcon}>
            <Text
              color={colorScheme.extensionText}
              size={12}
              style={styles.type}
              weight="700"
            >
              {item?.filename?.split('.').at(-1)}
            </Text>
          </View>
        )}
      </View>
      <H4
        color={colorScheme.filenameText}
        style={styles.attachmentName}
      >
        {item?.filename}
      </H4>
    </TouchableOpacity>
  );
};

export const getMessageAttachmentColorScheme = (colors: Colors) => ({
  filenameText: colors.grayscale.__55,
  extensionText: colors.primary.light,
  attachmentIcon: colors.primary.pale,
});

type MessageAttachmentColorScheme = ReturnType<
  typeof getMessageAttachmentColorScheme
>;

const getStyles = (colorScheme: MessageAttachmentColorScheme) =>
  StyleSheet.create({
    attachment: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 4,
    },
    iconContainer: {
      minHeight: 40,
      minWidth: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    attachmentName: {
      flex: 1,
      marginLeft: 4,
    },
    attachmentIcon: {
      width: 40,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: colorScheme.attachmentIcon,
    },
    type: {
      textTransform: 'uppercase',
    },
  });

export default React.memo(Attachment);
