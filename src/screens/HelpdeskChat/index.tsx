import React, { useEffect, useState } from 'react';

import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

import { AppRoutes, AppScreenProps } from '#navigation/types';

import {
  useGetHelpdeskRequestQuery,
  usePostHelpdeskRequestMessageMutation,
} from '#api/controllers/Tracker';

import { animateDecorator, animateLayout } from '#utils';
import Debug from '#utils/debug';

import { DTOHelpdeskRequest } from '#generated/types';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.HelpdeskChat>;

const ACCEPTABLE_MIME = [
  DocumentPicker.types.images,
  DocumentPicker.types.docx,
  DocumentPicker.types.doc,
  DocumentPicker.types.pdf,
];

//TODO INCREASE POOLING
const Container: React.FC<NavigationProps> = props => {
  const [helpdeskRequest, setHelpdeskRequest] = useState(
    props.route.params.defaultHelpdeskRequest,
  );
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<DocumentPickerResponse[]>([]);

  const helpdeskRequestQuery = useGetHelpdeskRequestQuery(
    {
      path: {
        id: props.route.params.helpdeskRequestId!,
      },
    },
    {
      skip: !props.route.params.helpdeskRequestId,
      pollingInterval: 6 * 1000,
    },
  );

  const [postHelpdeskRequestMessage, postHelpdeskRequestMessageMeta] =
    usePostHelpdeskRequestMessageMutation({});

  const onAttach = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: ACCEPTABLE_MIME,
        allowMultiSelection: true,
      });
      setAttachments(old => [...old, ...response]);
    } catch (e) {
      Debug.error('er', e);
    }
  };

  const onSend = async () => {
    try {
      await postHelpdeskRequestMessage({
        path: {
          id: helpdeskRequest?.id!,
        },
        data: {
          text: message,
        },
        files: attachments,
      });

      animateLayout();

      setHelpdeskRequest(old => ({
        ...old!,
        comments: [
          ...(old?.comments || []),
          {
            text: message,
            is_new: 0,
            created_at: new Date().toISOString(),
            manager: null,
            user_id: '',
            id: new Date().toISOString(),
            attachments: attachments.map((el, index) => ({
              filename: `${el.name}`,
              id: `${index}`,
              src: el.uri,
            })),
          },
        ],
      }));

      setMessage('');
      setAttachments([]);
    } catch {}
  };

  useEffect(() => {
    if (helpdeskRequestQuery.data) {
      setHelpdeskRequest(
        helpdeskRequestQuery.data as unknown as DTOHelpdeskRequest,
      );
    }
  }, [helpdeskRequestQuery.data]);

  return (
    <Layout
      /**
       *Options
       */
      attachments={attachments}
      helpdeskRequest={helpdeskRequest}
      isLoading={helpdeskRequestQuery.isLoading}
      isSending={postHelpdeskRequestMessageMeta.isLoading}
      message={message}
      onAttach={onAttach}
      onRefresh={helpdeskRequestQuery.refetch}
      onSend={onSend}
      /**
       *Methods
       */
      setAttachments={animateDecorator(setAttachments)}
      setHelpdeskRequest={setHelpdeskRequest}
      setMessage={setMessage}
      {...props}
    />
  );
};

type PassingStates = {
  message: string;
  attachments: DocumentPickerResponse[];
  helpdeskRequest?: DTOHelpdeskRequest;
};

type PassingProps = {
  isSending: boolean;
  isLoading: boolean;

  onRefresh: () => void;
  onAttach: () => void;
  onSend: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
