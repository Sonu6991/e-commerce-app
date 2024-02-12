import User from "../models/userModel";

export const checkUserExists = async (query: any) => {
    try {
        const user: any = await User.findOne(query);
        if (!user) {
            throw new Error("Invalid user");
        }
        return user
    } catch (error) {
        return error
    }

}