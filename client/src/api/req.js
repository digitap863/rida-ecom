import { AxiosAdmin } from "./url";



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
            window.location.href = "/";
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

// export async function getdata(route) {
//     return AxiosAdmin.get(route, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//         // withCredentials: true,
//     }).catch((error) => {
//         if (error.response && error.response.status === 401) {
//             console.log(error.response.data.message);
//             localStorage.removeItem("adminToken");
//             window.location.href = "/login";
//         }
//         throw error;
//     });
// }
export async function getdata(route) {

    try {
        const res = await AxiosAdmin.get(route, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
            // withCredentials: true,
        });
        return res.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.message);
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
        }
        throw error;

    }

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
