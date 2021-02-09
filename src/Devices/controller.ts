export function validation(data: any): any | Error {
  try {
    const result = data;//JSON.parse(data);
    return result.data.data;
  } catch (e) {
    throw new Error ('Invalid JSON');
  }
}