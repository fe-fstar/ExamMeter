import { backendUrl } from "./backend-url";

export default async function isAuthenticated() {
    try {
        let response = await fetch(`${backendUrl}/get_user_information`, {
            method: "GET",
            headers: { token: localStorage.getItem("token") }
        });
        
        if (response.status != 200){
            return false;
        }else{
            let parsed_response = await response.json();
            return parsed_response.success;
        }
    } catch (error) {
        return false;
    }
};