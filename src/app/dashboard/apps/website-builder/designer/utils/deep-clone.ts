/**
 * Creates a deep clone of an object to avoid read-only property issues
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") {
      return obj
    }
  
    if (Array.isArray(obj)) {
      return obj.map((item) => deepClone(item)) as unknown as T
    }
  
    const clonedObj = {} as T
  
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
  
    return clonedObj
  }
  