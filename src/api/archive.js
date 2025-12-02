import api from "./client";

export const getArchive = () =>{
    return api.get("api/archive")
}