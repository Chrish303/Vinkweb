const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const graphql = require('graphql');
const _ = require('lodash')

const { GraphQLString, GraphQLID, GraphQLInt, GraphQLList } = graphql;

var books = [
    { name: 'thirukural', gener: 'gener1', id: '1', authoID: '1' },
    { name: 'papanasam', gener: 'gener2', id: '2', authoID: '2' },
    { name: 'vikadakavi', gener: 'gener3', id: '3', authoID: '3' },
    { name: 'ramayanam', gener: 'gener3', id: '3', authoID: '2' },
    { name: 'kamban', gener: 'gener3', id: '3', authoID: '2' },
    { name: 'thenaliraman', gener: 'gener6', id: '3', authoID: '3' },
    { name: 'Do or Die', gener: 'gener3', id: '3', authoID: '1' }
];

var authors = [
    { id: '1', name: 'ajil', age: '22' },
    { id: '2', name: 'somanth', age: '21' },
    { id: '3', name: 'ajay', age: '30' }
];

const Booktype = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        gener: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return (_.find(authors, { id: parent.authoID }))
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(Booktype),
            resolve(parent, args) {
                return _.filter(books, { authoID: parent.id })
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: Booktype,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db/other source
                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db/other source
                return _.find(authors, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(Booktype),
            resolve(parent, args) {
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})