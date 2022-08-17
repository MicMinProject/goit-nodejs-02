const express = require("express");
const router = express.Router();
const contactsController = require("../../controller/contacts");

/**
 * @swagger
 *    components:
 *     schemas:
 *       Contact:
 *        type: object
 *        required:
 *          -name
 *          -email
 *          -phone
 *        properties:
 *          name:
 *            type: string
 *            definition: Name of contact
 *            required: true
 *          email:
 *            type: string
 *            definition: Email of contact
 *            required: true
 *          phone:
 *            type: string
 *            definition: Phone number of contact
 *            required: true
 *        example:
 *          name: John Smith
 *          email: john.smith@gmail.com
 *          phone: 123-456-789
 *       ContactUpdate:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            definition: Name of contact
 *            required: false
 *          email:
 *            type: string
 *            definition: Email of contact
 *            required: false
 *          phone:
 *            type: string
 *            definition: Phone number of contact
 *            required: false
 *        example:
 *          name: John Smith
 *          email: john.smith@gmail.com
 *          phone: 123-456-789
 */

/**
 * @swagger
 * /api/contacts/:
 *   get:
 *    tags:
 *    - contacts
 *    description: Get all contacts
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not found
 *   post:
 *    tags:
 *    - contacts
 *    requestBody:
 *      description: Enter contact's data
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Contact'
 *    description: Add contact
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Missing required name field
 */

router.get("/", contactsController.get);

router.post("/", contactsController.add);

/**
 * @swagger
 * /api/contacts/:contactId/:
 *   get:
 *    tags:
 *    - contacts
 *    parameters:
 *      - in: path
 *        name: contactId
 *        required: true
 *        schema:
 *          type: string
 *        style: simple
 *        explode: false
 *    description: Get contact by id
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not found
 *   delete:
 *    tags:
 *    - contacts
 *    parameters:
 *      - in: path
 *        name: contactId
 *        required: true
 *        schema:
 *          type: string
 *        style: simple
 *        explode: false
 *    description: Delete contact by id
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not found
 *   put:
 *    tags:
 *    - contacts
 *    requestBody:
 *      description: Enter contact's data
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ContactUpdate'
 *    parameters:
 *      - in: path
 *        name: contactId
 *        required: true
 *        schema:
 *          type: string
 *        style: simple
 *        explode: false
 *    description: Update contact
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not found
 */

router.get("/:contactId", contactsController.getById);

router.delete("/:contactId", contactsController.remove);

router.put("/:contactId", contactsController.updateContact);

/**
 * @swagger
 * /api/contacts/:contactId/favorite/:
 *  patch:
 *    tags:
 *    - contacts
 *    parameters:
 *      - in: path
 *        name: contactId
 *        required: true
 *        schema:
 *          type: string
 *        style: simple
 *        explode: false
 *    requestBody:
 *      required: true
 *      description: Does the contact belong to favorites?
 *      content:
 *        application/json:
 *          schema:
 *            name: favorite
 *            type: boolean
 *            default: false
 *            example:
 *              favorite: true
 *    description: Add to favorites
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not found
 *        
 */

router.patch("/:contactId/favorite", contactsController.updateFavorite);

module.exports = router;
