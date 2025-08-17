import api from "./client";

export async function searchAll(query){
    if(!query?.trim())
        return {user:[],roadmap:[]};
    const res =await api.get("/search",{params:{query}});
    return res.data?? {user:[],roadmaps:[]};
}