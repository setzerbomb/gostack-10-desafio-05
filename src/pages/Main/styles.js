import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: ${({ error }) => (error ? '1px solid red' : '1px solid #eee')};

    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`;

export const SubmitButton = styled.button.attrs(({ loading }) => ({
  type: 'submit',
  disabled: !!loading,
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;

    svg {
      animation: ${rotate} 2s linear infinite;
    }
  }

  /*
    Adiciona CSS com base em uma propriedade de fora
    ${(props) =>
      props.loading &&
      css`
        svg {
          animation: ${rotate} 2s linear infinite;
        }
      `}
  */
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;
  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    & + li {
      border-top: 1px solid #eee;
    }
    a {
      color: #7159c1;
      text-decoration: none;
    }
  }
`;

const animate = keyframes`
  0%   {
    from {
      opacity: 0;
      top: 0px; left: 0px;
    }

    to {
     opacity: 1;
    }
  }
  20%  {background: red;}
  85%  {background: red; }
  100% {
    from {
      opacity: 0.5;
    }

    to {
      opacity: 0;
    }
  }`;

export const Fade = styled.main`
  animation: ${animate} 4s linear;

  p {
    color: white;
    text-align: center;
    padding: 10px;
    font-family: Arial, Helvetica, sans-serif;
    border-radius: 3px;
    font-size: 20px;
  }
`;
