import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import get from '../../functions/AxiosGET';

import { Loading, Owner, IssueList } from './styles';

import Container from '../../components/Container';

function Repository({ match: { params } }) {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repositoryURN = decodeURIComponent(params.repository);

    const proccess = async () => {
      const [repo, issuesList] = await Promise.all([
        get(`/repos/${repositoryURN}`),
        get(`/repos/${repositoryURN}/issues`, {
          params: {
            state: 'open',
            per_stage: 5,
          },
        }),
      ]);

      setRepository(repo);
      setIssues(issuesList);
      setLoading(false);
    };

    proccess();
  }, [params.repository]);

  return loading ? (
    <Loading>Carregando</Loading>
  ) : (
    <Container>
      <Owner>
        <Link to="/">Voltar aos repositórios</Link>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <h1>{repository.name}</h1>
        <p>{repository.description}</p>
      </Owner>

      <IssueList>
        {issues.map((issue, index) => (
          <li key={index}>
            <img src={issue.user.avatar_url} alt={issue.user.login}></img>
            <div>
              <strong>
                <a href={issue.html}>{issue.title}</a>
                {issue.labels.map((label, i) => (
                  <span key={i}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssueList>
    </Container>
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
