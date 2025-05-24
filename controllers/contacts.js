// const mongodb = require('../data/database');
// const createError = require('http-errors');
// const ObjectId = require('mongodb').ObjectId; // unique object id (primary key)

// const getAll = async (req, res) => {
//     //swagger.tags=['Contacts']
//     const result = await mongodb.getDatabase().db().collection('contacts').find();
//     result.toArray().then((contacts) => {
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json(contacts);
//     });
// };

// const getSingle = async (req, res) => {
//     //swagger.tags=['Contacts']
//     const contactId = new ObjectId(req.params.id);
//     const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: contactId });
//     result.toArray().then((contacts) => {
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json(contacts[0]);
//     });
// };

// const createContact = async (req, res) => {
//     //swagger.tags=['Contacts']
//     const contact = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//     };

//     const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
//     if (response.acknowledged) { 
//         res.status(204).send();
//     } else {
//         res.status(500).json(response.error || 'An error occurred while creating the contact.');
//     }
// };

// const updateContact = async (req, res) => {
//     //swagger.tags=['Contacts']
//     const contactId = new ObjectId(req.params.id);
//     const contact = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//     };

//     const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: contactId },  contact);

//     if (response.modifiedCount > 0) {
//         res.status(204).send();
//     } else {
//         res.status(500).json(response.error || 'An error occurred while updating the contact.');
//     }
// };

// const deleteContact = async (req, res) => {
//     //swagger.tags=['Contacts']
//     const contactId = new ObjectId(req.params.id);
//     const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: contactId }); 

//     if (response.deletedCount > 0) {
//         res.status(204).send();
//     } else {
//         res.status(500).json(response.error || 'An error occurred while deleting the contact.');
//     }
// };

// module.exports = {
//     getAll,
//     getSingle,
//     createContact,
//     updateContact,
//     deleteContact
// };






const mongodb = require('../data/database');
const createError = require('http-errors');
const ObjectId = require('mongodb').ObjectId;

const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && (String)(new ObjectId(id)) === id;
};

const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    const contacts = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    next(createError(500, 'Failed to retrieve contacts.'));
  }
};

const getSingle = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return next(createError(400, 'Invalid ID format.'));
    }

    const contactId = new ObjectId(id);
    const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: contactId });
    const contacts = await result.toArray();

    if (!contacts.length) {
      return next(createError(404, 'Contact not found.'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts[0]);
  } catch (err) {
    next(createError(500, 'Failed to retrieve the contact.'));
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
      res.status(201).send();
    } else {
      return next(createError(500, 'Contact creation failed.'));
    }
  } catch (err) {
    next(createError(500, 'Failed to create contact.'));
  }
};

const updateContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return next(createError(400, 'Invalid ID format.'));
    }

    const contactId = new ObjectId(id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: contactId }, contact);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      return next(createError(404, 'Contact not found or update failed.'));
    }
  } catch (err) {
    next(createError(500, 'Failed to update contact.'));
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return next(createError(400, 'Invalid ID format.'));
    }

    const contactId = new ObjectId(id);
    const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: contactId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      return next(createError(404, 'Contact not found or delete failed.'));
    }
  } catch (err) {
    next(createError(500, 'Failed to delete contact.'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
