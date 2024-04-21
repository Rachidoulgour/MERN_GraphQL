import { GraphQLError } from "graphql";
import { createJob, getJob, getJobs, getJobsByCompany, deleteJob } from "./db/jobs.js"
import { getCompany } from "./db/companies.js"

export const resolvers = {
    Query: {
        company: async (_root, { id }) => { 
            const company = await getCompany(id)
            if(!company) {
                throw notFoundError('No company foud with id ' + id)
            }
            return company;
        },
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if(!job) {
                throw notFoundError('No job foud with id ' + id)
            }
            return job;
        },
        jobs: () => getJobs(),
    },

    Mutation: {
        createJob: (_root, { input: { title, description }}, {auth}) => {
            if(!auth) {
                throw unauthorizedError('Missing autentication')
            }
            const companyId = 'xxxxxxx'
            createJob({ companyId, title, description})
        },

        deleteJob: (_root,  { id }) => deleteJob(id),

        updateJob: (_root, { input: { id, title, description }}) => {
            updateJob({ id, title, description})
        },
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    },

    Job: { 
        company: (job) => getCompany(job.companyId),
        date: (job) => toIsoDate(job.createdAt),
    }
};

function notFoundError(message) {
    return new GraphQLError(message, {
        extension: { code: 'NOT_FOUND'},
    })
}

function unauthorizedError(message) {
    return new GraphQLError(message, {
        extension: { code: 'UNAUTHORIZED'},
    })
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length);
}