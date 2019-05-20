import styled from 'styled-components';

export const BannerContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
`;

export const BannerIconHolder = styled.div`
  flex-shrink: 0;
  padding: 12px;
  height: 100%;
`;

export const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 12px 12px 12px 0;
  margin-top: 12px;
`;
