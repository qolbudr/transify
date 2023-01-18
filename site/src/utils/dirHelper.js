import axios from 'axios'
import { Buffer } from 'buffer';

const base_url = 'http://192.168.7.187/'


export const getFiles = async (path) => {
    const res = await axios.get(base_url + "api/files?path=" + path)
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
    const res = await axios.get(base_url + "api/basedir");
    return res.data;
}

export const download = (path) => {
    window.location.href = base_url + "api/download?file=" + path
}

export const zipDir = async (path) => {
    const output = await axios.get(base_url + "api/downloadDir?dir=" + path);
    return output.data
}

export const zipFile = async (path) => {
    const output = await axios.get(base_url + "api/downloadZipFile?file=" + path);
    return output.data
}

export const isTest = async () => {
    const res = await axios.get(base_url + "api/isTest")
    return res.data
}