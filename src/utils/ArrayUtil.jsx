export default {
    deepCopy: (value) => {
        return JSON.parse(JSON.stringify(value));
    },
};