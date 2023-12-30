import { backendUrl } from "./backend-url";

export default async function isAuthenticated() {
    try {
        let response = await fetch(`${backendUrl}/verify`, {
            method: "GET",
            headers: { token: localStorage.token }
        });
        
        return response.success;
    } catch (error) {
        console.error(error.message);
    }
};