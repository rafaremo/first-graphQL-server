const graphql = require('graphql');
const User = require('../models/User');
const Cotizacion = require('../models/Cotizacion');
const Product = require('../models/Product');

// const dataCot = [
//   {id: "1", name: 'Minerva Biomed Group WebPage', monto: 50000, userId: "1"},
//   {id: "2", name: 'Beka Joyería', monto: 60000, userId: "2"},
//   {id: "3", name: 'RG Partners', monto: 500000, userId: "1"},
//   {id: "4", name: 'Solo Mexicano', monto: 70000, userId: "1"}
// ];

// const dataUser = [
//   {id: "1", name: "Rafael González", username: "rafa@acromati.co", age: 28},
//   {id: "2", name: "Mónica Gutiérrez", username: "monica@acromati.co", age: 26}
// ];

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

const CotizacionType = new GraphQLObjectType({
  name: 'Cotizacion',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    amount: {
      type: GraphQLFloat
    },
    user: {
      type: UserType,
      resolve: (parent, args) => {
        // return dataUser.find(user => user.id === parent.userId);
        
        return User.findById(parent.user);
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve: (parent, args) => {
        return parent.products.map(prod => Product.findById(prod));
      }
    }
  })
});

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    defaultPrice: {
      type: GraphQLFloat
    },
    author: {
      type: UserType,
      resolve: (parent, args) => {
        return User.findById(parent.author);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
    cotizaciones: {
      type: new GraphQLList(CotizacionType),
      resolve: (parent, args) => {
        // return dataCot.filter(cot => cot.userId === parent.id);

        return Cotizacion.find({user: parent.id});
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    cotizacion: {
      type: CotizacionType,
      args: { id: { type: GraphQLID }},
      resolve: (parent, args) => {
        // return dataCot.find(cot => cot.id === args.id);

        return Cotizacion.findById(args.id);
      }
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID }},
      resolve: (parent, args) => {
        // return dataCot.find(cot => cot.id === args.id);

        return Product.findById(args.id);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID }},
      resolve: (parent, args) => {
        // return dataUser.find(us => us.id === args.id);

        return User.findById(args.id);
      }
    },
    cotizaciones: {
      type: new GraphQLList(CotizacionType),
      resolve: (parent, args) => {
        // return dataCot;

        return Cotizacion.find({});
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve: (parent, args) => {
        // return dataCot;

        return Product.find({});
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (parent, args) => {
        // return dataUser;

        return User.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt }
      },
      resolve: (parent, args) => {
        let user = new User({
          name: args.name,
          age: args.age,
          username: args.username
        });

        return user.save();
      }
    },
    addCotizacion: {
      type: CotizacionType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: GraphQLFloat },
        userId: { type: new GraphQLNonNull(GraphQLID) },
        products: { type: new GraphQLList(GraphQLID) }
      },
      resolve: (parent, args) => {
        let cotizacion = new Cotizacion({
          name: args.name,
          amount: args.amount,
          user: args.userId,
          products: args.products
        });

        return cotizacion.save();
      }
    },
    addProduct: {
      type: ProductType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLString},
        defaultPrice: {type: GraphQLFloat},
        author: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve: (parent, args) => {
        let product = new Product({
          name: args.name,
          description: args.description,
          defaultPrice: args.defaultPrice,
          author: args.author
        });

        return product.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})