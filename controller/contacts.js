const service = require("../service");
const {
  patternContactAdd,
  patternContactUpdate,
  patternFavorite,
} = require("../joi");

const get = async (req, res, next) => {
  const { page, limit, favorite } = req.query;
  const { _id } = req.user;
  try {
    if (!page && !limit && favorite) {
      if (favorite !== "true" && favorite !== "false") {
        return res.status(400).json({ message: "favorite must be boolean" });
      }
      const filtered = await service.getAllContacts({ _id, favorite }).lean();
      return res.status(200).json({ data: filtered });
    }
    if (page && limit && !favorite) {
      if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res
          .status(400)
          .json({ message: "page and limit must be a number" });
      }
      const skip = (page - 1) * limit;
      const paginatedContacts = await service
        .getAllContacts({ _id, favorite })
        .skip(skip)
        .limit(limit)
        .lean();
      return res.status(200).json({
        data: paginatedContacts,
      });
    }
    if (page && limit && favorite) {
      if (favorite !== "true" && favorite !== "false") {
        return res.status(400).json({ message: "faavorite must be boolean" });
      }
      if (isNaN(Number(page)) || isNaN(Number(limit))) {
        return res
          .status(400)
          .json({ message: "page and limit must be a number" });
      }
      const skip = (page - 1) * limit;
      const paginatedContacts = await service
        .getAllContacts({ _id, favorite })
        .skip(skip)
        .limit(limit)
        .lean();
      return res.status(200).json({
        data: paginatedContacts,
      });
    }
    const contacts = await service.getAllContacts({ _id, favorite }).lean();
    res.status(200).json({ data: contacts });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  try {
    const contact = await service.getContactById({ contactId, _id });
    res.status(200).json({ data: contact });
  } catch (err) {
    next(res.status(404).json({ message: "Not found" }));
  }
};

const add = async (req, res, next) => {
  const { _id } = req.user;
  const validated = patternContactAdd.validate(req.body);
  if (validated.error) {
    return res.status(400).json({
      message: "missing required name field",
    });
  }
  const { name, email, phone } = validated.value;

  try {
    const contact = await service.addContact({
      name,
      email,
      phone,
      owner: _id,
    });
    res.status(201).json({ data: contact });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  try {
    const contact = await service.removeContact({ contactId, _id });
    if (contact) {
      res.status(200).json({
        data: contact,
        message: "contact deleted",
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const validated = patternContactUpdate.validate(req.body);
  if (validated.error) {
    res.status(400).json({ message: validated.error.message });
  }
  const { name, email, phone } = validated.value;

  if (!name && !email && !phone) {
    res.status(400).json({ message: "missing fields" });
  } else {
    try {
      const contact = await service.updateContact(
        { contactId, _id },
        {
          name,
          email,
          phone,
        },
      );
      res.status(200).json({ data: contact });
    } catch (err) {
      next(res.status(404).json({ message: "Not found" }));
    }
  }
};

const updateFavorite = async (req, res, next) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const body = req.body;
  if (Object.keys(body).find((key) => key === "favorite") !== "favorite") {
    return res.status(400).json({
      message: "missing field favorite",
    });
  } else {
    const validated = patternFavorite.validate(body);
    if (validated.error) {
      res.status(400).json({
        message: validated.error.message,
      });
    }
    const { favorite } = validated.value;

    try {
      const contact = await service.updateContact(
        { contactId, _id },
        {
          favorite,
        },
      );
      res.status(200).json({ data: contact });
    } catch (err) {
      next(res.status(404).json({ message: "Not found" }));
    }
  }
};

module.exports = {
  get,
  getById,
  add,
  remove,
  updateContact,
  updateFavorite,
};
