import axios from 'axios';

const userService = {
    createUser: async (userData) => {
        try {
            const response = await axios.post('/api/users', userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
};

export default userService;