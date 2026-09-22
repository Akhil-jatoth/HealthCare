const API_URL = "http://localhost:5000/api";


export function getToken() {

    return localStorage.getItem("token");

}


export async function loginUser(email, password) {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Login failed"
        );

    }


    // Store JWT
    localStorage.setItem(
        "token",
        data.token
    );


    return data;

}


export async function getProfile() {

    const token = getToken();


    if (!token) {

        return null;

    }


    const response = await fetch(
        `${API_URL}/auth/profile`,
        {
            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Profile request failed"
        );

    }


    return data;

}


export function logoutUser() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}