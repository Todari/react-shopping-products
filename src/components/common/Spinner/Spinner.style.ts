import styled from 'styled-components';

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  height: fit-content;
  width: 100%;
`;

export const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #09f;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
