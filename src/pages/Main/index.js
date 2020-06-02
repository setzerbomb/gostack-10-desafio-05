import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import get from '../../functions/AxiosGET';

import { List, Form, SubmitButton } from './styles';

import Container from '../../components/Container';

function Main() {
  const [newRepository, setNewRepository] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRepositories(JSON.parse(localStorage.getItem('repositories')) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { full_name: name, error } = await get(`/repos/${newRepository}`);

    if (!error) {
      if (!repositories.filter((r) => r?.name === name)[0]) {
        setRepositories([...repositories, { name }]);
      }
      setNewRepository('');
    }

    setLoading(false);
  };

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositórios
      </h1>

      <Form onSubmit={handleSubmit}>
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
    </Container>
  );
}

export default Main;
