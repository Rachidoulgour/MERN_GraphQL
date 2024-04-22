import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { companyByIdQuery } from '../lib/graphql/queries';
//import { companies } from '../lib/fake-data';

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } =useQuery(companyByIdQuery, {
    variables: { id: companyId}
  })

  if(loading) {
    return <div>Loading...</div>
  }

  if(error) {
    return <div className="has-text-danger">Data unvailable</div>
  }

  const { company } = data;
  
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className="title is-5">
        Jobs at {company.name}
      </h2>
      <JobList jobs={company.jobs}/>
    </div>
  );
}

export default CompanyPage;
