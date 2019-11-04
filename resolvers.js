const { AuthenticationError } = require('apollo-server');
const user = {
  _id: "1",
  name: "Reed",
  email: "youssef.samih97@gmail.com",
  picture: "https://cloudinary.com/asdf"
};

const authenticated = next => (root, args, ctx, info ) => {
  if(!ctx.currentUser) {
    // throw new AuthenticationError("You must be logged in");
    console.log(ctx)
  }
  return next(root, args, ctx, info);
  // console.log(ctx);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser)
  }
};