import { GraphQLError } from "graphql";
import { createJob, getJob, getJobs, getJobsByCompany, deleteJob, updateJob, countJobs } from "./db/jobs.js"
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
                throw notFoundError('No job foud with id ' + id);
            }
            return job;
        },
        jobs: async (_root, { limit, offset }) => {
            const items = await getJobs(limit, offset);
            const totalCount = await countJobs();
            return { items, totalCount}
        },
    },

    Mutation: {
        createJob: (_root, { input: { title, description }}, {user}) => {
            if(!user) {
                throw unauthorizedError('Missing autentication');
            }

            return createJob({ companyId: user.companyId, title, description})
        },

        deleteJob: async (_root,  { id }, { user }) => {
            if(!user) {
                throw unauthorizedError('Missing autentication')
            }
            const job = await deleteJob(id, user.companyId);
            if(!job) {
                throw notFoundError('No job foud with id ' + id);
            }
            return job;
        },

        updateJob: (_root, { input: { id, title, description }}, { user}) => {
            if(!user) {
                throw unauthorizedError('Missing autentication')
            }
            const job =  updateJob({ id, companyId: user.companyId, title, description});
            if(!job) {
                throw notFoundError('No job foud with id ' + id);
            }
            return job;
        },
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    },

    Job: { 
        company: (job, _args, { companyLoader }) => {
            return companyLoader.load(job.companyId)
        },
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