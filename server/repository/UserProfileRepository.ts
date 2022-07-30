import { AppDataSource } from '../database/DataSource';
import { UserProfile } from '../models/UserProfile';

const userProfileDAO = AppDataSource.getRepository(UserProfile);

export const createDefaultUserProfile = async (): Promise<UserProfile> => {
    const newUserProfile = await userProfileDAO.create();
    await userProfileDAO.save(newUserProfile);
    return newUserProfile;
};
