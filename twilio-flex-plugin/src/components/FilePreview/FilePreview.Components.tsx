import styled from '@emotion/styled';

export const Container = styled('div')<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  ${(p) =>
    p.disabled &&
    `
        opacity: 0.4;
        cursor: not-allowed;
    `};
`;

export const FileBody = styled('div')`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const FileIcon = styled('div')`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Filename = styled('div')`
  font-weight: bold;
  display: flex;
`;

export const FilenameRaw = styled('div')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Extension = styled('div')`
  flex-shrink: 0;
`;

export const Filesize = styled('div')``;
