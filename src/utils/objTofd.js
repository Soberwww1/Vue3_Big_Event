export const objectToFormData = (obj, parentKey = "") => {
    const formData = new FormData();
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const combinedKey = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key];
        
        if (value instanceof Blob || value instanceof File) {
          formData.append(combinedKey, value);
        } else if (value instanceof Array) {
          value.forEach((item, i) => {
            if (item instanceof Object) {
              const nestedData = objectToFormData(item, `${combinedKey}[${i}]`);
              nestedData.forEach((val, nestedKey) => {
                formData.append(nestedKey, val);
              });
            } else {
              formData.append(`${combinedKey}[${i}]`, item);
            }
          });
        } else if (value instanceof Object && value !== null) {
          const nestedData = objectToFormData(value, combinedKey);
          nestedData.forEach((val, nestedKey) => {
            formData.append(nestedKey, val);
          });
        } else {
          formData.append(combinedKey, value === undefined || value === null ? "" : value);
        }
      }
    }
    return formData;
}  