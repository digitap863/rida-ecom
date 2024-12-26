import { AxiosAdmin } from "./url";


export const adminLogin = async (data) => {
    try {
        const response = await AxiosAdmin.post("/login", { data });
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                throw new Error(data.message);
            } else if (status === 500) {
                throw new Error("Internal server error. Please try again later.");
            }
        } else if (error.request) {
            throw new Error(
                "No response received. Please check your internet connection."
            );
        } else {
            throw new Error("An error occurred. Please try again later.");
        }
    }
};
export const postData = async (route, data) => {
    try {
        const response = await AxiosAdmin.post(route, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        });

        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.message);
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
        }
        throw error;
    }
};


export const postForm = async (route, data) => {
    try {
        const response = await AxiosAdmin.post(route, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        });

        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.message);
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
        }
        throw error;
    }
};
export const putForm = async (route, data) => {
    try {
        const response = await AxiosAdmin.put(route, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        });

        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.message);
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
        }
        throw error;
    }
};

export async function getdata(route) {
    return AxiosAdmin.get(route, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        // withCredentials: true,
    }).catch((error) => {
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.message);
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
        }
        throw error;
    });
}


export async function deleteData(route) {
    return AxiosAdmin.delete(route, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
     
    }).catch((error) => {
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.message);
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
        }
        throw error;
    });
}
