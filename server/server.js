// Loading the requirements
const express = require('express');
const cors = require('cors');

// Initializing the requirements.
const app = express();
app.use(cors({origin: "*"}));

// Loading and initializing of GraphQL default values.
const {graphqlHTTP} = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

// The first object that we use in this project is the list of authors name.
const authors = [
    {id: 1, name: 'Amir haghighi'},
    {id: 2, name: 'Bahareh'},
    {id: 3, name: 'Book author....'},
];

// The second object that we use in this project is the list of books name.
const books = [
    {id: 1, name: 'Book title 1', authorId: 1},
    {id: 2, name: 'Book title 2', authorId: 2},
    {id: 3, name: 'Book title 3', authorId: 3},
    {id: 4, name: 'Book title 4', authorId: 4},
    {id: 5, name: 'Book title 5', authorId: 5},
    {id: 6, name: 'Book title 6', authorId: 6},
    {id: 7, name: 'Book title 7', authorId: 7},
    {id: 8, name: 'Book title 8', authorId: 8}
];

// Making BookType to use it as GraphQL type for books.
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) =>{
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
});

// Making AuthorType to use it as GraphQL type for authors.
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book.',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) =>{
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
});

// GraphQL root query type. We have to add our objects type here.
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single book',
            args: {
              id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: ' List of all books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: ' List of all authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A single author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
    })
});

// To add a new object. Adding a new book.
const RootMutationType = new GraphQLObjectType({
   name: 'Mutation',
   description: 'Root Mutation',
   fields: () => ({
       addBook:{
           type: BookType,
           description: 'Add a book',
           args:{
               name: {type: GraphQLNonNull(GraphQLString)},
               authorId: {type: GraphQLNonNull(GraphQLInt)}
           },
           resolve: (parent, args) =>{
               const book = {id: books.length + 1, name: args.name, authorId: args.authorId};
               books.push(book);
               return book;
           }
       }
   })
});

// Initializing schema of the GraphQLSchema.
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

// Initializing the url and schema to the express application instance.
app.use(
    '/graphql',
    graphqlHTTP({
        graphiql: true,
        schema: schema
    }),
);

// Running the server on the port 5000
app.listen(5000., () => {
    console.log("server is running.");
});
