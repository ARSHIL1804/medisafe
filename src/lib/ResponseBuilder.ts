const defaultExcludedItemsFromResponse = [ '__v', '_id' ];

export default class ResposeBuilder{

    static filterData(data:any):any {
        if (Array.isArray(data)) {
            return data.map(item => this.removeKeys(item));
        } else if (typeof data === 'object' && data !== null) {
            return this.removeKeys(data);
        }
        return data;
    }

    static removeKeys(obj:any): any{
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.removeKeys(item));
        }
        Object.keys(obj).forEach(key => {
            if (defaultExcludedItemsFromResponse.includes(key)) {
                delete obj[key];
            } else {
                obj[key] = this.removeKeys(obj[key]);
            }
        });
        return obj;
    }
}