import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { Text } from '#ui-kit';
import { H5 } from '#ui-kit/Text';

import DateFormatter from '#services/formatters/Date';

import { shadow } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOAttachment } from '#generated/types';

import Attachment from './Attachment';

const Message: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    attachmentDownloadBase: string;
    comment: Partial<{
      sender: string;
      text: string;
      created_at: string;
      attachments: DTOAttachment[];
    }>;
  }>
> = ({ containerStyle, comment, attachmentDownloadBase }) => {
  const haveSender = !!comment?.sender;
  const colors = useColors();

  const styles = getStyles(haveSender);
  return (
    <View style={[styles.container, StyleSheet.flatten(containerStyle)]}>
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: haveSender
              ? colors.grayscale.__5
              : colors.primary.normal,
          },
          shadow.style,
        ]}
      >
        {haveSender && (
          <Text
            color={haveSender ? colors.black : colors.white}
            weight="500"
          >
            {comment?.sender}
          </Text>
        )}

        <Text color={haveSender ? colors.black : colors.white}>
          {comment?.text}
        </Text>

        {!!comment?.attachments?.length &&
          comment.attachments.map(attachment => (
            <Attachment
              key={attachment?.id}
              attachmentDownloadBase={attachmentDownloadBase}
              item={attachment}
            />
          ))}

        <H5
          color={haveSender ? colors.black : colors.white}
          textAlign="right"
        >
          {DateFormatter.humanize(comment?.created_at)}
        </H5>
      </View>
    </View>
  );
};

const getStyles = (haveSender: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: haveSender ? 'flex-start' : 'flex-end',
    },
    wrapper: {
      width: '70%',
      maxWidth: '90%',
      paddingVertical: 12,
      padding: 16,
      borderRadius: 12,
    },
  });

export default React.memo(Message);
