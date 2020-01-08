import axios from "axios";
import { Browser as JotBrowser } from 'jwt-jot'

import store from '../redux/store';
import { onLogout } from '../redux/actions';

export default {
    // Gets all albums
    getAlbums: function () {
        return axiosP.get("/albums");
    },
    // Gets the album with the given id
    getAlbum: function (id) {
        return axiosP.get("/albums/" + id);
    },
    // Deletes the album with the given id
    deleteAlbum: function (id) {
        return axiosP.delete("/albums/" + id);
    },
    // Saves a album to the database
    saveAlbum: function (albumData) {
        return axiosP.post("/albums", albumData);
    }
};

const axiosP = axios.create({
    baseURL: '/api/protected'
});

// https://www.npmjs.com/package/axios#interceptors
axiosP.interceptors.request.use(
    async function (config) {
        const source = axios.CancelToken.source();
        let authHeader;
        try {
            authHeader = await getAuthHeaderAsync();
        } catch (error) {
            store.dispatch(onLogout());
            source.cancel(`Request canceled: ${error}`);
            return { cancelToken: source.token };
        }

        config.headers = {
            ...config.headers,
            ...authHeader
        }

        return config;
    }
);

function getAuthHeaderAsync() {
    const jot = new JotBrowser('jwt');

    if (jot.getToken() && jot.valid()) return Promise.resolve(makeAuthHeader(jot));

    const refreshJot = new JotBrowser('refreshJwt');

    if (!refreshJot.getToken()) return Promise.reject('Refresh token not found on client.');
    if (!refreshJot.valid()) return Promise.reject('Refresh token not valid on client.');

    return axios.post("/api/auth/refresh", { token: refreshJot.getToken() })
        .then(res => res.data)
        .then(data => {
            if (data.success) {
                // save new tokens in localstorage
                new JotBrowser('refreshJwt', data.tokens.refresh);
                const jot = new JotBrowser('jwt', data.tokens.user);
                return makeAuthHeader(jot);
            } else {
                return Promise.reject(data.errors.token);
            }
        });
}

function makeAuthHeader(jot) {
    return { Authorization: 'Bearer ' + jot.getToken() };
}