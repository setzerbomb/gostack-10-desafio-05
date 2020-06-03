import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import get from '../../functions/AxiosGET';

import { List, Form, SubmitButton, Fade } from './styles';

import Container from '../../components/Container';

function Main() {
  const [newRepository, setNewRepository] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    setRepositories(JSON.parse(localStorage.getItem('repositories')) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { full_name: name, error: e } = await get(
        `/repos/${newRepository}`
      );

      if (!e) {
        if (!repositories.filter((r) => r?.name === name)[0]) {
          setRepositories([...repositories, { name }]);
        } else {
          throw Error('Repositorio Duplicado');
        }
        setNewRepository('');
      } else {
        throw Error(e);
      }
      setError(false);
    } catch (e) {
      setError(true);
      setMessage(e.message);
    }

    setLoading(false);
  };

  return (
    <Container>
      {message !== '' && (
        <Fade
          onAnimationEnd={() => {
            setMessage('');
          }}
        >
          <p>{message}</p>
        </Fade>
      )}
      <div>
        <h1 className={{ marginTop: '10px !important' }}>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={handleSubmit} error={error ? 1 : 0}>
          <input
            onChange={({ target: { value } }) => setNewRepository(value)}
            type="text"
            placeholder="Adicionar Repositório"
            value={newRepository}
          ></input>

          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((r, i) => (
            <li key={i}>
              <span>{r.name}</span>
              <Link to={`/repository/${encodeURIComponent(r.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </div>
    </Container>
  );
}

export default Main;
