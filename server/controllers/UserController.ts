import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import userService = require('../services/UserService');

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const [success, token] = await userService.login(email, password);

    if (!success) {
        return res.status(403).json({
            type: 'InvalidLoginInformationError',
            message: 'Invalid email or password',
        });
    }

    res.status(200).json({ auth_token: token });
};

export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newUser = await userService.createUser(req.body);
        res.status(201).json({ userId: newUser.id });
    } catch (err: any) {
        res.status(400).json({
            type: 'DuplicateEmailError',
            message:
                'A User with this account already exists, please log in instead',
        });
    }
};
