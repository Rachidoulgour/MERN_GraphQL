import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import { getAccessToken } from '../auth';

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//     headers: () => {
//         const accessToken = getAccessToken();
//         if(accessToken) {
//             return { 'Authorization': `Bearer ${accessToken}`};
//         }
//         return {};
//     }
// }
// );

const httpLink = createHttpLink({uri: 'http://localhost:9000/graphql'});
const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if(accessToken) {
        operation.setContext({
            headers: { 'Authorization': `Bearer ${accessToken}`}
        })
    }
    return forward(operation);
})

const apolloClient = new ApolloClient({
    // uri: 'http://localhost:9000/graphql',
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
})

export async function createJob({title, description}) {
    const mutation = gql`
    mutation CreateJob($input: CreateJobInput!){
        job: createJob(input: $input) {
            id
        }
    }`;
    const { data } = await apolloClient.mutate({
        mutation,
        variables: {input: { title, description }}
    });
    return data.job;

    // const {job} = await client.request(mutation, {input: {title, description}});
    // return job
}

export async function getCompany(id) {
    const query = gql`
    query companyById($id: ID!){
        company(id: $id) {
            id
            name
            description
            jobs {
                id
                date
                title
            }
        }
    }`;
    const { data } = await apolloClient.request({
        query, 
        variables: { id }
    });
    return data.company;
    // const {company} = await client.request(query, {id});
    // return company
}

export async function getJob(id) {
    const query = gql`
    query jobById($id: ID!){
            job(id: $id) {
            id
            date
            title
            company {
                id
                name
            }
            description
        }
    }`;
    const { data } = await apolloClient.request({
        query, 
        variables: { id }
    });
    return data.job;
    // const {job} = await client.request(query, {id});
    // return job
}

export async function getJobs() {
    const query = gql`
    query Jobs {
        jobs {
            id
            date
            title
            company {
                id
                name
            }
        }
    }`;
    const { data } = await apolloClient.request({query});
    return data.jobs;
    //OLd Code
    // const {jobs} = await client.request(query);
    // return jobs
}