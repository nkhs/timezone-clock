export default class Storage {
    static setStorage(key, value) {

        if (typeof value == 'object')
            return localStorage.setItem(key, JSON.stringify(value));
        return localStorage.setItem(key, value);

    }

    static getStorage(key) {

        let data = localStorage.getItem(key);
        try {
            return JSON.parse(data)
        } catch (error) {
            return data;
        }


    }
}