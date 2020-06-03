import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import get from '../../functions/AxiosGET';

import { Loading, Owner, IssueList, NavigationMenu } from './styles';

import Container from '../../components/Container';

function Repository({ match: { params } }) {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [issueState, setIssueState] = useState('');
  const [issuePage, setIssuePage] = useState(1);

  const findIssues = async (repositoryURN, state = 'open', page = 1) => {
    setLoading(true);
    const [repo, issuesList] = await Promise.all([
      get(`/repos/${repositoryURN}`),
      get(`/repos/${repositoryURN}/issues`, {
        params: {
          state,
          per_page: 5,
          page,
        },
      }),
    ]);

    if (repo?.error) {
      setError(true);
    } else {
      setRepository(repo);
      setIssues(issuesList);
      setLoading(false);
    }
  };

  useEffect(() => {
    setIssuePage(1);
  }, [issueState]);

  useEffect(() => {
    const repositoryURN = decodeURIComponent(params.repository);

    findIssues(repositoryURN, issueState || 'open', issuePage);
  }, [params.repository, issueState, issuePage]);

  return !error ? (
    loading ? (
      <Loading>Carregando</Loading>
    ) : (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img
            src={repository?.owner?.avatar_url}
            alt={repository?.owner?.login}
          />
          <h1>{repository?.name}</h1>
          <p>{repository?.description}</p>
        </Owner>
        <NavigationMenu>
          <span>
            <button
              type="button"
              onClick={(e) => issuePage > 1 && setIssuePage(issuePage - 1)}
            >
              Página Anterior
            </button>
          </span>

          <span>
            <span>Issues: </span>
            <button type="button" onClick={(e) => setIssueState('open')}>
              Open
            </button>
            <button type="button" onClick={(e) => setIssueState('closed')}>
              Closed
            </button>
            <button type="button" onClick={(e) => setIssueState('all')}>
              All
            </button>
          </span>
          <span>
            <button type="button" onClick={(e) => setIssuePage(issuePage + 1)}>
              Próxima Página
            </button>
          </span>
        </NavigationMenu>

        <IssueList>
          {issues.map((issue, index) => (
            <li key={index}>
              <img src={issue?.user?.avatar_url} alt={issue?.user?.login}></img>
              <div>
                <strong>
                  <a href={issue?.html}>{issue?.title}</a>
                  {issue?.labels.map((label, i) => (
                    <span key={i}>{label?.name}</span>
                  ))}
                </strong>
                <p>{issue?.user?.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    )
  ) : (
    <Redirect to="/"></Redirect>
  );
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};

export default Repository;
