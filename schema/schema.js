//const { projects, clients } = require("../server/sampleData");
const Project = require('../modules/Project');
const Client = require("../modules/Client")

const { GraphQLObjectType, GraphQLID,
    GraphQLString, GraphQLSchema, GraphQLList,
    GraphQLNonNull, GraphQLEnumType } = require('graphql');


const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId)
            }
        }
    })
});


const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            }

        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            }

        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return clients.find(client => client.id === args.id);
                return Client.findById(args.id);
            }
        }
    }

});

//Mutation
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                return client.save();
            }
        },

        // deleteClient: {
        //     type: ClientType,
        //     args: {
        //         id: { type: GraphQLNonNull(GraphQLID) }
        //     },
        //     resolve(parent, args) {
        //         Project.find({ clientId: args.id }).then((projects) => {
        //             projects.forEach((project) => {
        //                 project.deleteOne();
        //             });
        //         })
        //         return Client.findOneAndRemove(args.id);
        //     }
        // },

        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args) {
                try {
                    // Find and delete all projects associated with the client
                    await Project.deleteMany({ clientId: args.id });

                    // Delete the client itself
                    const deletedClient = await Client.findByIdAndRemove(args.id);

                    return deletedClient;
                } catch (error) {
                    throw new Error(`Failed to delete client and associated projects: ${error.message}`);
                }
            }
        },


        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': { value: 'not Started' },
                            'progress': { value: 'in progress' },
                            'completed': { value: 'completed' },

                        }
                    }),
                    defaultValue: 'not Started',
                },
                clientId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return project.save();
            },

        },

        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Project.findOneAndRemove(args.id);
            }
        },

        //updateProject

        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': { value: 'not Started' },
                            'progress': { value: 'in progress' },
                            'completed': { value: 'completed' },

                        }
                    }),
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                    },
                },
                    { new: true }
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})

