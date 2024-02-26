import { api } from "../APIHandler";

export async function getCourses() {
    try {
        const response = await api('/courses');
        return response.data;
    } catch(error) {
        console.error('Error fetching courses: ' + error);
        throw error;
    }
}