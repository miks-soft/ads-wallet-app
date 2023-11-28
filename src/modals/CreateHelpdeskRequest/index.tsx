import React, { RefObject, useRef, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { useSelector } from '#hooks/redux';

import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import { STRINGS } from '#localization';

import {
  useGetHelpdeskThemesQuery,
  usePostHelpdeskRequestMutation,
} from '#api/controllers/Tracker';

import ToastService from '#services/ToastService';

import useErrorHandler from '#hooks/useErrorHandler';
import useField from '#hooks/useField';
import useModal, { ModalController } from '#hooks/useModal';

import Debug from '#utils/debug';

import { DTOHelpdeskTheme } from '#generated/types';

import Layout from './layout';

type NavigationProps = ModalsScreenProps<ModalsRoutes.CreateHelpdeskRequest>;

const ACCEPTABLE_MIME = [
  DocumentPicker.types.images,
  DocumentPicker.types.docx,
  DocumentPicker.types.doc,
  DocumentPicker.types.pdf,
];

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const [theme, setTheme] = useState<DTOHelpdeskTheme | undefined>();
  const [name, setName, errorName, setErrorName] = useField('');
  const [text, setText, errorText, setErrorText] = useField('');

  const [attachments, setAttachments] = useState<DocumentPickerResponse[]>([]);

  const refName = useRef<TextInput>(null);
  const refText = useRef<TextInput>(null);

  const themesQuery = useGetHelpdeskThemesQuery();
  const [postHelpdeskRequest, postHelpdeskRequestMutation] =
    usePostHelpdeskRequestMutation({});

  const onAdd = async () => {
    Keyboard.dismiss();

    try {
      postHelpdeskRequest({
        data: {
          name: name,
          business_account_id: currentBusinessAccountId,
          helpdesk_theme_id: theme?.id!,
          message: text,
        },
        files: attachments,
      });

      props.route.params.onEnd && props.route.params.onEnd();

      ToastService.success(STRINGS.TOASTS.createHelpdeskRequestSuccess);

      modal.close();
    } catch {}
  };

  const onAttach = async () => {
    try {
      const response = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: ACCEPTABLE_MIME,
      });
      setAttachments(old => [...old, ...response]);
    } catch (e) {
      Debug.error('er', e);
    }
  };

  useErrorHandler(errors => {
    setErrorName(errors.name);
    setErrorText(errors.message);
  }, postHelpdeskRequestMutation);

  return (
    <Layout
      /**
       *Options
       */
      attachments={attachments}
      errorName={errorName}
      errorText={errorText}
      isLoading={false}
      modal={modal}
      name={name}
      refName={refName}
      refText={refText}
      text={text}
      theme={theme}
      themes={themesQuery.data}
      themesLoading={themesQuery.isLoading}
      /**
       *Methods
       */
      onAdd={onAdd}
      onAttach={onAttach}
      setAttachments={setAttachments}
      setName={setName}
      setText={setText}
      setTheme={setTheme}
      {...props}
    />
  );
};

type PassingStates = {
  theme?: DTOHelpdeskTheme;
  text: string;
  name: string;
  attachments: DocumentPickerResponse[];
};

type PassingProps = {
  refName: RefObject<TextInput>;
  refText: RefObject<TextInput>;
  errorText: string;
  errorName: string;
  modal: ModalController;
  isLoading: boolean;
  themes?: DTOHelpdeskTheme[];
  themesLoading: boolean;

  onAdd: () => void;
  onAttach: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
