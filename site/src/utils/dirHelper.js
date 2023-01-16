import axios from 'axios'


export const getFiles = async (path) => {
    const res = await axios.get("http://192.168.208.187/api/files?path=" + path)
    return res.data
}


export const getRelDir = (path) => {
    if (path !== null && path !== undefined && path.length > 0) {
        return path
    }
    else {
        return ""
    }
}

export const getBaseDir = async () => {
    const res = await axios.get("http://192.168.208.187/api/basedir");
    return res.data;
}