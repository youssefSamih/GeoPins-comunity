const user = {
  _id: "1",
  name: "Reed",
  email: "youssef.samih97@gmail.com",
  picture: "https://cloudinary.com/asdf"
}

module.exports = {
  Query: {
    me: () => user
  }
}