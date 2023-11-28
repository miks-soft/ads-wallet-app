import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Icon, Text } from '#ui-kit';

import { hitSlop } from '#styles';
import { Colors } from '#styles/theme';
import { useComponentsColors } from '#styles/theme/ComponentsColorContext';

export interface IAttachment {
  onDelete: () => void;
  name: string | null;
  type: string | null;
  overrideColors: AttachmentColorScheme;
}

const Attachment: React.FC<Partial<IAttachment>> = ({
  onDelete = () => {},
  name = '',
  type = '',
  overrideColors,
}) => {
  const colorScheme = useComponentsColors('Attachment', overrideColors);
  const styles = getStyles(colorScheme);
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text
          color={colorScheme.extensionText}
          style={styles.type}
          weight="900"
        >
          {type?.split('/')[1]}
        </Text>
      </View>
      <TouchableOpacity
        hitSlop={hitSlop}
        style={styles.deleteContainer}
        onPress={onDelete}
      >
        <Icon
          color={colorScheme.deleteIcon}
          name="close"
          size={12}
        />
      </TouchableOpacity>
      <Text size={10}>
        {name?.length && name.length > 12
          ? `${name?.substring(0, 9)}...`
          : name}
      </Text>
    </View>
  );
};

export const getAttachmentColorScheme = (colors: Colors) => ({
  container: colors.grayscale.__55,
  extensionText: colors.grayscale.__1,
  deleteIcon: colors.white,
  deleteContainerBorder: colors.white,
  deleteContainerBackground: colors.black,
});

type AttachmentColorScheme = ReturnType<typeof getAttachmentColorScheme>;

const getStyles = (colorScheme: AttachmentColorScheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: 12,
      paddingHorizontal: 6,
    },
    icon: {
      width: 60,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
      borderRadius: 10,
      backgroundColor: colorScheme.container,
    },
    deleteContainer: {
      width: 20,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 5,
      top: 4,
      right: -2,
      borderWidth: 2,
      borderColor: colorScheme.deleteContainerBorder,
      borderRadius: 10,
      backgroundColor: colorScheme.deleteContainerBackground,
    },
    type: {
      textTransform: 'uppercase',
    },
  });

export default Attachment;
