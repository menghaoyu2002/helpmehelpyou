import { NextFunction, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import linkService = require('../services/LinkService');
import userService = require('../services/UserService');

export const createNewLink = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const newLink = await linkService.createNewLink(res.locals.user, {
        ...matchedData(req, { locations: ['body'] }),
    });

    return res.status(201).json({
        ...newLink,
        owner: userService.castUserToAuthor(res.locals.user),
    });
};

export const updateExistingLink = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const updatedLink = await linkService.updateLink(
        res.locals.link,
        req.body.name,
        req.body.url
    );

    return res.status(200).json({
        ...updatedLink,
        owner: userService.castUserToAuthor(updatedLink.owner),
    });
};

export const authorizeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const link = await linkService.findLinkById(
        parseInt(req.params.linkId, 10)
    );

    if (!link) {
        return res.status(400).json({
            message: 'Invalid Link Id',
        });
    }

    res.locals.link = link;

    if (link.owner.id !== res.locals.user.id) {
        return res.status(403).json({
            message:
                'The current user is not authorized to perform this action',
        });
    }

    next();
};
