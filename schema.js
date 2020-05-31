const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

// Image Asset

// Cutomer Type
const AdvertisementType = new GraphQLObjectType({
  name: "Advertisement",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    name: { type: GraphQLString },
    logo: { type: GraphQLString },
    image: { type: GraphQLString },
    image_asset: { type: new GraphQLList(GraphQLString) },
    description: { type: GraphQLString },
    longitude: { type: GraphQLString },
    latitude: { type: GraphQLString },
  }),
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    advertisement: {
      type: AdvertisementType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        /*
                    for(let i = 0; i < advertisements.length; i++){
                        if(advertisements[i].id == args.id){
                            return advertisements[i];
                        }
                    }
                */
        return axios
          .get("http://localhost:3000/advertisements/" + args.id)
          .then((res) => res.data);
      },
    },
    advertisements: {
      type: new GraphQLList(AdvertisementType),
      resolve(parentValue, args) {
        // return advertisements;
        return axios
          .get("http://localhost:3000/advertisements/")
          .then((res) => res.data);
      },
    },
  },
});

//Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAdvertisement: {
      type: AdvertisementType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        logo: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
        image_asset: {
          type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        },
        description: { type: new GraphQLNonNull(GraphQLString) },
        longitude: { type: new GraphQLNonNull(GraphQLString) },
        latitude: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/advertisements/", {
            id: args.id,
            title: args.title,
            name: args.name,
            logo: args.logo,
            image: args.image,
            image_asset: args.image_asset,
            description: args.description,
            longitude: args.longitude,
            latitude: args.latitude,
          })
          .then((res) => res.data);
      },
    },
    deleteAdvertisement: {
      type: AdvertisementType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios
          .delete("http://localhost:3000/advertisements/" + args.id)
          .then((res) => res.data);
      },
    },
    editAdvertisement: {
      type: AdvertisementType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        name: { type: GraphQLString },
        logo: { type: GraphQLString },
        image: { type: GraphQLString },
        image_asset: {
          type: new GraphQLList(GraphQLString),
        },
        description: { type: GraphQLString },
        longitude: { type: GraphQLString },
        latitude: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .patch("http://localhost:3000/advertisements/" + args.id, args)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
