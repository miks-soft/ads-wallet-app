import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Header, Icon, Loader, TextInput } from '#ui-kit';

import { Attachment, Message } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';

import { STRINGS } from '#localization';

import { useColors } from '#styles/theme/ColorsContext';

import { DTOHelpdeskRequest } from '#generated/types';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const t = STRINGS.SCREEN_HELPDESK_CHAT;
  const _comments: NonNullable<DTOHelpdeskRequest['comments']> = [
    ...(props.helpdeskRequest?.comments || []),
  ];

  if (props.helpdeskRequest?.description) {
    _comments.unshift({
      text: props.helpdeskRequest?.description,
      created_at: props.helpdeskRequest?.created_at,
      attachments: props.helpdeskRequest?.attachments,
    } as ArrayElement<DTOHelpdeskRequest['comments']>);
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Header
        hideRightIcon={true}
        subtitle={props.helpdeskRequest?.name}
        title={t.headerTitle}
        onPressLeft={props.navigation.goBack}
      />
      <FlatList
        data={_comments.reverse()}
        inverted={true}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={props.isLoading}
            onRefresh={props.onRefresh}
          />
        }
        renderItem={({ item }) => (
          <Message
            attachmentDownloadBase="/tracker/helpdesk"
            comment={{
              sender: item.manager ?? undefined,
              text: item.text,
              created_at: item.created_at,
              attachments: item.attachments,
            }}
            containerStyle={styles.message}
          />
        )}
        style={styles.messagesList}
      />
      <SafeAreaView edges={['bottom']}>
        <AvoidKeyboard
          mode="padding"
          offset={insets.bottom}
        >
          <ScrollView
            horizontal={true}
            style={styles.attachments}
          >
            {!!props.attachments.length &&
              props.attachments.map((el, index) => (
                <Attachment
                  key={index + `${el.uri}`}
                  name={el.name}
                  type={el.type}
                  onDelete={() =>
                    props.setAttachments(old =>
                      old.filter((item, idx) => index !== idx),
                    )
                  }
                />
              ))}
          </ScrollView>
          <TextInput
            containerStyle={styles.input}
            disabled={props.isLoading}
            IconLeft={
              <TouchableOpacity
                disabled={props.isLoading}
                onPress={props.onAttach}
              >
                <Icon
                  name="attach"
                  size={30}
                />
              </TouchableOpacity>
            }
            IconRight={
              <TouchableOpacity
                disabled={!props.message.length || props.isLoading}
                onPress={props.onSend}
              >
                {props.isSending ? (
                  <Loader />
                ) : (
                  <Icon
                    color={
                      !props.message.length
                        ? colors.grayscale.__5
                        : colors.primary.normal
                    }
                    name="send"
                    size={30}
                  />
                )}
              </TouchableOpacity>
            }
            multiline={true}
            placeholder={t.enterMessage}
            value={props.message}
            onChange={props.setMessage}
          />
        </AvoidKeyboard>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  attachments: {
    width: '100%',
    paddingHorizontal: 4,
  },
  message: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  messagesList: {
    flexGrow: 1,
  },
  input: {
    borderRadius: 0,
  },
});

export default Layout;
