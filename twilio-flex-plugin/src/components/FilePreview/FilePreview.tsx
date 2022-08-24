import { Icon } from '@twilio/flex-ui';
import * as React from 'react';
import { Container, Extension, FileBody, FileIcon, Filename, FilenameRaw, Filesize } from './FilePreview.Components';

interface FilePreviewProps {
  file: Partial<File>;
  iconOverride?: React.ReactNode;
  titleLine?: React.ReactNode;
  subTitleLine?: React.ReactNode;
  disabled?: boolean;
}

export class FilePreview extends React.PureComponent<FilePreviewProps> {
  renderIcon() {
    if (React.isValidElement(this.props.iconOverride)) {
      return this.props.iconOverride;
    }

    return <Icon sizeMultiplier={2} icon={getFileIcon(this.props.file)} />;
  }

  render() {
    const { subTitleLine, file, titleLine, disabled } = this.props;
    const [, name, extension] = /^(.+)\.(.+)?/.exec(file.name!) || [];

    return (
      <Container disabled={disabled}>
        <FileIcon aria-disabled={disabled}>{this.renderIcon()}</FileIcon>
        <FileBody>
          <Filename>
            {titleLine || (
              <>
                <FilenameRaw data-test="MediaMessageBubble-FileName">{name}</FilenameRaw>
                <Extension data-test="MediaMessageBubble-FileExtension">{`.${extension}`}</Extension>
              </>
            )}
          </Filename>
          <Filesize>{subTitleLine || `${Math.ceil(file.size! / 1024)} KB`}</Filesize>
        </FileBody>
      </Container>
    );
  }
}

const getFileIcon = (file: Partial<File>) => {
  const matchedObject = Object.values(FILE_TYPES).find(
    (fileOptions) => file.name && file.name.match(fileOptions.extension) && file.type && file.type.match(fileOptions.type)
  );

  return matchedObject ? matchedObject.iconName : 'GenericDoc';
};

export const FILE_TYPES = {
  jpg: {
    extension: /(\.jpg)$/i,
    type: /^(image)/i,
    iconName: 'GenericImage',
  },
  jpeg: {
    extension: /(\.jpeg)$/i,
    type: /^(image)/i,
    iconName: 'GenericImage',
  },
  png: {
    extension: /(\.png)$/i,
    type: /^(image)/i,
    iconName: 'GenericImage',
  },
  heic: {
    extension: /(\.heic)$/i,
    type: /^(image)/i,
    iconName: 'GenericImage',
  },
  gif: {
    extension: /(\.gif)$/i,
    type: /^(image)/i,
    iconName: 'GenericImage',
  },
  amr: {
    extension: /(\.amr)$/i,
    type: /^(audio)/i,
    iconName: 'GenericImage',
  },
  mp3: {
    extension: /(\.mp3)$/i,
    type: /^(audio)/i,
    iconName: 'GenericImage',
  },
  mp4: {
    extension: /(\.mp4)$/i,
    type: /^(video)/i,
    iconName: 'Video',
  },
  pdf: {
    extension: /(\.pdf)$/i,
    type: /^(application\/pdf)$/,
    iconName: 'Pdf',
  },
  txt: {
    extension: /(\.txt)$/i,
    type: /^(document)/i,
    iconName: 'GenericDoc',
  },
};
