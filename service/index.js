const { Contact } = require("./schemas/contacts");
const { User } = require("./schemas/users");

// Contacts

const getAllContacts = ({ _id, favorite }) => {
  if (favorite) {
    if (favorite === "false") {
      return Contact.find({ owner: _id, favorite: false });
    }
    return Contact.find({ owner: _id, favorite: true });
  } else {
    return Contact.find({ owner: _id });
  }
};

const getContactById = ({ contactId, _id }) =>
  Contact.findById({ _id: contactId, owner: _id });

const addContact = (body) => Contact.insertMany(body, { new: true });

const removeContact = ({ contactId, _id }) =>
  Contact.findOneAndDelete({ _id: contactId, owner: _id });

const updateContact = ({ contactId, _id }, body) =>
  Contact.findOneAndUpdate({ _id: contactId, owner: _id }, body, { new: true });

const updateFavorite = ({ contactId, _id }, body) =>
  Contact.findOneAndUpdate({ _id: contactId, owner: _id }, body, { new: true });

// Users

const findUser = (body) => User.findOne(body);

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateFavorite,
  findUser,
};
